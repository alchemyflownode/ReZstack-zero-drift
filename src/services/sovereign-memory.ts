// src/services/sovereign-memory.ts
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

class SovereignMemory {
  private storage = localStorage;
  private readonly STORAGE_KEY = 'rezstack-sovereign-memory';
  
  constructor() {
    // Initialize storage
    if (!this.storage.getItem(this.STORAGE_KEY)) {
      this.storage.setItem(this.STORAGE_KEY, JSON.stringify({
        projects: {},
        memories: [],
        sessions: []
      }));
    }
  }
  
  private getStorage() {
    const data = this.storage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : { projects: {}, memories: [], sessions: [] };
  }
  
  private setStorage(data: any) {
    this.storage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
  
  async saveMemory(entry: Omit<MemoryEntry, 'id'>): Promise<string> {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const storage = this.getStorage();
    
    storage.memories.push({
      ...entry,
      id
    });
    
    this.setStorage(storage);
    return id;
  }
  
  async getRelevantMemories(
    query: string,
    limit: number = 10,
    projectId?: string
  ): Promise<MemoryEntry[]> {
    const storage = this.getStorage();
    let memories = storage.memories || [];
    
    // Filter by project if specified
    if (projectId) {
      memories = memories.filter((m: MemoryEntry) => 
        m.context?.project === projectId
      );
    }
    
    // Simple text search
    const relevant = memories
      .filter((m: MemoryEntry) => 
        m.content.toLowerCase().includes(query.toLowerCase()) ||
        m.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .sort((a: MemoryEntry, b: MemoryEntry) => b.timestamp - a.timestamp)
      .slice(0, limit);
    
    return relevant;
  }
  
  async startSession(projectId: string, title: string): Promise<string> {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const storage = this.getStorage();
    
    storage.sessions.push({
      sessionId,
      projectId,
      title,
      startTime: Date.now(),
      endTime: Date.now(),
      memories: []
    });
    
    // Initialize project if doesn't exist
    if (!storage.projects[projectId]) {
      storage.projects[projectId] = {
        projectId,
        name: projectId,
        lastAccessed: Date.now()
      };
    } else {
      storage.projects[projectId].lastAccessed = Date.now();
    }
    
    this.setStorage(storage);
    return sessionId;
  }
  
  async endSession(sessionId: string, summary?: any) {
    const storage = this.getStorage();
    const session = storage.sessions.find((s: any) => s.sessionId === sessionId);
    
    if (session) {
      session.endTime = Date.now();
      if (summary) {
        session.summary = summary;
      }
      this.setStorage(storage);
    }
  }
  
  async generateWelcomeMessage(projectId: string): Promise<string> {
    const storage = this.getStorage();
    const project = storage.projects[projectId];
    const sessions = storage.sessions.filter((s: any) => s.projectId === projectId);
    
    if (!project || sessions.length === 0) {
      return "Welcome to a new project! I'm your Sovereign AI Architect. What would you like to build today?";
    }
    
    const lastSession = sessions[sessions.length - 1];
    const recentMemories = await this.getRelevantMemories(projectId, 3, projectId);
    
    let welcome = `Welcome back to "${project.name}"!\n\n`;
    
    if (recentMemories.length > 0) {
      const lastMemory = recentMemories[0];
      welcome += `Last interaction: ${lastMemory.content.substring(0, 100)}...\n\n`;
    }
    
    welcome += 'Ready to continue with sovereign architecture?\n';
    
    return welcome;
  }
  
  async getProjectSuggestions(projectId: string): Promise<{
    nextSteps: string[];
    warnings: string[];
    improvements: string[];
  }> {
    const memories = await this.getRelevantMemories(projectId, 20, projectId);
    
    // Simple analysis based on memory patterns
    const suggestions = {
      nextSteps: [] as string[],
      warnings: [] as string[],
      improvements: [] as string[]
    };
    
    const errorCount = memories.filter(m => 
      m.content.includes('error') || m.content.includes('bug') || m.tags.includes('error')
    ).length;
    
    if (errorCount > 0) {
      suggestions.warnings.push(`Found ${errorCount} error mentions in previous sessions.`);
    }
    
    const todoCount = memories.filter(m => 
      m.content.includes('TODO') || m.content.includes('FIXME')
    ).length;
    
    if (todoCount > 0) {
      suggestions.nextSteps.push(`Address ${todoCount} pending TODOs from previous work.`);
    }
    
    if (memories.length > 10) {
      suggestions.improvements.push('Consider exporting or archiving old sessions for better performance.');
    }
    
    return suggestions;
  }
  
  exportMemory(projectId?: string): string {
    const storage = this.getStorage();
    
    const data = {
      metadata: {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        totalMemories: storage.memories.length,
        totalSessions: storage.sessions.length
      },
      memories: projectId 
        ? storage.memories.filter((m: MemoryEntry) => m.context?.project === projectId)
        : storage.memories
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  importMemory(data: string): void {
    try {
      const imported = JSON.parse(data);
      const storage = this.getStorage();
      
      if (imported.memories && Array.isArray(imported.memories)) {
        storage.memories = [...storage.memories, ...imported.memories];
        this.setStorage(storage);
      }
    } catch (error) {
      console.error('Failed to import memory:', error);
    }
  }
}

export const sovereignMemory = new SovereignMemory();
