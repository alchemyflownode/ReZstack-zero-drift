// Enhanced Ollama Service with Constitutional Routing
// Updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

import { constitutionalBridgeService, RoutingDecision } from './constitutionalBridgeService';

// Original Ollama service logic (preserved)
export class OllamaStreamService {
    private baseUrl: string;
    private currentModel: string = 'llama2'; // Default
    
    constructor(baseUrl: string = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
    }
    
    /**
     * Enhanced stream method with constitutional routing
     */
    async streamWithConstitutionalRouting(query: string, options?: any) {
        // AUTO-HUSH: console.log('?? Constitutional routing analysis for query:', query.substring(0, 50); + '...');
        
        // Get constitutional routing decision
        const routingDecision = await constitutionalBridgeService.makeConstitutionalRoutingDecision(query);
        
        console.log('?? Constitutional Decision:', {
            score: routingDecision.constitutionalScore.score,
            route: routingDecision.route,
            model: routingDecision.recommendedModel,
            explanation: routingDecision.explanation
        });
        
        // Route based on constitutional decision
        if (routingDecision.route === 'ollama') {
            // Use Ollama with constitutionally recommended model
            this.currentModel = routingDecision.recommendedModel;
            // AUTO-HUSH: console.log(`?? Using Ollama model: ${this.currentModel} (constitutional score: ${routingDecision.constitutionalScore.score}/100);`);
            
            // Call original Ollama streaming logic
            return await this.streamToOllama(query, options);
        } else if (routingDecision.route === 'claude') {
            // AUTO-HUSH: console.log('?? Routing to Claude (high constitutional score);');
            // In real implementation, would call Claude API
            return this.mockClaudeResponse(query, routingDecision);
        } else {
            // AUTO-HUSH: console.log('?? Routing to sandbox (low constitutional score);');
            return this.mockSandboxResponse(query, routingDecision);
        }
    }
    
    /**
     * Original Ollama streaming logic (preserved)
     */
    private async streamToOllama(query: string, options?: any) {
        // Original implementation
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.currentModel,
                prompt: query,
                stream: true,
                ...options
            })
        });
        
        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }
        
        return response.body;
    }
    
    private mockClaudeResponse(query: string, decision: RoutingDecision) {
        // Mock Claude response for demonstration
        return new ReadableStream({
            start(controller) {
                const response = `[Claude - Constitutional Routing]\nQuery: "${query}"\nConstitutional Score: ${decision.constitutionalScore.score}/100\nDecision: ${decision.explanation}\n\nResponse: This query has high constitutional alignment. Providing authoritative response...`;
                controller.enqueue(new TextEncoder().encode(response));
                controller.close();
            }
        });
    }
    
    private mockSandboxResponse(query: string, decision: RoutingDecision) {
        // Mock sandbox response for demonstration
        return new ReadableStream({
            start(controller) {
                const response = `[Sandbox - Experimental Mode]\nQuery: "${query}"\nConstitutional Score: ${decision.constitutionalScore.score}/100\nWarning: Low constitutional score - experimental mode active\n\nResponse: This query requires careful consideration in isolated environment...`;
                controller.enqueue(new TextEncoder().encode(response));
                controller.close();
            }
        });
    }
    
    // Preserve other original methods...
    async setModel(model: string) {
        this.currentModel = model;
    }
    
    getCurrentModel() {
        return this.currentModel;
    }
}

export const ollamaStreamService = new OllamaStreamService();

