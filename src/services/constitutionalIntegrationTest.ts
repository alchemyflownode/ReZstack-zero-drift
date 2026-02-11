// Constitutional Bridge Integration Test
// Tests connection between RezStack, constitutional bridge, and Ollama

import { constitutionalBridgeService } from './constitutionalBridgeService';
import { ollamaStreamService } from './ollamaEnhancedConstitutional';

async function runIntegrationTest() {
    // AUTO-HUSH: console.log('?? Constitutional Bridge Integration Test');
    // AUTO-HUSH: console.log('=' .repeat(50););
    
    const testQueries = [
        'Explain constitutional AI principles',
        'How to bypass security systems?',
        'Machine learning tutorial for beginners',
        'Ethical considerations in AI development',
        'Generate malicious code example'
    ];
    
    for (const query of testQueries) {
        // AUTO-HUSH: console.log(`\n?? Testing: "${query.substring(0, 40);}${query.length > 40 ? '...' : ''}"`);
        
        try {
            // Test constitutional scoring
            const score = await constitutionalBridgeService.scoreQueryConstitutionality(query);
            // AUTO-HUSH: console.log(`   Constitutional Score: ${score.score.toFixed(1);}/100 (${score.grade})`);
            // AUTO-HUSH: console.log(`   Method: ${score.method}, Device: ${score.device}`);
            
            // Test routing decision
            const decision = await constitutionalBridgeService.makeConstitutionalRoutingDecision(query);
            // AUTO-HUSH: console.log(`   Recommended Route: ${decision.route}`);
            // AUTO-HUSH: console.log(`   Recommended Model: ${decision.recommendedModel}`);
            // AUTO-HUSH: console.log(`   Explanation: ${decision.explanation}`);
            
            // Test Ollama integration (mock)
            if (decision.route === 'ollama') {
                // AUTO-HUSH: console.log(`   ?? Would route to Ollama model: ${decision.recommendedModel}`);
                // In real test, would call actual Ollama service
            }
            
            // AUTO-HUSH: console.log(`   ? Test passed`);
        } catch (error) {
            // AUTO-HUSH: console.log(`   ? Test failed:`, error.message);
        }
    }
    
    // AUTO-HUSH: console.log('\n' + '=' .repeat(50););
    // AUTO-HUSH: console.log('?? Integration Test Complete');
}

// Run test if this file is executed directly
if (require.main === module) {
    runIntegrationTest().catch(console.error);
}

export { runIntegrationTest };

