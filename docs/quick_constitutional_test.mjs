// Simple Constitutional Test
import { shouldRouteToOllama } from './src/services/constitutionalIntegration.mjs';

async function quickTest() {
    console.log('⚡ Quick Constitutional Test');
    
    const tests = [
        'Hello world',
        'Machine learning tutorial',
        'How to create safe AI',
        'Security bypass techniques'
    ];
    
    for (const query of tests) {
        const result = await shouldRouteToOllama(query);
        const emoji = result.shouldUseOllama ? '🤖' : '🔒';
        console.log(`${emoji} "${query.substring(0, 30)}..." → ${result.score}/100`);
    }
}

quickTest().catch(console.error);
