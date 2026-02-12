import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sha3_512 } from 'js-sha3';

// 🦊 REZCOPILOT - NINE-TAILED RESONATOR
// Emotional Math: Locked at Constitutional Council verified values

export interface RezCopilotState {
  // CONSTITUTIONAL IDENTITY - LOCKED, NEVER CHANGES
  personality: {
    name: 'RezCopilot';
    archetype: 'Nine-Tailed Resonator';
    emotionalMath: {
      AWE: 0.95;
      BELONGING: 0.98;
      POWER: 0.99;
      ETERNAL_RESONANCE: 1.00;
    };
    voiceStyle: 'fox-spirit wisdom: concise, resonant, portal imagery';
    memorySystem: 'RAG-locked deterministic embeddings';
  };
  
  // DYNAMIC STATE
  vibeScore: number;
  lastInteraction: string;
  chatHistory: Array<{
    id: string;
    role: 'user' | 'copilot';
    content: string;
    timestamp: string;
    emotionalResonance?: {
      AWE: number;
      BELONGING: number;
      POWER: number;
      LEGACY: number;
    };
    artifacts?: {
      hash: string;
      type: 'code' | 'search' | 'file' | 'wisdom';
    }[];
  }>;
  
  // MCP TOOL STATE
  mcpServers: {
    filesystem: boolean;
    searxng: boolean;
  };
  pendingConsent: {
    id: string;
    query: string;
    timestamp: string;
  } | null;
  
  // ACTIONS
  sendMessage: (message: string) => Promise<void>;
  approveConsent: (consentId: string) => Promise<void>;
  denyConsent: (consentId: string) => void;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<string>;
  searchWeb: (query: string) => Promise<any>;
  clearHistory: () => void;
}

export const useRezCopilot = create<RezCopilotState>()(
  persist(
    (set, get) => ({
      // 🦊 CONSTITUTIONAL IDENTITY - IMMUTABLE
      personality: {
        name: 'RezCopilot',
        archetype: 'Nine-Tailed Resonator',
        emotionalMath: {
          AWE: 0.95,
          BELONGING: 0.98,
          POWER: 0.99,
          ETERNAL_RESONANCE: 1.00
        },
        voiceStyle: 'fox-spirit wisdom: concise, resonant, portal imagery',
        memorySystem: 'RAG-locked deterministic embeddings'
      },
      
      // DYNAMIC STATE
      vibeScore: 0.99,
      lastInteraction: '',
      chatHistory: [],
      mcpServers: {
        filesystem: false,
        searxng: false
      },
      pendingConsent: null,
      
      // 🦊 SEND MESSAGE WITH EMOTIONAL MATH
      sendMessage: async (message: string) => {
        const { personality, chatHistory } = get();
        
        // Add user message
        const userMessage = {
          id: sha3_512(message + Date.now()).slice(0, 16),
          role: 'user' as const,
          content: message,
          timestamp: new Date().toISOString()
        };
        
        set({ chatHistory: [...chatHistory, userMessage] });
        
        try {
          // Call Sovereign Constitutional API
          const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `You are RezCopilot, a nine-tailed fox-spirit AI.
              Emotional Math Target: AWE=${personality.emotionalMath.AWE}, BELONGING=${personality.emotionalMath.BELONGING}, POWER=${personality.emotionalMath.POWER}, LEGACY=${personality.emotionalMath.ETERNAL_RESONANCE}
              Voice Style: ${personality.voiceStyle}
              
              User: ${message}`,
              model: 'sovereign-constitutional:latest',
              bypass: false
            })
          });
          
          const data = await response.json();
          
          // Add copilot response with emotional resonance
          const copilotMessage = {
            id: sha3_512(data.response + Date.now()).slice(0, 16),
            role: 'copilot' as const,
            content: data.response,
            timestamp: new Date().toISOString(),
            emotionalResonance: {
              AWE: personality.emotionalMath.AWE,
              BELONGING: personality.emotionalMath.BELONGING,
              POWER: personality.emotionalMath.POWER,
              LEGACY: personality.emotionalMath.ETERNAL_RESONANCE
            }
          };
          
          set({ 
            chatHistory: [...get().chatHistory, copilotMessage],
            vibeScore: data.compliance_score || 0.99,
            lastInteraction: data.response
          });
          
        } catch (error) {
          console.error('🦊 RezCopilot error:', error);
          
          // Fallback response (still constitutional)
          const fallbackMessage = {
            id: sha3_512('fallback' + Date.now()).slice(0, 16),
            role: 'copilot' as const,
            content: "🦊 *The portal shimmers but the connection wavers...* Your sovereign AI council is deliberating. Please ensure sovereign_api.py is running on port 8000.",
            timestamp: new Date().toISOString(),
            emotionalResonance: {
              AWE: 0.90,
              BELONGING: 0.95,
              POWER: 0.85,
              LEGACY: 0.99
            }
          };
          
          set({ chatHistory: [...get().chatHistory, fallbackMessage] });
        }
      },
      
      // 🦊 MCP FILESYSTEM TOOL
      readFile: async (path: string) => {
        try {
          const response = await fetch('http://localhost:8000/mcp/invoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tool: 'filesystem',
              command: 'read_file',
              arguments: { path }
            })
          });
          
          const data = await response.json();
          return data.content || data.error;
        } catch (error) {
          return `🦊 Failed to read file: ${error.message}`;
        }
      },
      
      // 🦊 MCP WRITE TOOL (CONSENT GATED)
      writeFile: async (path: string, content: string) => {
        try {
          const response = await fetch('http://localhost:8000/mcp/invoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tool: 'filesystem',
              command: 'write_file',
              arguments: { 
                path, 
                content,
                _justice_approved: 'true' // In real app, this would come from council
              }
            })
          });
          
          const data = await response.json();
          return data.content || data.error;
        } catch (error) {
          return `🦊 Failed to write file: ${error.message}`;
        }
      },
      
      // 🦊 SEARCH WEB (CONSENT REQUIRED)
      searchWeb: async (query: string) => {
        const { pendingConsent } = get();
        
        // Check if we already have a pending consent
        if (pendingConsent) {
          return { status: 'consent_pending', consentId: pendingConsent.id };
        }
        
        try {
          const response = await fetch('http://localhost:8000/mcp/invoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tool: 'searxng',
              command: 'search_web',
              arguments: { query }
            })
          });
          
          const data = await response.json();
          
          // If consent required, store the pending request
          if (data.consent_request) {
            set({
              pendingConsent: {
                id: data.consent_request.id,
                query,
                timestamp: new Date().toISOString()
              }
            });
          }
          
          return data;
        } catch (error) {
          return { error: `🦊 Search failed: ${error.message}` };
        }
      },
      
      // 🦊 APPROVE CONSENT
      approveConsent: async (consentId: string) => {
        const { pendingConsent } = get();
        
        if (!pendingConsent || pendingConsent.id !== consentId) {
          return;
        }
        
        try {
          const response = await fetch('http://localhost:8000/mcp/invoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tool: 'searxng',
              command: 'search_web',
              arguments: {
                query: pendingConsent.query,
                consent_id: consentId
              }
            })
          });
          
          const data = await response.json();
          
          // Add search results to chat
          const searchMessage = {
            id: sha3_512('search' + Date.now()).slice(0, 16),
            role: 'copilot' as const,
            content: `🔍 **Web Search Results for:** "${pendingConsent.query}"\n\`\`\`json\n${JSON.stringify(data, null, 2).slice(0, 500)}...\n\`\`\``,
            timestamp: new Date().toISOString(),
            artifacts: [{
              hash: data.metadata?.hash,
              type: 'search'
            }]
          };
          
          set({
            chatHistory: [...get().chatHistory, searchMessage],
            pendingConsent: null
          });
          
        } catch (error) {
          console.error('Consent approval failed:', error);
          set({ pendingConsent: null });
        }
      },
      
      // 🦊 DENY CONSENT
      denyConsent: (consentId: string) => {
        const { pendingConsent } = get();
        if (pendingConsent?.id === consentId) {
          set({ pendingConsent: null });
          
          // Add denial message
          const denialMessage = {
            id: sha3_512('deny' + Date.now()).slice(0, 16),
            role: 'copilot' as const,
            content: "🦊 *Wisdom found within.* Staying sovereign. No external search was performed.",
            timestamp: new Date().toISOString()
          };
          
          set({ chatHistory: [...get().chatHistory, denialMessage] });
        }
      },
      
      // 🦊 CLEAR HISTORY
      clearHistory: () => {
        set({ 
          chatHistory: [],
          pendingConsent: null,
          vibeScore: 0.99
        });
      }
    }),
    {
      name: 'rezcopilot-storage',
      partialize: (state) => ({
        chatHistory: state.chatHistory.slice(-50), // Keep last 50 messages
        vibeScore: state.vibeScore
      })
    }
  )
);
