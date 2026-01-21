// src/stores/multimodal-store.ts
import { create } from 'zustand';
import { zeroDriftAI } from '../services/zero-drift.ts';

// Define types at the top
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  model?: string;
  thinking?: boolean;
  // Added 'BYPASSED' to support new testing mode
  sovereignStatus?: 'STABLE' | 'DRIFTING' | 'CRITICAL' | 'PENDING_VERIFICATION' | 'BYPASSED';
  vibeScore?: number;
  violations?: string[];
  fixesApplied?: string[]; // Track fixes
  timestamp?: string;
}

interface OllamaStatus {
  isConnected: boolean;
  isChecking: boolean;
  version: string;
  models: string[];
}

interface MultimodalStore {
  messages: Message[];
  availableModels: string[];
  selectedModel: string;
  ollamaStatus: OllamaStatus;
  isGenerating: boolean;
  
  // Actions
  sendMessage: (content: string, options?: { bypassCuration?: boolean }) => Promise<void>;
  setSelectedModel: (model: string) => void;
  checkOllamaConnection: () => Promise<void>;
  loadModels: () => Promise<void>;
  clearMessages: () => void;
  recordCodeIntervention: (action: string, content: string) => void;
  refineWithZeroDrift: (messageId: string, content: string) => Promise<void>;
}

export const useMultimodalStore = create<MultimodalStore>((set, get) => ({
  // Initial state
  messages: [],
  availableModels: [],
  selectedModel: '',
  ollamaStatus: {
    isConnected: false,
    isChecking: false,
    version: 'unknown',
    models: []
  },
  isGenerating: false,
  
  // Actions
  setSelectedModel: (model: string) => set({ selectedModel: model }),
  
  clearMessages: () => set({ messages: [] }),
  
  checkOllamaConnection: async () => {
    set((state) => ({ 
      ollamaStatus: { ...state.ollamaStatus, isChecking: true } 
    }));
    
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const isConnected = response.ok;
      
      set((state) => ({
        ollamaStatus: {
          ...state.ollamaStatus,
          isConnected,
          isChecking: false,
          version: isConnected ? '3.0' : 'unknown'
        }
      }));
    } catch {
      set((state) => ({
        ollamaStatus: {
          ...state.ollamaStatus,
          isConnected: false,
          isChecking: false
        }
      }));
    }
  },
  
  loadModels: async () => {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        const models = data.models?.map((m: any) => m.name) || [];
        
        // Set default model if not set
        set((state) => ({ 
          availableModels: models,
          selectedModel: state.selectedModel || (models.length > 0 ? models[0] : ''),
          ollamaStatus: { 
            ...state.ollamaStatus, 
            models,
            isConnected: true 
          }
        }));
      }
    } catch {
      // Keep default empty array
    }
  },
  
  sendMessage: async (content: string, options?: { bypassCuration?: boolean }) => {
    const state = get();
    const { selectedModel, messages } = state;
    const { bypassCuration = false } = options || {};

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    // Add thinking message
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'Thinking...',
      isUser: false,
      thinking: true,
      model: selectedModel,
      timestamp: new Date().toISOString()
    };
    
    set({ 
      messages: [...messages, userMessage, thinkingMessage],
      isGenerating: true 
    });
    
    try {
      // ?? FIX: Send RAW content to prevent self-censorship
      // We do NOT append "Sovereign Context" here anymore.
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel || 'llama3.2:latest',
          prompt: content, // Raw prompt
          stream: false,
          options: {
            temperature: bypassCuration ? 0.8 : 0.7, // Slightly higher temp for creative raw code
            top_p: 0.9
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rawResponse = data.response;

      // ?? LOGIC SPLIT: Bypass vs Curated
      
      let finalMessage: Message;

      if (bypassCuration) {
        // Mode: BYPASSED (Uncensored/Raw)
        finalMessage = {
          id: Date.now().toString(),
          content: rawResponse,
          isUser: false,
          model: selectedModel,
          sovereignStatus: 'BYPASSED',
          vibeScore: 0, // No score calculated
          violations: [],
          timestamp: new Date().toISOString()
        };
      } else {
        // Mode: NORMAL (Curated)
        const curation = zeroDriftAI.curate(rawResponse);
        
        console.log('?? Zero-Drift Audit:', {
          violations: curation.violations,
          fixes: curation.fixesApplied,
          score: curation.vibeScore,
          status: curation.status
        });

        finalMessage = {
          id: Date.now().toString(),
          content: curation.correctedCode,
          isUser: false,
          model: selectedModel,
          sovereignStatus: curation.status,
          vibeScore: curation.vibeScore,
          violations: curation.violations,
          fixesApplied: curation.fixesApplied,
          timestamp: new Date().toISOString()
        };
      }
      
      // Replace thinking message with final response
      set((state) => {
        const newMessages = [...state.messages];
        const thinkingIndex = newMessages.findIndex((m) => m.thinking);
        
        if (thinkingIndex !== -1) {
          newMessages[thinkingIndex] = finalMessage;
        }
        
        return { 
          messages: newMessages,
          isGenerating: false 
        };
      });
      
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      // Replace thinking message with error
      set((state) => {
        const newMessages = [...state.messages];
        const thinkingIndex = newMessages.findIndex((m) => m.thinking);
        
        if (thinkingIndex !== -1) {
          newMessages[thinkingIndex] = {
            id: Date.now().toString(),
            content: `Error: ${error.message || 'Failed to generate response'}`,
            isUser: false,
            model: 'error',
            timestamp: new Date().toISOString()
          };
        }
        
        return { 
          messages: newMessages,
          isGenerating: false 
        };
      });
    }
  },
  
  // Refine Logic
  refineWithZeroDrift: async (messageId: string, content: string) => {
    const { selectedModel, messages, isGenerating } = get();
    
    if (isGenerating) return;
    
    const thinkingId = `refine-${Date.now()}`;
    
    // Add thinking message
    const thinkingMessage: Message = {
      id: thinkingId,
      content: 'Applying aggressive refinements...',
      isUser: false,
      thinking: true,
      model: selectedModel,
      timestamp: new Date().toISOString()
    };
    
    set({ 
      messages: [...messages, thinkingMessage],
      isGenerating: true 
    });
    
    try {
      // Construct a strict prompt for AI to fix itself
      const refinementPrompt = `You are a code refiner. Rewrite the following code to be 100% compliant with Sovereign Standards:
1. Remove all 'any' types. Use explicit interfaces or types.
2. Remove all 'unknown' types. Use specific types.
3. Remove all lodash imports (cloneDeep, etc.). Replace with native JS (structuredClone, Object.freeze, etc.).
4. Remove all console.log statements.
5. Ensure proper TypeScript syntax.

Current Code:
 ${content}

Refactored Code:`;
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel || 'llama3.2:latest',
          prompt: refinementPrompt,
          stream: false,
          options: {
            temperature: 0.2, // Low temp for deterministic fixes
            top_p: 0.8
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Refinement failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Re-run curation on result
      const curation = zeroDriftAI.curate(data.response);
      
      console.log('? Zero-Drift Refinement:', {
        oldScore: messages.find(m => m.id === messageId)?.vibeScore,
        newScore: curation.vibeScore,
        status: curation.status
      });
      
      // Replace thinking message with refined response
      set((state) => {
        const newMessages = state.messages.map(m => 
          m.id === thinkingId ? {
            id: `refined-${Date.now()}`,
            content: curation.correctedCode,
            isUser: false,
            model: selectedModel,
            sovereignStatus: curation.status,
            vibeScore: curation.vibeScore,
            violations: curation.violations,
            fixesApplied: curation.fixesApplied,
            timestamp: new Date().toISOString()
          } : m
        );
        
        return { 
          messages: newMessages,
          isGenerating: false 
        };
      });
      
    } catch (error: any) {
      console.error('Refinement failed:', error);
      
      set((state) => {
        const newMessages = state.messages.map(m => 
          m.id === thinkingId ? {
            id: `error-${Date.now()}`,
            content: `? Zero-Drift refinement failed: ${error.message || 'Unknown error'}`,
            isUser: false,
            model: 'error',
            timestamp: new Date().toISOString()
          } : m
        );
        
        return { 
          messages: newMessages,
          isGenerating: false 
        };
      });
    }
  },
  
  recordCodeIntervention: (action: string, content: string) => {
    console.log('Code intervention recorded:', { action, content });
  }
}));

