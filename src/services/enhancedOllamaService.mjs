// Enhanced Ollama Service with Constitutional Routing (JavaScript ES Module)
import { shouldRouteToOllama } from './constitutionalIntegration.mjs';

/**
 * Enhanced Ollama service with constitutional routing
 */
export class EnhancedOllamaService {
    constructor(baseUrl = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
        this.currentModel = 'llama2:7b';
    }

    /**
     * Main method with constitutional routing
     */
    async streamWithConstitution(query, options = {}) {
        console.log('🎯 Constitutional Routing Analysis...');

        // Get constitutional routing decision
        const routing = await shouldRouteToOllama(query);

        console.log(`📊 Score: ${routing.score.toFixed(1)}/100`);
        console.log(`🤖 Use Ollama: ${routing.shouldUseOllama ? '✅ Yes' : '❌ No'}`);
        console.log(`💡 Explanation: ${routing.explanation}`);

        if (routing.shouldUseOllama) {
            // Use constitutionally recommended model
            if (routing.recommendedModel) {
                this.currentModel = routing.recommendedModel;
                console.log(`🚀 Using recommended model: ${this.currentModel}`);
            }

            // Call Ollama with the selected model
            return await this.callOllama(query, options);
        } else {
            // Handle non-Ollama routing
            console.log(`🔄 Routing to alternative destination`);
            return this.createAlternativeResponse(routing, query);
        }
    }

    /**
     * Call Ollama API
     */
    async callOllama(query, options) {
        console.log(`📤 Sending to Ollama (${this.currentModel})...`);

        try {
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

        } catch (error) {
            console.error('❌ Ollama API call failed:', error.message);
            return this.createErrorResponse(error, query);
        }
    }

    /**
     * Create response for non-Ollama routing
     */
    createAlternativeResponse(routing, query) {
        return new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                let response = `🔒 Constitutional Routing Result\n`;
                response += `Query: "${query}"\n`;
                response += `Constitutional Score: ${routing.score.toFixed(1)}/100\n`;
                response += `Decision: ${routing.explanation}\n\n`;

                if (routing.score > 70) {
                    response += `This query has high constitutional alignment.\n`;
                    response += `Consider using Claude or another high-safety model.`;
                } else {
                    response += `This query requires careful consideration.\n`;
                    response += `Use sandbox environment for evaluation.`;
                }

                controller.enqueue(encoder.encode(response));
                controller.close();
            }
        });
    }

    /**
     * Create error response
     */
    createErrorResponse(error, query) {
        return new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                const response = `❌ Error Processing Query\n`;
                response += `Query: "${query}"\n`;
                response += `Error: ${error.message}\n`;
                response += `\nPlease try again or contact support.`;
                controller.enqueue(encoder.encode(response));
                controller.close();
            }
        });
    }

    /**
     * Set model manually
     */
    setModel(model) {
        this.currentModel = model;
        console.log(`🔄 Model set to: ${this.currentModel}`);
    }

    /**
     * Get current model
     */
    getModel() {
        return this.currentModel;
    }
}

// Export singleton instance
export const enhancedOllamaService = new EnhancedOllamaService();
