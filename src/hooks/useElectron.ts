import { useEffect, useState } from 'react';

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
    readFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>;
    writeFile: (path: string, content: string) => Promise<{ success: boolean; error?: string }>;
    selectFolder: () => Promise<string | null>;
  };
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

const getElectron = (): ElectronAPI | null => {
  if (typeof window !== 'undefined' && window.electron) {
    return window.electron;
  }
  return null;
};

export function useElectron() {
  const [isElectron, setIsElectron] = useState(false);
  const [electron, setElectron] = useState<ElectronAPI | null>(null);

  useEffect(() => {
    const electronAPI = getElectron();
    setIsElectron(!!electronAPI);
    setElectron(electronAPI);
    
    if (electronAPI) {
      console.log('✅ Electron API detected');
    } else {
      console.log('🌐 Running in browser mode');
    }
  }, []);

  return { isElectron, electron };
}

export function isRunningInElectron(): boolean {
  return typeof window !== 'undefined' && !!window.electron;
}
