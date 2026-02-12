export declare class OllamaStreamService {
    private baseUrl;
    private currentModel;
    constructor(baseUrl?: string);
    /**
     * Enhanced stream method with constitutional routing
     */
    streamWithConstitutionalRouting(query: string, options?: any): Promise<ReadableStream<any> | null>;
    /**
     * Original Ollama streaming logic (preserved)
     */
    private streamToOllama;
    private mockClaudeResponse;
    private mockSandboxResponse;
    setModel(model: string): Promise<void>;
    getCurrentModel(): string;
}
export declare const ollamaStreamService: OllamaStreamService;
