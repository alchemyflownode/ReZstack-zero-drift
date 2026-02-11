// Constitutional Integration Point for Ollama Service
// Minimal integration that can be added to existing services

/**
 * Constitutional routing integration
 * This can be imported by existing Ollama services
 */

export interface ConstitutionalRoutingResult {
    score: number;
    shouldUseOllama: boolean;
    recommendedModel?: string;
    explanation: string;
}

/**
 * Check if query should be routed to Ollama based on constitutional score
 */
export async function shouldRouteToOllama(query: string): Promise<ConstitutionalRoutingResult> {
    try {
        // Call Python constitutional bridge
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);

        const pythonCode = `
import sys
sys.path.insert(0, 'src/constitutional_bridge')
from constitutional_router_bridge import ConstitutionalRouterBridge
bridge = ConstitutionalRouterBridge()
result = bridge.route_with_constitution("${query.replace(/"/g, '\\"').replace(/'/g, "\\'")}")
import json
print(json.dumps(result))
        `.trim().replace(/\n/g, '; ');

        const { stdout } = await execAsync(`python -c "${pythonCode}"`);
        const result = JSON.parse(stdout);

        const score = result.constitutional_score?.score || 50;
        const shouldUseOllama = score > 30 && score <= 70; // Medium constitutional score

        return {
            score,
            shouldUseOllama,
            recommendedModel: shouldUseOllama ? 'llama2:7b' : undefined,
            explanation: `Constitutional score: ${score.toFixed(1)}/100. ${shouldUseOllama ? 'Suitable for Ollama' : 'Not suitable for Ollama'}.`
        };

    } catch (error) {
        console.warn('Constitutional routing failed, using default:', error.message);
        // Fallback: Assume medium score, use Ollama
        return {
            score: 50,
            shouldUseOllama: true,
            recommendedModel: 'llama2:7b',
            explanation: 'Constitutional routing unavailable, using default Ollama routing.'
        };
    }
}

/**
 * Simple hook for existing Ollama services
 */
export function withConstitutionalRouting(originalService: any) {
    return {
        ...originalService,

        async streamWithConstitutionalCheck(query: string, options?: any) {
            const routing = await shouldRouteToOllama(query);

            console.log('🎯 Constitutional Routing Check:');
            console.log(`   Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
            console.log(`   Score: ${routing.score.toFixed(1)}/100`);
            console.log(`   Use Ollama: ${routing.shouldUseOllama ? '✅ Yes' : '❌ No'}`);
            console.log(`   Explanation: ${routing.explanation}`);

            if (routing.shouldUseOllama && routing.recommendedModel) {
                // Update model if needed
                if (originalService.setModel) {
                    originalService.setModel(routing.recommendedModel);
                }

                // Call original streaming method
                return originalService.stream(query, options);
            } else {
                // Return mock response for non-Ollama routes
                return new ReadableStream({
                    start(controller) {
                        const encoder = new TextEncoder();
                        controller.enqueue(encoder.encode(`[Constitutional Routing] Query routed elsewhere: ${routing.explanation}`));
                        controller.close();
                    }
                });
            }
        }
    };
}
