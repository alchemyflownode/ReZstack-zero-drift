interface ElectronAPI {
    isDev: boolean;
    platform: string;
    version: {
        electron: string;
        node: string;
        chrome: string;
    };
    execute: (command: string) => Promise<any>;
    ollama: {
        status: () => Promise<any>;
    };
    terminal: {
        health: () => Promise<any>;
    };
    fs: {
        readFile: (path: string) => Promise<{
            success: boolean;
            content?: string;
            error?: string;
        }>;
        writeFile: (path: string, content: string) => Promise<{
            success: boolean;
            error?: string;
        }>;
        selectFolder: () => Promise<string | null>;
    };
}
declare global {
    interface Window {
        electron?: ElectronAPI;
    }
}
export declare function useElectron(): {
    isElectron: boolean;
    electron: ElectronAPI | null;
};
export declare function isRunningInElectron(): boolean;
export {};
