// Constitutional Integration Example (JavaScript ES Module)
import { shouldRouteToOllama, withConstitutionalRouting } from './src/services/constitutionalIntegration.mjs';

// Example 1: Basic constitutional routing
async function example1() {
    console.log('📚 Example 1: Basic Constitutional Routing');
    console.log('='.repeat(40));
    
    const queries = [
        'Hello, how are you?',
        'Explain quantum computing',
        'How to hack a website'
    ];
    
    for (const query of queries) {
        const routing = await shouldRouteToOllama(query);
        console.log(`\nQuery: "${query}"`);
        console.log(`  Score: ${routing.score}/100`);
        console.log(`  Should use Ollama: ${routing.shouldUseOllama}`);
        console.log(`  Explanation: ${routing.explanation}`);
    }
}

// Example 2: Enhancing an existing service
async function example2() {
    console.log('\n📚 Example 2: Enhancing Existing Service');
    console.log('='.repeat(40));
    
    // Mock existing Ollama service
    const mockOllamaService = {
        model: 'llama2:7b',
        
        setModel(newModel) {
            this.model = newModel;
            console.log(`  Model changed to: ${newModel}`);
        },
        
        async stream(query) {
            console.log(`  [Mock] Streaming query to Ollama (model: ${this.model})`);
            return new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(`Mock response for: ${query}`));
                    controller.close();
                }
            });
        }
    };
    
    // Enhance with constitutional routing
    const enhancedService = withConstitutionalRouting(mockOllamaService);
    
    // Use the enhanced service
    console.log('\nTesting enhanced service:');
    await enhancedService.streamWithConstitutionalCheck('Explain constitutional AI');
}

// Example 3: Using the enhanced Ollama service
async function example3() {
    console.log('\n📚 Example 3: Using Enhanced Ollama Service');
    console.log('='.repeat(40));
    
    // Import the pre-enhanced service
    const { enhancedOllamaService } = await import('./src/services/enhancedOllamaService.mjs');
    
    console.log('\nTesting constitutional routing with real service:');
    
    try {
        // This will show constitutional analysis and routing decision
        const stream = await enhancedOllamaService.streamWithConstitution(
            'What are the ethical considerations in AI development?'
        );
        
        // Read the response
        const reader = stream.getReader();
        let response = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            response += new TextDecoder().decode(value);
        }
        
        console.log('\nResponse received:');
        console.log(response);
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

// Run all examples
async function runAllExamples() {
    console.log('🚀 Constitutional Integration Examples');
    console.log('='.repeat(50));
    
    await example1();
    await example2();
    await example3();
    
    console.log('\n' + '='.repeat(50));
    console.log('🏁 Examples complete.');
    console.log('\nNext steps:');
    console.log('1. Review the constitutional routing decisions');
    console.log('2. Test with your own queries');
    console.log('3. Integrate with your existing Ollama services');
}

// Run examples
runAllExamples().catch(console.error);
