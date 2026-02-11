import { create } from 'zustand';
import { zeroDriftAI } from '../services/zero-drift';
import { HardenedRezStackRouter } from '../services/hardened-router';
import { getOrchestrator } from '../main/sovreign-orchestrator';

// Initialize routers
const smartRouter = new HardenedRezStackRouter();
const orchestrator = getOrchestrator();

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  model?: string;
  thinking?: boolean;
  sovereignStatus?: 'STABLE' | 'VIGILANT' | 'CRITICAL' | 'BYPASSED';
  vibeScore?: number;
  violations?: string[];
  fixesApplied?: string[];
  timestamp?: string;
  routingInfo?: {
    selectedModel: string;
    reasoning: string;
    confidence: number;
    estimatedVRAM: string;
    alternatives: any[];
  };
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
  smartRouterEnabled: boolean;
  
  // Actions
  sendMessage: (content: string, options?: { bypassCuration?: boolean }) => Promise<void>;
  setSelectedModel: (model: string) => void;
  checkOllamaConnection: () => Promise<void>;
  loadModels: () => Promise<void>;
  clearMessages: () => void;
  refineWithZeroDrift: (messageId: string, content: string) => Promise<void>;
  toggleSmartRouter: () => void;
}

export const useMultimodalStore = create<MultimodalStore>((set, get) => ({
  // Initial state
  messages: [],
  availableModels: [],
  selectedModel: '',
  smartRouterEnabled: true,
  ollamaStatus: {
    isConnected: false,
    isChecking: false,
    version: 'unknown',
    models: []
  },
  isGenerating: false,
  
  toggleSmartRouter: () => set((state) => ({ smartRouterEnabled: !state.smartRouterEnabled })),
  
  setSelectedModel: (model: string) => set({ selectedModel: model }),
  
  clearMessages: () => set({ messages: [] }),
  
  checkOllamaConnection: async () => {
    set((state) => ({ ollamaStatus: { ...state.ollamaStatus, isChecking: true } }));
    
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
    const { selectedModel, messages, smartRouterEnabled } = state;
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
      content: '🧠 Constitutional AI analyzing request...',
      isUser: false,
      thinking: true,
      timestamp: new Date().toISOString()
    };
    
    set({ 
      messages: [...messages, userMessage, thinkingMessage],
      isGenerating: true 
    });
    
    try {
      let modelToUse = selectedModel;
      let routingInfo = null;
      
      // ===== SMART ROUTER INTEGRATION =====
      if (smartRouterEnabled && !bypassCuration) {
        try {
          console.log('🎯 Smart Router: Analyzing request...');
          const route = await smartRouter.route({ 
            prompt: content,
            context: {}
          });
          
          modelToUse = route.model;
          routingInfo = {
            selectedModel: route.model,
            reasoning: route.reason,
            confidence: route.confidence,
            estimatedVRAM: route.estimatedVRAM,
            alternatives: route.alternatives || []
          };
          
          console.log(`✅ Smart Router selected: ${route.model} (${route.confidence}% confidence)`);
        } catch (error) {
          console.error('Smart Router failed, using default model:', error);
        }
      }
      
      // ===== OLLAMA GENERATION =====
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelToUse,
          prompt: bypassCuration ? content : `You are the RezStack Sovereign Constitutional AI. 
Follow these laws:
1. NEVER use 'any' or 'unknown' types
2. NEVER use lodash (use native structuredClone)
3. NEVER use console.log in production
4. ALWAYS handle errors with try/catch

${content}`,
          stream: false,
          options: {
            temperature: bypassCuration ? 0.8 : 0.3,
            top_p: 0.9,
            num_predict: 2048
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rawResponse = data.response;
      
      // ===== CONSTITUTIONAL CURATION =====
      let finalMessage: Message;
      
      if (bypassCuration) {
        // BYPASS MODE - Raw output
        finalMessage = {
          id: Date.now().toString(),
          content: rawResponse,
          isUser: false,
          model: modelToUse,
          sovereignStatus: 'BYPASSED',
          vibeScore: 0,
          violations: [],
          fixesApplied: [],
          timestamp: new Date().toISOString(),
          routingInfo
        };
      } else {
        // CONSTITUTIONAL MODE - Apply zero-drift curation
        const curation = zeroDriftAI.curate(rawResponse);
        
        console.log('⚖️ Constitutional Audit:', {
          score: curation.vibeScore,
          status: curation.status,
          violations: curation.violations.length,
          fixes: curation.fixesApplied.length
        });

        finalMessage = {
          id: Date.now().toString(),
          content: curation.correctedCode || rawResponse,
          isUser: false,
          model: modelToUse,
          sovereignStatus: curation.status || 'STABLE',
          vibeScore: curation.vibeScore || 100,
          violations: curation.violations || [],
          fixesApplied: curation.fixesApplied || [],
          timestamp: new Date().toISOString(),
          routingInfo
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
            content: `❌ Constitutional Error: ${error.message || 'Failed to generate response'}\n\nMake sure Ollama is running with: ollama serve`,
            isUser: false,
            model: 'error',
            sovereignStatus: 'CRITICAL',
            vibeScore: 0,
            violations: ['Ollama connection failed'],
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
  
  refineWithZeroDrift: async (messageId: string, content: string) => {
    const { messages, selectedModel } = get();
    
    const thinkingId = `refine-${Date.now()}`;
    const thinkingMessage: Message = {
      id: thinkingId,
      content: '⚖️ Constitutional refinement in progress...',
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
      // Apply constitutional curation directly
      const curation = zeroDriftAI.curate(content);
      
      const refinedMessage: Message = {
        id: `refined-${Date.now()}`,
        content: curation.correctedCode,
        isUser: false,
        model: selectedModel,
        sovereignStatus: curation.status || 'STABLE',
        vibeScore: curation.vibeScore || 100,
        violations: curation.violations || [],
        fixesApplied: curation.fixesApplied || [],
        timestamp: new Date().toISOString()
      };
      
      set((state) => {
        const newMessages = state.messages.map(m => 
          m.id === thinkingId ? refinedMessage : m
        );
        return { 
          messages: newMessages,
          isGenerating: false 
        };
      });
      
    } catch (error) {
      console.error('Refinement failed:', error);
      set({ isGenerating: false });
    }
  }
}));
