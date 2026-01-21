// src/utils/rez-terminal-ui.ts
export interface TerminalTheme {
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  colors: string[];
}

export const defaultTheme: TerminalTheme = {
  background: '#0a0a0f',
  foreground: '#00ff88',
  cursor: '#00d4ff',
  selection: 'rgba(0, 212, 255, 0.3)',
  colors: [
    '#1a1a2e', '#ff0055', '#00ff88', '#ffd700',
    '#00d4ff', '#ff6b6b', '#4ecdc4', '#ffffff',
    '#2d2d44', '#ff3366', '#00ff99', '#ffe066',
    '#00e5ff', '#ff8888', '#5fd9d1', '#ffffff'
  ]
};

export function formatOutput(text: string, type: 'info' | 'error' | 'success' | 'warning'): string {
  const prefixes: Record<string, string> = {
    info: '💠',
    error: '❌',
    success: '✅',
    warning: '⚠️'
  };
  return `${prefixes[type]} ${text}`;
}

export function parseANSI(text: string): string {
  // Strip ANSI codes for plain text display
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}
