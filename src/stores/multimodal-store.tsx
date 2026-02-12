import { create } from 'zustand';
import React from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  sovereignStatus?: 'curated' | 'bypassed' | 'raw';
  vibeScore?: number;
  violations?: string[];
}

interface MultimodalState {
  messages: Message[];
  isGenerating: boolean;
  availableModels: string[];
  selectedModel: string;
  isConnected: boolean;
  
  sendMessage: (content: string, options?: any) => Promise<void>;
  refineWithZeroDrift: (messageId: string, content: string) => Promise<void>;
  loadModels: () => Promise<void>;
  setSelectedModel: (model: string) => void;
  clearMessages: () => void;
}

export const useMultimodalStore = create<MultimodalState>((set, get) => ({
  messages: [
    {
      id: '1',
      content: 'System initialized. Zero-Drift Engine ACTIVE.',
      isUser: false,
      timestamp: new Date().toISOString(),
      sovereignStatus: 'curated',
      vibeScore: 100
    }
  ],
  isGenerating: false,
  availableModels: ['llama3.2:1b', 'qwen2.5-coder:7b', 'codellama:7b', 'deepseek-coder:latest'],
  selectedModel: 'llama3.2:1b',
  isConnected: true,
  
  sendMessage: async (content, options) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({ messages: [...state.messages, message], isGenerating: true }));
    
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Response from sovereign AI',
        isUser: false,
        timestamp: new Date().toISOString(),
        sovereignStatus: options?.bypassCuration ? 'bypassed' : 'curated',
        vibeScore: 85
      };
      set((state) => ({ messages: [...state.messages, response], isGenerating: false }));
    }, 1000);
  },
  
  refineWithZeroDrift: async (messageId, content) => {
    console.log('Refining message:', messageId);
  },
  
  loadModels: async () => {
    console.log('Loading models...');
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json();
      const models = data.models?.map((m: any) => m.name) || [];
      set({ availableModels: models, isConnected: true });
    } catch (error) {
      console.error('Failed to load models:', error);
      set({ isConnected: false });
    }
  },
  
  setSelectedModel: (model) => set({ selectedModel: model }),
  
  clearMessages: () => set({ messages: [] })
}));

interface MultimodalStoreProviderProps {
  children: React.ReactNode;
}

export const MultimodalStoreProvider: React.FC<MultimodalStoreProviderProps> = ({ children }) => {
  React.useEffect(() => {
    useMultimodalStore.getState().loadModels();
  }, []);
  
  return React.createElement(React.Fragment, null, children);
};

