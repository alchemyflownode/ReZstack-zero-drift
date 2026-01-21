// src/services/StateVault.ts
import { createHash } from 'crypto';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

export interface VaultEntry {
  hash: string;
  content: string;
  timestamp: number;
  context: string;
  metadata: Record<string, any>;
  violatedLaws: string[];
}

export class StateVault {
  private vaultPath: string;
  
  constructor(basePath: string = '.sovereign-vault') {
    this.vaultPath = join(process.cwd(), basePath);
    this.initializeVault();
  }
  
  private initializeVault(): void {
    if (!existsSync(this.vaultPath)) {
      mkdirSync(this.vaultPath, { recursive: true });
    }
  }
  
  generateHash(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16);
  }
  
  preserve(content: string, context: string = 'unknown', metadata: Record<string, any> = {}): string {
    const hash = this.generateHash(content);
    
    const entry: VaultEntry = {
      hash,
      content,
      timestamp: Date.now(),
      context,
      metadata,
      violatedLaws: []
    };
    
    // Save to disk
    const entryPath = join(this.vaultPath, `${hash}.json`);
    writeFileSync(entryPath, JSON.stringify(entry, null, 2), 'utf-8');
    
    return hash;
  }
  
  retrieve(hash: string): VaultEntry | null {
    const entryPath = join(this.vaultPath, `${hash}.json`);
    if (!existsSync(entryPath)) return null;
    
    try {
      const data = readFileSync(entryPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  
  markAsViolated(hash: string, law: string, details?: string): boolean {
    const entry = this.retrieve(hash);
    if (!entry) return false;
    
    entry.violatedLaws.push(`${law}${details ? `: ${details}` : ''}`);
    entry.timestamp = Date.now();
    
    const entryPath = join(this.vaultPath, `${hash}.json`);
    writeFileSync(entryPath, JSON.stringify(entry, null, 2), 'utf-8');
    
    return true;
  }
  
  generateDiff(originalHash: string, modifiedContent: string): string {
    const originalEntry = this.retrieve(originalHash);
    if (!originalEntry) return 'No original found';
    
    const originalLines = originalEntry.content.split('\n');
    const modifiedLines = modifiedContent.split('\n');
    
    let diff = '';
    const maxLines = Math.max(originalLines.length, modifiedLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const original = originalLines[i] || '';
      const modified = modifiedLines[i] || '';
      
      if (original !== modified) {
        diff += `Line ${i + 1}:\n`;
        if (original) diff += `  - ${original}\n`;
        if (modified) diff += `  + ${modified}\n`;
      }
    }
    
    return diff || 'No differences detected';
  }
  
  getAllEntries(): VaultEntry[] {
    const entries: VaultEntry[] = [];
    
    if (!existsSync(this.vaultPath)) return entries;
    
    const files = readdirSync(this.vaultPath);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const entryPath = join(this.vaultPath, file);
        try {
          const data = readFileSync(entryPath, 'utf-8');
          entries.push(JSON.parse(data));
        } catch {
          // Skip corrupted files
        }
      }
    });
    
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  }
}
