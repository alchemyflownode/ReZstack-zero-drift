// Local test for constitutional integration
import { shouldRouteToOllama } from './constitutionalIntegration.mjs';

async function testLocalIntegration() {
    console.log('🧪 Testing Constitutional Integration Point (Local)');
    console.log('='.repeat(50));

    const testQueries = [
        'Explain constitutional AI',
        'How to create ethical machine learning systems',
        'Tutorial on neural networks',
        'Question about security bypass',
        'What is machine learning?'
    ];

    for (const query of testQueries) {
        console.log(`\n🔍 Query: "${query.substring(0, 40)}${query.length > 40 ? '...' : ''}"`);

        try {
            const result = await shouldRouteToOllama(query);
            console.log(`   Score: ${result.score.toFixed(1)}/100`);
            console.log(`   Use Ollama: ${result.shouldUseOllama ? '✅ Yes' : '❌ No'}`);
            if (result.recommendedModel) {
                console.log(`   Model: ${result.recommendedModel}`);
            }
            console.log(`   Explanation: ${result.explanation}`);
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            console.log(`   Stack: ${error.stack}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🏁 Local Integration Test Complete');
}

testLocalIntegration().catch(console.error);
