// G:\okiru\app builder\RezStackFinal\src\components\SovereignChat.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

// Install DOMPurify & marked first: npm install dompurify marked @types/dompurify @types/marked

interface SovereignMessage {
  id: string;
  timestamp: string; // ISO format
  source: 'AGENT' | 'USER' | 'SYSTEM';
  content: string;
  metadata?: {
    remedyPhase?: 'DIAGNOSIS' | 'PRESCRIPTION' | 'SURGERY';
    confidence?: number;
    artifactId?: string;
  };
}

interface SovereignChatProps {
  messages: SovereignMessage[];
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

export const SovereignChat: React.FC<SovereignChatProps> = ({
  messages,
  onSendMessage,
  disabled = false
}) => {
  const [input, setInput] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll with proper timing
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Secure message rendering with proper sanitization
  const renderMessageContent = useCallback((content: string): string => {
    // First sanitize, then parse markdown, then sanitize again
    const sanitizedInput = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'br'],
      ALLOWED_ATTR: []
    });
    
    // Parse markdown (safe because input already sanitized)
    const parsed = marked.parse(sanitizedInput, { async: false }) as string;
    
    // Final sanitization pass
    return DOMPurify.sanitize(parsed);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || disabled) return;
    
    setIsSending(true);
    try {
      await onSendMessage(input.trim());
      setInput('');
    } catch (error) {
      console.error('[SovereignChat] Send failed:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="sovereign-chat-container" role="log" aria-label="Sovereign chat interface">
      {/* Messages container */}
      <div className="messages-container" aria-live="polite">
        {messages.map((msg) => {
          const safeContent = renderMessageContent(msg.content);
          const timeString = msg.timestamp 
            ? new Date(msg.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : '';
          
          return (
            <div
              key={msg.id}
              className={`message ${msg.source.toLowerCase()}`}
              data-source={msg.source}
              data-timestamp={msg.timestamp}
              aria-label={`Message from ${msg.source} at ${timeString}`}
            >
              <div className="message-header">
                <span className="message-source" aria-hidden="true">
                  {msg.source === 'AGENT' ? '⚡' : msg.source === 'USER' ? '👤' : '⚙️'}
                </span>
                <time 
                  dateTime={msg.timestamp}
                  className="message-time"
                  aria-label={`Sent at ${timeString}`}
                >
                  {timeString}
                </time>
              </div>
              
              <div 
                className="message-content"
                dangerouslySetInnerHTML={{ __html: safeContent }}
                aria-label={`Message content: ${msg.content.replace(/<[^>]*>/g, '')}`}
              />
              
              {msg.metadata?.remedyPhase && (
                <div className="message-metadata" aria-label={`Remedy phase: ${msg.metadata.remedyPhase}`}>
                  <span className="phase-badge">{msg.metadata.remedyPhase}</span>
                  {msg.metadata.confidence && (
                    <span className="confidence">Confidence: {msg.metadata.confidence}%</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="message-form" aria-label="Message input form">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your command..."
            disabled={isSending || disabled}
            aria-label="Message input field"
            aria-describedby="input-hint"
            className="message-input"
          />
          <small id="input-hint" className="sr-only">
            Press Enter to send, Shift+Enter for new line
          </small>
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || isSending || disabled}
          aria-label={isSending ? "Sending message..." : "Send message"}
          aria-busy={isSending}
          className="send-button"
        >
          <span aria-hidden="true">{isSending ? '⏳' : '⚡'}</span>
          <span className="sr-only">{isSending ? 'Sending...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};

// Corresponding CSS (add to your styles)
const styles = `
.sovereign-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #2d3748;
  border-radius: 8px;
  background: #0f172a;
  font-family: 'JetBrains Mono', monospace;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid;
}

.message.agent {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

.message.user {
  border-color: #34d399;
  background: rgba(52, 211, 153, 0.1);
}

.message.system {
  border-color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: #94a3b8;
}

.message-content {
  line-height: 1.6;
  color: #e2e8f0;
}

.message-content code {
  background: #1e293b;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
}

.message-metadata {
  margin-top: 8px;
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  gap: 12px;
}

.phase-badge {
  padding: 2px 8px;
  background: #374151;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.7rem;
}

.message-form {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #2d3748;
}

.input-wrapper {
  flex: 1;
}

.message-input {
  width: 100%;
  padding: 12px;
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 6px;
  color: white;
  font-family: inherit;
}

.message-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-button {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.send-button:disabled {
  background: #475569;
  cursor: not-allowed;
  opacity: 0.5;
}

.send-button:hover:not(:disabled) {
  background: #2563eb;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;

