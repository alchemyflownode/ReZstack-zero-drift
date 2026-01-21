// src/test/sovereignTest.ts
import { SovereignCuration } from '../services/SovereignCuration.js';

async function runSovereignTest() {
  console.log('⚡ SOVEREIGN CURATION TEST');
  console.log('=========================\n');
  
  const curation = new SovereignCuration();
  
  // Test with code that has intentional violations
  const problematicCode = `
// Example code with multiple violations
function processUserData(user: any) {
  console.log("Processing user:", user);
  
  // TODO: Add proper validation
  const data = JSON.parse(user.jsonData);
  
  return {
    id: data.id,
    name: data.name,
    score: calculateScore(data)
  };
}

function calculateScore(data: any): number {
  // TODO: Implement proper scoring algorithm
  console.log("Calculating score for:", data);
  return data.points * 0.5;
}

const result = processUserData({ jsonData: '{"id":1,"name":"Test","points":100}' });
console.log("Result:", result);
  `;
  
  console.log('🧪 Testing code with intentional violations:');
  console.log('• : any type (Semantic Integrity violation)');
  console.log('• console.log statements (Architectural Silence violation)');
  console.log('• TODO comments (State Documentation violation)');
  console.log('• JSON.parse without try/catch (Truth-First violation)\n');
  
  console.log('🔄 Starting curation process...\n');
  
  try {
    const result = await curation.curate(problematicCode, 'test', 3);
    
    console.log('\n📊 CURATION RESULTS:');
    console.log('='.repeat(40));
    console.log(`Status: ${result.status}`);
    console.log(`Vibe Score: ${result.vibeScore}/100`);
    console.log(`Attempts: ${result.attempts}`);
    console.log(`Errors fixed: ${result.errors.length}`);
    console.log(`Acceptance: ${result.acceptance.message}`);
    
    console.log('\n📝 GENERATED DIFF:');
    console.log('='.repeat(40));
    if (result.diff.includes('Line')) {
      console.log(result.diff);
    } else {
      console.log('No changes made');
    }
    
    console.log('\n💾 VAULT SUMMARY:');
    console.log('='.repeat(40));
    const vault = curation.getVaultSummary();
    console.log(`Total entries: ${vault.total}`);
    if (vault.recent.length > 0) {
      console.log('Recent entries:');
      vault.recent.forEach(entry => {
        console.log(`  • ${entry.hash}: ${entry.context} (${new Date(entry.timestamp).toLocaleTimeString()})`);
      });
    }
    
    console.log('\n✅ TEST COMPLETE');
    return result;
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSovereignTest().catch(console.error);
}

export { runSovereignTest };
