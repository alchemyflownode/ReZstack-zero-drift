export interface AIService {
    generate(prompt: string, options?: any): Promise<string>;
    [key: string]: any;
}
export interface GenerationOptions {
    maxTokens?: number;
    temperature?: number;
    model?: string;
}
