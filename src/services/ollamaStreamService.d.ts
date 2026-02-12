/**
 * Streaming Ollama Interface with Real-Time Token Parsing
 * Enables live bytecode generation with human-in-the-loop editing.
 */
export interface StreamCallback {
    onToken: (partialText: string) => void;
    onComplete: (finalText: string) => void;
    onError: (error: string) => void;
}
export declare const streamToOllama: (prompt: string, model: string | undefined, callbacks: StreamCallback) => Promise<void>;
