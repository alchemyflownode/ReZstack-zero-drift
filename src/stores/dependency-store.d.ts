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
    healthScore: number;
    lastScan: number | null;
}
interface DependencyState {
    files: FileUsage[];
    health: DependencyHealth;
    isScanning: boolean;
    scanProgress: number;
    scanError: string | null;
    selectedFolder: string | null;
    startScan: () => Promise<void>;
    scanFolder: (folder: string) => Promise<void>;
    setSelectedFolder: (folder: string | null) => void;
    clearResults: () => void;
    deleteUnusedFile: (fileId: string) => Promise<void>;
}
export declare const useDependencyStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DependencyState>>;
export {};
