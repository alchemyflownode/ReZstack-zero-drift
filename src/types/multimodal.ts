// Multimodal state interface
export interface MultimodalState {
  generateImage?: (prompt: string) => Promise<void>;
  isGeneratingImage?: boolean;
  imagePrompt?: string;
  setImagePrompt?: (prompt: string) => void;
}
