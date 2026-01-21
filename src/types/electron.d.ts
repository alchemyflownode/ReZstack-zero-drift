// Electron API types
interface ElectronAPI {
  openFolder: () => Promise<string | null>;
  saveFile: (content: string, defaultPath?: string) => Promise<string | null>;
  // Add other methods as needed
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
