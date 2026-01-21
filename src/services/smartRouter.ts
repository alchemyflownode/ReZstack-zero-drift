/**
 * Context-Aware Smart Router
 * Analyzes Prompt + File Extension + Code Context to determine the best model.
 */

export interface RouterContext {
  prompt: string;
  fileExtension?: string; // e.g., ".tsx", ".py", ".md"
}

export interface RoutingDecision {
  model: string;
  intent: string;
  confidence: number; // 0 to 100
  reason: string;
}

// Define intent signatures
const INTENT_DEFINITIONS = {
  CODE: { keywords: ['fix', 'bug', 'debug', 'refactor', 'function', 'class', 'import', 'export'], label: 'Code Generation' },
  MATH: { keywords: ['calculate', 'solve', 'equation', 'math', 'theorem', 'probability'], label: 'Logic/Math' },
  VISION: { keywords: ['image', 'describe', 'look at', 'vision', 'screenshot'], label: 'Visual Analysis' },
  WRITING: { keywords: ['summarize', 'blog', 'email', 'draft', 'translate'], label: 'Writing' }
};

// File extension mappings (Extensions strongly signal intent)
const EXTENSION_MAP: Record<string, keyof typeof INTENT_DEFINITIONS> = {
  '.ts': 'CODE', '.tsx': 'CODE', '.js': 'CODE', '.jsx': 'CODE',
  '.py': 'CODE', '.java': 'CODE', '.cpp': 'CODE', '.cs': 'CODE',
  '.md': 'WRITING', '.txt': 'WRITING',
  // Math/Logic often in notebooks or specific scripts, but we rely on keywords mostly
};

export const getRoutingDecision = (
  context: RouterContext, 
  availableModels: string[]
): RoutingDecision => {
  let scores: Record<string, number> = { CODE: 0, MATH: 0, VISION: 0, WRITING: 0 };
  let activeIntents: string[] = [];

  const { prompt, fileExtension } = context;
  const lowerPrompt = prompt.toLowerCase();

  // 1. Analyze File Extension (Strongest Signal: +30 points)
  if (fileExtension) {
    const mappedIntent = EXTENSION_MAP[fileExtension];
    if (mappedIntent) {
      scores[mappedIntent] += 30;
      activeIntents.push(`File Type: ${fileExtension}`);
    }
  }

  // 2. Analyze Keywords (Medium Signal: +20 points per match)
  for (const [key, definition] of Object.entries(INTENT_DEFINITIONS)) {
    const matchCount = definition.keywords.filter(k => lowerPrompt.includes(k)).length;
    if (matchCount > 0) {
      scores[key] += (matchCount * 20);
    }
  }

  // 3. Determine Winning Intent
  // Default to WRITING if nothing else scores high, but CODE is common default for dev tools
  let winningIntent = 'WRITING';
  let maxScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      winningIntent = intent;
    }
  }
  
  // Boost score slightly for confidence calculation if score > 0
  let confidence = maxScore > 0 ? Math.min(95, 50 + maxScore) : 40; // Base 40% confidence for generic

  // 4. Select Model based on Intent
  let targetModel = 'llama3.2:latest'; // Default safe fallback
  let reason = "General Purpose";

  switch (winningIntent) {
    case 'CODE':
      // Prefer Deepseek Coder if available, else Codellama
      targetModel = availableModels.includes('deepseek-coder:latest') ? 'deepseek-coder:latest' : 
                    availableModels.includes('codellama:7b-instruct-q4_K_M') ? 'codellama:7b-instruct-q4_K_M' : 
                    'llama3.2:latest';
      reason = "Detected Code Syntax/File";
      break;
    case 'MATH':
      targetModel = availableModels.includes('phi4:latest') ? 'phi4:latest' : 'llama3.2:latest';
      reason = "Detected Logic/Calculation";
      break;
    case 'VISION':
      targetModel = availableModels.includes('llama3.2-vision:11b') ? 'llama3.2-vision:11b' : 'llama3.2:latest';
      reason = "Detected Visual Query";
      break;
    case 'WRITING':
      targetModel = 'llama3.2:latest'; // Great at chat/writing
      reason = "General Text/Documentation";
      break;
  }

  // Final Check: Ensure model actually exists
  if (!availableModels.includes(targetModel)) {
    targetModel = availableModels.find(m => m.includes('llama3')) || availableModels[0] || 'llama3.2:latest';
    reason += " (Model unavailable, switched)";
  }

  return {
    model: targetModel,
    intent: INTENT_DEFINITIONS[winningIntent as keyof typeof INTENT_DEFINITIONS]?.label || 'General',
    confidence: confidence,
    reason
  };
};


