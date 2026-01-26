/**
 * SOVEREIGN INTENT DISPATCHER
 * Routes tasks only to verified witnesses.
 * Never delegates critical work to unverified models.
 */

import { getWitnessClarity } from './council/clarity'; // ← Your PowerShell clarity data, exposed via IPC or cache

export interface SovereignRouterContext {
  prompt: string;
  fileExtension?: string;
  taskType: 'constitutional' | 'creative' | 'exploratory'; // ← Explicit intent
}

export interface SovereignRoutingDecision {
  model: string;
  role: 'executor' | 'verifier' | 'advisor';
  clarity: number; // From your council audit
  reason: string;
  requiresVerification: boolean;
}

// Your trusted triad (from council status)
const EXECUTIVE_COMMITTEE = ['sovereign-architect', 'llama3.2', 'glm4'];
const ADVISORY_PANEL = ['deepseek-coder'];
const RESERVE_POOL = ['mistral', 'phi4'];

export const getSovereignRoutingDecision = async (
  context: SovereignRouterContext,
  availableModels: string[]
): Promise<SovereignRoutingDecision> => {
  const { taskType } = context;

  // 1. CONSTITUTIONAL TASKS → Only Executive Committee
  if (taskType === 'constitutional') {
    const executor = EXECUTIVE_COMMITTEE.find(m => availableModels.includes(m)) 
      || 'sovereign-architect'; // Your own model is always fallback
    
    const clarity = await getWitnessClarity(executor); // ← Pull from your pulse logs
    
    return {
      model: executor,
      role: 'executor',
      clarity,
      reason: "Constitutional task: routed to verified witness",
      requiresVerification: true
    };
  }

  // 2. CREATIVE TASKS → Creator + Reviewer
  if (taskType === 'creative') {
    const creator = ADVISORY_PANEL.find(m => availableModels.includes(m)) 
      || EXECUTIVE_COMMITTEE[0];
      
    const clarity = await getWitnessClarity(creator);
    
    return {
      model: creator,
      role: 'advisor',
      clarity,
      reason: "Creative task: routed to designated advisor",
      requiresVerification: true // Always verify creative output
    };
  }

  // 3. EXPLORATORY → Reserve pool (no guarantees)
  if (taskType === 'exploratory') {
    const explorer = RESERVE_POOL.find(m => availableModels.includes(m)) 
      || availableModels[0];
      
    return {
      model: explorer,
      role: 'explorer',
      clarity: 0, // Not measured
      reason: "Exploratory task: no integrity guarantees",
      requiresVerification: false
    };
  }

  // Failsafe: route to sovereign-architect
  return {
    model: 'sovereign-architect',
    role: 'executor',
    clarity: 100,
    reason: "Failsafe: using sovereign architect",
    requiresVerification: false
  };
};