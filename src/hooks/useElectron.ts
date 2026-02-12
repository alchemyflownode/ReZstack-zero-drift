import { useState, useEffect } from 'react';

interface ElectronAPI {
  platform: string;
  version: {
    electron: string;
    node: string;
  };
  openFolder: () => Promise<string | null>;
  saveFile: (content: string) => Promise<string | null>;
}

export const useElectron = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [electron, setElectron] = useState<ElectronAPI | null>(null);

  useEffect(() => {
    // Check if running in Electron
    if (window.navigator.userAgent.toLowerCase().includes('electron')) {
      setIsElectron(true);
      // Mock electron API for web development
      setElectron({
        platform: process.platform,
        version: {
          electron: '27.0.0',
          node: process.version
        },
        openFolder: async () => {
          console.log('Electron: open folder requested');
          return null;
        },
        saveFile: async (content: string) => {
          console.log('Electron: save file requested', content.substring(0, 50));
          return null;
        }
      });
    }
  }, []);

  return { isElectron, electron };
};
