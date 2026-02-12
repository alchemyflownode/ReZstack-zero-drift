export interface OllamaModel {
    name: string;
    size: number;
    modified: string;
}
export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context?: number[];
}
export declare class OllamaClient {
    static checkStatus(): Promise<{
        online: boolean;
        models: OllamaModel[];
        message: string;
    }>;
    static generate(prompt: string, model?: string, system?: string): Promise<OllamaResponse>;
    static getRecommendedModel(task: string): string;
}
