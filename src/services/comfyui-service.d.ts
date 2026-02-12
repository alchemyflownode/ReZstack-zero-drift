export interface ComfyUIConfig {
    baseUrl: string;
}
export declare class ComfyUIService {
    private config;
    constructor(config?: Partial<ComfyUIConfig>);
    generateImage(prompt: string): Promise<string>;
    isAvailable(): Promise<boolean>;
}
export declare const comfyui: ComfyUIService;
export default ComfyUIService;
