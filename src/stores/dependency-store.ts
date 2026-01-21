// src/stores/dependency-store.ts
import { create } from 'zustand';

export interface FileUsage {
  id: string;
  name: string;
  path: string;
  folder: 'services' | 'stores' | 'components' | 'utils' | 'other';
  importedBy: string[];
  imports: string[];
  isUsed: boolean;
  lastChecked: number;
  lineCount?: number;
  size?: number;
}

export interface DependencyHealth {
  totalFiles: number;
  usedFiles: number;
  unusedFiles: number;
  healthScore: number; // 0-100
  lastScan: number | null;
}

interface DependencyState {
  files: FileUsage[];
  health: DependencyHealth;
  isScanning: boolean;
  scanProgress: number;
  scanError: string | null;
  selectedFolder: string | null;
  
  // Actions
  startScan: () => Promise<void>;
  scanFolder: (folder: string) => Promise<void>;
  setSelectedFolder: (folder: string | null) => void;
  clearResults: () => void;
  deleteUnusedFile: (fileId: string) => Promise<void>;
}

export const useDependencyStore = create<DependencyState>((set, get) => ({
  files: [],
  health: {
    totalFiles: 0,
    usedFiles: 0,
    unusedFiles: 0,
    healthScore: 100,
    lastScan: null
  },
  isScanning: false,
  scanProgress: 0,
  scanError: null,
  selectedFolder: null,

  startScan: async () => {
    set({ isScanning: true, scanProgress: 0, scanError: null, files: [] });
    
    const folders = ['services', 'stores', 'components', 'utils'];
    const allFiles: FileUsage[] = [];
    
    try {
      for (let i = 0; i < folders.length; i++) {
        const folder = folders[i];
        set({ scanProgress: ((i + 1) / folders.length) * 100 });
        
        const folderFiles = await scanFolderFiles(folder);
        allFiles.push(...folderFiles);
      }
      
      // Calculate health
      const usedFiles = allFiles.filter(f => f.isUsed).length;
      const unusedFiles = allFiles.filter(f => !f.isUsed).length;
      const healthScore = allFiles.length > 0 
        ? Math.round((usedFiles / allFiles.length) * 100)
        : 100;
      
      set({
        files: allFiles,
        health: {
          totalFiles: allFiles.length,
          usedFiles,
          unusedFiles,
          healthScore,
          lastScan: Date.now()
        },
        isScanning: false,
        scanProgress: 100
      });
    } catch (error) {
      set({
        scanError: error instanceof Error ? error.message : 'Scan failed',
        isScanning: false
      });
    }
  },

  scanFolder: async (folder: string) => {
    set({ isScanning: true, scanError: null });
    
    try {
      const folderFiles = await scanFolderFiles(folder);
      
      set(state => {
        const otherFiles = state.files.filter(f => f.folder !== folder);
        const allFiles = [...otherFiles, ...folderFiles];
        
        const usedFiles = allFiles.filter(f => f.isUsed).length;
        const unusedFiles = allFiles.filter(f => !f.isUsed).length;
        
        return {
          files: allFiles,
          health: {
            totalFiles: allFiles.length,
            usedFiles,
            unusedFiles,
            healthScore: Math.round((usedFiles / allFiles.length) * 100),
            lastScan: Date.now()
          },
          isScanning: false
        };
      });
    } catch (error) {
      set({
        scanError: error instanceof Error ? error.message : 'Scan failed',
        isScanning: false
      });
    }
  },

  setSelectedFolder: (folder) => set({ selectedFolder: folder }),
  
  clearResults: () => set({
    files: [],
    health: {
      totalFiles: 0,
      usedFiles: 0,
      unusedFiles: 0,
      healthScore: 100,
      lastScan: null
    }
  }),

  deleteUnusedFile: async (fileId: string) => {
    const file = get().files.find(f => f.id === fileId);
    if (!file || file.isUsed) return;
    
    try {
      await deleteFile(file.path);
      set(state => ({
        files: state.files.filter(f => f.id !== fileId),
        health: {
          ...state.health,
          totalFiles: state.health.totalFiles - 1,
          unusedFiles: state.health.unusedFiles - 1
        }
      }));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }
}));

// Helper functions
async function scanFolderFiles(folder: string): Promise<FileUsage[]> {
  try {
    const { runPSCommand } = await import('../utils/ps1Bridge');
    
    // Get files in folder
    const filesResult = await runPSCommand(`
      Get-ChildItem -Path "./src/${folder}" -Filter "*.ts" -Filter "*.tsx" -File -ErrorAction SilentlyContinue | 
      Select-Object Name, FullName, Length | 
      ConvertTo-Json
    `);
    
    if (!filesResult) return [];
    
    let files: any[];
    try {
      const parsed = JSON.parse(filesResult);
      files = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
    
    const results: FileUsage[] = [];
    
    for (const file of files) {
      const baseName = file.Name.replace(/\.(tsx?|ts|js)$/i, '');
      
      // Find who imports this file
      const importersResult = await runPSCommand(`
        Select-String -Path "./src/**/*.ts", "./src/**/*.tsx" -Pattern "${baseName}" -SimpleMatch |
        Where-Object { $_.Path -notlike "*\\${file.Name}" } |
        Select-Object -ExpandProperty Path |
        ForEach-Object { Split-Path $_ -Leaf } |
        Get-Unique |
        ConvertTo-Json
      `);
      
      let importedBy: string[] = [];
      try {
        if (importersResult) {
          const parsed = JSON.parse(importersResult);
          importedBy = Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
        }
      } catch { }
      
      // Count lines
      let lineCount = 0;
      try {
        const lineCountResult = await runPSCommand(`(Get-Content "${file.FullName}" | Measure-Object -Line).Lines`);
        lineCount = parseInt(lineCountResult) || 0;
      } catch { }
      
      results.push({
        id: `${folder}-${baseName}`,
        name: baseName,
        path: file.FullName,
        folder: folder as FileUsage['folder'],
        importedBy,
        imports: [],
        isUsed: importedBy.length > 0 || baseName === 'index',
        lastChecked: Date.now(),
        lineCount,
        size: file.Length
      });
    }
    
    return results;
  } catch (error) {
    console.error('Scan folder error:', error);
    return [];
  }
}

async function deleteFile(path: string): Promise<void> {
  const { runPSCommand } = await import('../utils/ps1Bridge');
  await runPSCommand(`Remove-Item -Path "${path}" -Force`);
}
