/**
 * SOVEREIGN INTENT DISPATCHER
 * Routes tasks only to verified witnesses.
 * Never delegates critical work to unverified models.
 */
export interface SovereignRouterContext {
    prompt: string;
    fileExtension?: string;
    taskType: 'constitutional' | 'creative' | 'exploratory';
}
export interface SovereignRoutingDecision {
    model: string;
    role: 'executor' | 'verifier' | 'advisor';
    clarity: number;
    reason: string;
    requiresVerification: boolean;
}
export declare const getSovereignRoutingDecision: (context: SovereignRouterContext, availableModels: string[]) => Promise<SovereignRoutingDecision>;
