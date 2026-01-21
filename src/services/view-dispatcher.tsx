// src/services/view-dispatcher.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ViewState {
  id: string;
  component: ReactNode;
  timestamp: number;
}

interface DispatcherContextType {
  currentView: ViewState | null;
  previousViews: ViewState[];
  dispatchIntent: (userInput: string) => Promise<void>;
  clearView: () => void;
}

const DispatcherContext = createContext<DispatcherContextType | undefined>(undefined);

export const useViewDispatcher = () => {
  const context = useContext(DispatcherContext);
  if (!context) {
    throw new Error('useViewDispatcher must be used within ViewDispatcherProvider');
  }
  return context;
};

export const ViewDispatcherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewState | null>(null);
  const [previousViews, setPreviousViews] = useState<ViewState[]>([]);

  const dispatchIntent = async (userInput: string) => {
    // For now, create a simple placeholder component
    const newView: ViewState = {
      id: `view_${Date.now()}`,
      component: (
        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Generated UI</h3>
          <p className="text-slate-300 mb-4">User intent: "{userInput}"</p>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-slate-400 text-sm">
              This is where a dynamic UI would appear based on the intent analysis.
              The actual implementation would use the IntentRouter to generate specific components.
            </p>
          </div>
        </div>
      ),
      timestamp: Date.now()
    };

    if (currentView) {
      setPreviousViews(prev => [...prev, currentView]);
    }
    
    setCurrentView(newView);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      clearView();
    }, 10000);
  };

  const clearView = () => {
    if (currentView) {
      setPreviousViews(prev => [...prev, currentView]);
    }
    setCurrentView(null);
  };

  return (
    <DispatcherContext.Provider value={{
      currentView,
      previousViews,
      dispatchIntent,
      clearView
    }}>
      {children}
      
      {/* Generative UI Layer */}
      {currentView && (
        <div className="fixed bottom-6 right-6 w-96 z-50 animate-in slide-in-from-bottom-5">
          <div className="relative">
            {currentView.component}
            <button
              onClick={clearView}
              className="absolute top-2 right-2 p-1 bg-white/10 hover:bg-white/20 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </DispatcherContext.Provider>
  );
};
