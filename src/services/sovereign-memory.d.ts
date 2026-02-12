export interface MemoryEntry {
    id: string;
    sessionId: string;
    timestamp: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    context?: Record<string, any>;
    tags: string[];
}
export interface ProjectMemory {
    projectId: string;
    name: string;
    description: string;
    lastAccessed: number;
}
declare class SovereignMemory {
    private storage;
    private readonly STORAGE_KEY;
    constructor();
    private getStorage;
    private setStorage;
    saveMemory(entry: Omit<MemoryEntry, 'id'>): Promise<string>;
    getRelevantMemories(query: string, limit?: number, projectId?: string): Promise<MemoryEntry[]>;
    startSession(projectId: string, title: string): Promise<string>;
    endSession(sessionId: string, summary?: any): Promise<void>;
    generateWelcomeMessage(projectId: string): Promise<string>;
    getProjectSuggestions(projectId: string): Promise<{
        nextSteps: string[];
        warnings: string[];
        improvements: string[];
    }>;
    exportMemory(projectId?: string): string;
    importMemory(data: string): void;
}
export declare const sovereignMemory: SovereignMemory;
export {};
