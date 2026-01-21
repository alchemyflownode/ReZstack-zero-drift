export declare class OllamaStreamService {
    private baseUrl;
    constructor(baseUrl?: string);
    generate(model: string, prompt: string, callbacks: {
        onChunk?: (chunk: string) => void;
        onComplete?: () => void;
        onError?: (error: Error) => void;
    }): Promise<string>;
    chat(model: string, messages: Array<{
        role: string;
        content: string;
    }>, callbacks: {
        onChunk?: (chunk: string) => void;
        onComplete?: () => void;
        onError?: (error: Error) => void;
    }): Promise<string>;
    listModels(): Promise<string[]>;
    checkConnection(): Promise<boolean>;
}
export default OllamaStreamService;
