const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function testConstitutionalBridge() {
    console.log('⚡ Quick Constitutional Bridge Test');
    console.log('Testing Python bridge from Node.js...\n');
    
    // Test 1: Call Python bridge directly
    const testQuery = 'What is constitutional AI?';
    const pythonCode = `
import sys
sys.path.insert(0, 'src/constitutional_bridge')
from constitutional_router_bridge import ConstitutionalRouterBridge
bridge = ConstitutionalRouterBridge()
result = bridge.route_with_constitution("${testQuery.replace(/"/g, '\\"')}")
import json
print(json.dumps(result))
    `.trim().replace(/\n/g, '; ');
    
    try {
        const { stdout } = await execAsync(`python -c "${pythonCode}"`);
        const result = JSON.parse(stdout);
        
        console.log('✅ Python Bridge Test Successful:');
        console.log(`   Query: "${testQuery}"`);
        if (result.constitutional_score && result.constitutional_score.score) {
            console.log(`   Score: ${result.constitutional_score.score}/100`);
        }
        console.log(`   Result keys: ${Object.keys(result).join(', ')}`);
        
    } catch (error) {
        console.log('❌ Python Bridge Test Failed:', error.message);
        console.log('   Attempting fallback test...');
        
        // Fallback: Test constitutional_judge directly
        const fallbackCode = `
import sys
sys.path.insert(0, 'G:/okiru-pure/rezsparse-trainer/src')
from constitutional_judge import get_constitutional_judge
import numpy as np
judge = get_constitutional_judge()
test_embedding = np.random.randn(512).astype(np.float32)
score = judge.score(test_embedding)
print(f"Fallback test: {score}")
        `.trim().replace(/\n/g, '; ');
        
        try {
            const { stdout } = await execAsync(`python -c "${fallbackCode}"`);
            console.log(`   Fallback test: ${stdout}`);
        } catch (e) {
            console.log('   Fallback also failed:', e.message);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🏁 Quick Test Complete');
    console.log('Next: Run full TypeScript integration');
}

testConstitutionalBridge();
