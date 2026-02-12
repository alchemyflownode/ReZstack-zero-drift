import React, { useEffect, useState } from 'react';
import { ChatView } from './views/ChatView';
import { SovereignMessage } from './components/chat/sovereign-message';
import { useMultimodalStore } from './stores/multimodal-store';

// Constitutional AI services
const constitutionalServices = {
  gemini: {
    generate: async (prompt: string) => {
      console.log('Gemini service - constitutional mode');
      return { response: 'Gemini: ' + prompt };
    }
  },
  ollama: {
    generate: async (model: string, prompt: string) => {
      console.log(`Ollama service - ${model}`);
      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt, stream: false })
        });
        const data = await response.json();
        return { response: data.response };
      } catch (error) {
        console.error('Ollama error:', error);
        return { response: 'Ollama service unavailable' };
      }
    }
  }
};

export const AppConstitutional: React.FC = () => {
  const [councilStatus, setCouncilStatus] = useState<string>('deliberating');
  const { availableModels } = useMultimodalStore();

  useEffect(() => {
    // Constitutional Council initialization
    console.log('⚖️ Constitutional Council seated');
    setCouncilStatus('seated');
  }, []);

  return (
    <div className="constitutional-app">
      <div className="hidden constitutional-metadata" 
           data-council={councilStatus}
           data-models={availableModels.length}
           data-version="3.1.0">
      </div>
      <ChatView />
    </div>
  );
};

export default AppConstitutional;
