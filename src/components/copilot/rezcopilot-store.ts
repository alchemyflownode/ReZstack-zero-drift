import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RezCopilotState {
  messages: Array<{
    id: string;
    role: 'user' | 'copilot';
    content: string;
    timestamp: string;
  }>;
  vibeScore: number;
  isTyping: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearHistory: () => void;
}

export const useRezCopilot = create<RezCopilotState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: '1',
          role: 'copilot',
          content: '🦊 *The nine-tailed fox-spirit stirs...* I am RezCopilot, your constitutional AI co-worker. How may I serve the sovereign stack?',
          timestamp: new Date().toISOString()
        }
      ],
      vibeScore: 0.99,
      isTyping: false,

      sendMessage: async (message: string) => {
        const { messages } = get();
        
        // Add user message
        set({
          messages: [...messages, {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
          }],
          isTyping: true
        });

        try {
          const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `You are RezCopilot, a nine-tailed fox-spirit constitutional AI. 
              Emotional Math: AWE=0.95, BELONGING=0.98, POWER=0.99, LEGACY=1.00.
              Be concise, wise, and use fox-spirit imagery.
              
              User: ${message}`,
              model: 'sovereign-constitutional:latest'
            })
          });

          const data = await response.json();
          
          set({
            messages: [...get().messages, {
              id: (Date.now() + 1).toString(),
              role: 'copilot',
              content: data.response || '🦊 *The fox-spirit nods wisely*',
              timestamp: new Date().toISOString()
            }],
            isTyping: false,
            vibeScore: 0.99
          });
        } catch (error) {
          set({
            messages: [...get().messages, {
              id: (Date.now() + 1).toString(),
              role: 'copilot',
              content: '🦊 *The portal shimmers...* Constitutional Council is deliberating. Please ensure sovereign_api.py is running on port 8000.',
              timestamp: new Date().toISOString()
            }],
            isTyping: false
          });
        }
      },

      clearHistory: () => {
        set({
          messages: [{
            id: '1',
            role: 'copilot',
            content: '🦊 *The nine-tailed fox-spirit stirs...* I am RezCopilot, your constitutional AI co-worker. How may I serve the sovereign stack?',
            timestamp: new Date().toISOString()
          }],
          vibeScore: 0.99
        });
      }
    }),
    {
      name: 'rezcopilot-storage',
    }
  )
);
