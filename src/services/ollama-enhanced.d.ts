export interface OllamaConfig {
    baseUrl: string;
    model: string;
}
export interface OllamaResponse {
    response: string;
    done: boolean;
}
export declare class OllamaEnhancedService {
    private config;
    constructor(config?: Partial<OllamaConfig>);
    generate(prompt: string): Promise<string>;
    isAvailable(): Promise<boolean>;
}
export declare const ollama: OllamaEnhancedService;
export default OllamaEnhancedService;
