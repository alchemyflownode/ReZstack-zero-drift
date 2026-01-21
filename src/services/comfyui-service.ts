// ComfyUI Service
export interface ComfyUIConfig {
  baseUrl: string;
}

export class ComfyUIService {
  private config: ComfyUIConfig;

  constructor(config?: Partial<ComfyUIConfig>) {
    this.config = {
      baseUrl: 'http://localhost:8188',
      ...config
    };
  }

  async generateImage(prompt: string): Promise<string> {
    console.log('ComfyUI generate:', prompt);
    return '';
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/system_stats`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const comfyui = new ComfyUIService();
export default ComfyUIService;


