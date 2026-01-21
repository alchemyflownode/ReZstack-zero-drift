import React, { useState } from 'react';
// src/App.tsx - Add constitutional initialization
import { installConstitutionalMiddleware } from './middleware/constitutional-middleware';
// // geminiService placeholder
// // ollamaService placeholder
import { DriversManualInterface } from './components/DriversManualInterface';

// Initialize constitutional era
function initializeConstitutionalEra() {
  // Wrap all AI services
  installConstitutionalMiddleware(geminiService);
  installConstitutionalMiddleware(ollamaService);
  
  // Log constitutional activation
  console.log('%c??? CONSTITUTIONAL ERA v1.0', 
    'color: #D4AF37; font-size: 24px; font-weight: bold;');
  console.log('All AI generation is now governed by RezSpec.');
  
  // Add constitutional badge to UI
  if (typeof document !== 'undefined') {
    const badge = document.createElement('div');
    badge.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #D4AF37;
        padding: 8px 16px;
        border-radius: 8px;
        border: 2px solid #D4AF37;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        ??? Constitutional Era v1.0
      </div>
    `;
    document.body.appendChild(badge);
  }
}

// Call initialization
initializeConstitutionalEra();

// Update your chat component to use DriversManual
function ChatView() {
  const [useDriversManual, setUseDriversManual] = useState(true);
  
  return (
    <div className="chat-container">
      {useDriversManual ? (
        <DriversManualInterface 
          onGenerate={(result) => {
            // Insert constitutionally-generated code
            console.log('Constitutional generation complete:', result);
          }}
        />
      ) : (
        <div className="constitutional-warning">
          <h3>?? Constitutional Violation Warning</h3>
          <p>
            Direct AI chat is disabled in Constitutional Era v1.0.
            Please use the DriversManual for all generation.
          </p>
          <button onClick={() => setUseDriversManual(true)}>
            Open DriversManual
          </button>
        </div>
      )}
    </div>
  );
}



