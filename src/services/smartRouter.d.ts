/**
 * Context-Aware Smart Router
 * Analyzes Prompt + File Extension + Code Context to determine the best model.
 */
export interface RouterContext {
    prompt: string;
    fileExtension?: string;
}
export interface RoutingDecision {
    model: string;
    intent: string;
    confidence: number;
    reason: string;
}
export declare const getRoutingDecision: (context: RouterContext, availableModels: string[]) => RoutingDecision;
