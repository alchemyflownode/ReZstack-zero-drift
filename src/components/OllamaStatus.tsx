import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface OllamaStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export const OllamaStatus: React.FC<OllamaStatusProps> = ({ onStatusChange }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [models, setModels] = useState<string[]>([]);

  const checkOllamaConnection = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setModels(data.models?.map((m: any) => m.name) || []);
        onStatusChange?.(true);
      } else {
        setIsConnected(false);
        setModels([]);
        onStatusChange?.(false);
      }
    } catch (error) {
      setIsConnected(false);
      setModels([]);
      onStatusChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkOllamaConnection();
    
    // Optional: Check every 30 seconds
    const interval = setInterval(checkOllamaConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
      <Cpu size={20} className={isConnected ? "text-green-400" : "text-red-400"} />
      
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Ollama</span>
          {isChecking ? (
            <RefreshCw size={14} className="animate-spin text-yellow-400" />
          ) : isConnected ? (
            <CheckCircle size={14} className="text-green-400" />
          ) : (
            <XCircle size={14} className="text-red-400" />
          )}
          <span className={`text-sm ${isConnected ? "text-green-400" : "text-red-400"}`}>
            {isChecking ? "Checking..." : isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        
        {isConnected && models.length > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            {models.length} model{models.length !== 1 ? 's' : ''} available
          </div>
        )}
      </div>
      
      <button
        onClick={checkOllamaConnection}
        disabled={isChecking}
        className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 flex items-center"
      >
        {isChecking ? (
          <RefreshCw size={14} className="animate-spin mr-1" />
        ) : (
          <RefreshCw size={14} className="mr-1" />
        )}
        Refresh
      </button>
    </div>
  );
};
