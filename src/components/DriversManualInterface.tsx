// src/components/DriversManualInterface.tsx
import React, { useState } from 'react';
import { Sparkles, Shield, Zap, Code, Lock, Unlock } from 'lucide-react';
import { rezCompiler } from '../../contracts/rez-compiler';
import { getSovereignGenerator } from '../services/constitutional-generator';
import { geminiService } from '../services/googleGeminiService';

interface DriversManualInterfaceProps {
  onGenerate: (result: any) => void;
}

export const DriversManualInterface: React.FC<DriversManualInterfaceProps> = ({ onGenerate }) => {
  const [userIntent, setUserIntent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSpec, setCurrentSpec] = useState<any>(null);
  const [domainHint, setDomainHint] = useState<string>('');

  const domainOptions = [
    { id: 'website', label: 'Website', icon: '??', description: 'Marketing or informational site' },
    { id: 'app', label: 'App', icon: '??', description: 'Interactive application' },
    { id: 'dashboard', label: 'Dashboard', icon: '??', description: 'Data visualization & metrics' },
    { id: 'tool', label: 'Tool', icon: '??', description: 'Utility or productivity tool' },
    { id: 'library', label: 'Library', icon: '??', description: 'Code library or package' }
  ];

  const handleGenerate = async () => {
    if (!userIntent.trim()) return;

    setIsGenerating(true);
    
    try {
      // Step 1: Compile to constitutional spec
      const spec = rezCompiler.compile(userIntent, domainHint);
      setCurrentSpec(spec);
      
      // Step 2: Generate sovereign code
      const generator = getSovereignGenerator(geminiService);
      const result = await generator.generateSovereignCode(userIntent);
      
      // Step 3: Pass to parent
      onGenerate(result);
      
    } catch (error) {
      console.error('Constitutional generation failed:', error);
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="drivers-manual-interface">
      {/* Constitutional Header */}
      <div className="constitutional-header">
        <Shield className="header-icon" />
        <div>
          <h1>DriversManual</h1>
          <p className="subtitle">Constitutional Era v1.0 Interface</p>
        </div>
        <div className="constitutional-badge">
          <Lock size={14} />
          <span>RezSpec Compliant</span>
        </div>
      </div>

      {/* Main Interface */}
      <div className="intent-input-section">
        <div className="input-header">
          <Sparkles size={20} />
          <h3>What do you want to build?</h3>
        </div>
        
        <textarea
          value={userIntent}
          onChange={(e) => setUserIntent(e.target.value)}
          placeholder="Describe what you want in simple terms...
Example: 'A contact form for my business website'
Example: 'A dashboard showing sales metrics'
Example: 'A button that changes color when clicked'"
          className="intent-textarea"
          rows={4}
          disabled={isGenerating}
        />

        <div className="domain-selector">
          <p className="selector-label">What kind of thing is it?</p>
          <div className="domain-options">
            {domainOptions.map((domain) => (
              <button
                key={domain.id}
                className={`domain-option ${domainHint === domain.id ? 'selected' : ''}`}
                onClick={() => setDomainHint(domain.id)}
                type="button"
              >
                <span className="domain-icon">{domain.icon}</span>
                <div className="domain-info">
                  <span className="domain-label">{domain.label}</span>
                  <span className="domain-description">{domain.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!userIntent.trim() || isGenerating}
          className="generate-button"
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              Generating Constitutionally...
            </>
          ) : (
            <>
              <Zap size={20} />
              Generate Sovereign Code
            </>
          )}
        </button>
      </div>

      {/* Spec Preview */}
      {currentSpec && (
        <div className="spec-preview">
          <div className="spec-header">
            <Code size={18} />
            <h4>Constitutional Spec</h4>
          </div>
          <div className="spec-content">
            <pre>{JSON.stringify(currentSpec, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Constitutional Guarantees */}
      <div className="constitutional-guarantees">
        <h4>??? Constitutional Guarantees</h4>
        <ul>
          <li>? React + TypeScript only</li>
          <li>? Zero Drift compliance enforced</li>
          <li>? No forbidden patterns (jQuery, lodash, etc.)</li>
          <li>? Dark mode ready</li>
          <li>? Semantic naming enforced</li>
          <li>? Capability budget limited</li>
        </ul>
        <p className="constitutional-note">
          All generation is governed by RezSpec v1.0. No exceptions.
        </p>
      </div>

      <style>{`
        .drivers-manual-interface {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
          border-radius: 16px;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .constitutional-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(212, 175, 55, 0.2);
        }

        .header-icon {
          width: 48px;
          height: 48px;
          color: #D4AF37;
        }

        h1 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .subtitle {
          color: #9ca3af;
          font-size: 14px;
          margin-top: 4px;
        }

        .constitutional-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          padding: 8px 16px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          color: #22c55e;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .intent-input-section {
          margin-bottom: 32px;
        }

        .input-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .input-header h3 {
          margin: 0;
          color: #f3f4f6;
        }

        .intent-textarea {
          width: 100%;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #f3f4f6;
          font-size: 16px;
          resize: vertical;
          font-family: inherit;
          margin-bottom: 24px;
        }

        .intent-textarea:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
        }

        .intent-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .domain-selector {
          margin-bottom: 24px;
        }

        .selector-label {
          color: #9ca3af;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .domain-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        .domain-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .domain-option:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .domain-option.selected {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.4);
          color: #D4AF37;
        }

        .domain-icon {
          font-size: 24px;
        }

        .domain-info {
          display: flex;
          flex-direction: column;
        }

        .domain-label {
          font-weight: 600;
          font-size: 14px;
        }

        .domain-description {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .generate-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          background: linear-gradient(135deg, #D4AF37, #B8860B);
          border: none;
          border-radius: 12px;
          color: #1a1a2e;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .generate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(26, 26, 46, 0.3);
          border-top-color: #1a1a2e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spec-preview {
          margin: 32px 0;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .spec-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .spec-header h4 {
          margin: 0;
          color: #f3f4f6;
        }

        .spec-content {
          padding: 16px;
          max-height: 300px;
          overflow-y: auto;
        }

        .spec-content pre {
          margin: 0;
          color: #9ca3af;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
        }

        .constitutional-guarantees {
          padding: 24px;
          background: rgba(34, 197, 94, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .constitutional-guarantees h4 {
          color: #22c55e;
          margin-top: 0;
          margin-bottom: 16px;
        }

        .constitutional-guarantees ul {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
        }

        .constitutional-guarantees li {
          color: #d1d5db;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .constitutional-note {
          color: #9ca3af;
          font-size: 12px;
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default DriversManualInterface;
