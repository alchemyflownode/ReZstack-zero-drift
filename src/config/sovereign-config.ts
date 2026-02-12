/**
 * Sovereign AI Configuration
 * Centralized configuration for all API endpoints and paths
 * Cross-platform compatible - NO HARDCODED WINDOWS PATHS
 */

// ============================================================================
// API ENDPOINTS - Move to .env in production
// ============================================================================
export const API_ENDPOINTS = {
  JARVIS: {
    BASE: import.meta.env.VITE_JARVIS_API_URL || 'http://localhost:8002',
    HEALTH: '/health',
    ENHANCE: '/api/jarvis/enhance',
    FILE: '/api/jarvis/file',
    SYSTEM: '/api/system/exec'
  },
  OLLAMA: {
    BASE: import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:11434',
    TAGS: '/api/tags',
    GENERATE: '/api/generate'
  },
  CONSTITUTIONAL: {
    BASE: import.meta.env.VITE_CONSTITUTIONAL_API_URL || 'http://localhost:8001',
    APPROVE: '/approve',
    COUNCIL: '/council',
    HEALTH: '/health'
  },
  SOVEREIGN: {
    BASE: import.meta.env.VITE_SOVEREIGN_API_URL || 'http://localhost:9000',
    CHAT: '/chat',
    HEALTH: '/health'
  }
} as const;

// ============================================================================
// WORKSPACE CONFIGURATION - CROSS-PLATFORM
// ============================================================================
export const WORKSPACE_CONFIG = {
  // Default workspace - ALWAYS relative, never absolute
  DEFAULT_WORKSPACE: '',
  
  // Storage key for localStorage
  STORAGE_KEY: 'sovereign-workspace',
  
  // Maximum file size for reading (1MB)
  MAX_FILE_SIZE: 1024 * 1024,
  
  // Allowed file extensions for scanning
  ALLOWED_EXTENSIONS: ['.py', '.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.txt', '.css', '.html']
} as const;

// ============================================================================
// CONSTITUTIONAL COUNCIL CONFIGURATION
// ============================================================================
export const COUNCIL_CONFIG = {
  JUSTICES: [
    { name: 'phi4:latest', role: 'Chief Justice', weight: 1.0 },
    { name: 'qwen2.5-coder:7b', role: 'Lead Architect', weight: 0.95 },
    { name: 'deepseek-coder:latest', role: 'Bytecode Specialist', weight: 0.9 },
    { name: 'glm4:latest', role: 'Constitutional Scholar', weight: 0.85 },
    { name: 'llama3.2:latest', role: 'Balanced Advisor', weight: 0.8 }
  ],
  VOTE_THRESHOLD: {
    STANDARD: 3,
    SUPER_MAJORITY: 4
  }
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export const FEATURES = {
  ENABLE_CONSTITUTIONAL_COUNCIL: true,
  ENABLE_JARVIS_ENHANCER: true,
  ENABLE_REZCOPILOT: true,
  ENABLE_SYSTEM_PASSTHROUGH: true
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the default workspace path - CROSS-PLATFORM SAFE
 * Never hardcodes Windows paths - uses localStorage or empty string
 */
export function getDefaultWorkspace(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(WORKSPACE_CONFIG.STORAGE_KEY);
    if (saved) return saved;
  }
  return WORKSPACE_CONFIG.DEFAULT_WORKSPACE;
}

/**
 * Normalize path for cross-platform compatibility
 * Converts Windows backslashes to forward slashes
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

/**
 * Extract workspace name from path (cross-platform)
 */
export function getWorkspaceName(path: string): string {
  if (!path) return 'No Workspace';
  const normalized = normalizePath(path);
  const parts = normalized.split('/').filter(Boolean);
  return parts[parts.length - 1] || path;
}

/**
 * Get API URL with endpoint
 */
export function getApiUrl(service: keyof typeof API_ENDPOINTS, endpoint: string): string {
  const base = API_ENDPOINTS[service].BASE;
  return `${base}${endpoint}`;
}
