export declare class SimpleOllamaService {
    constructor();
    generateStream(prompt: string, model?: string): AsyncGenerator<string, void, unknown>;
    listModels(): Promise<{
        name: string;
        size: string;
    }[]>;
    checkConnection(): Promise<{
        connected: boolean;
        message: string;
    }>;
}
export default SimpleOllamaService;
