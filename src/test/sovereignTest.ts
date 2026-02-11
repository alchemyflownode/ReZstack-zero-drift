// src/test/sovereignTest.ts
import { SovereignCuration } from '../services/SovereignCuration.js';

async function runSovereignTest() {
  // AUTO-HUSH: console.log('? SOVEREIGN CURATION TEST');
  // AUTO-HUSH: console.log('=========================\n');
  
  const curation = new SovereignCuration();
  
  // Test with code that has intentional violations
  const problematicCode = `
// Example code with multiple violations
function processUserData(user: any) {
  // AUTO-HUSH: console.log("Processing user:", user);
  
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
  // AUTO-HUSH: console.log("Calculating score for:", data);
  return data.points * 0.5;
}

const result = processUserData({ jsonData: '{"id":1,"name":"Test","points":100}' });
// AUTO-HUSH: console.log("Result:", result);
  `;
  
  // AUTO-HUSH: console.log('?? Testing code with intentional violations:');
  // AUTO-HUSH: console.log('• : any type (Semantic Integrity violation);');
  // AUTO-HUSH: console.log('• console.log statements (Architectural Silence violation);');
  // AUTO-HUSH: console.log('• TODO comments (State Documentation violation);');
  // AUTO-HUSH: console.log('• JSON.parse without try/catch (Truth-First violation);\n');
  
  // AUTO-HUSH: console.log('?? Starting curation process...\n');
  
  try {
    const result = await curation.curate(problematicCode, 'test', 3);
    
    // AUTO-HUSH: console.log('\n?? CURATION RESULTS:');
    // AUTO-HUSH: console.log('='.repeat(40););
    // AUTO-HUSH: console.log(`Status: ${result.status}`);
    // AUTO-HUSH: console.log(`Vibe Score: ${result.vibeScore}/100`);
    // AUTO-HUSH: console.log(`Attempts: ${result.attempts}`);
    // AUTO-HUSH: console.log(`Errors fixed: ${result.errors.length}`);
    // AUTO-HUSH: console.log(`Acceptance: ${result.acceptance.message}`);
    
    // AUTO-HUSH: console.log('\n?? GENERATED DIFF:');
    // AUTO-HUSH: console.log('='.repeat(40););
    if (result.diff.includes('Line')) {
      // AUTO-HUSH: console.log(result.diff);
    } else {
      // AUTO-HUSH: console.log('No changes made');
    }
    
    // AUTO-HUSH: console.log('\n?? VAULT SUMMARY:');
    // AUTO-HUSH: console.log('='.repeat(40););
    const vault = curation.getVaultSummary();
    // AUTO-HUSH: console.log(`Total entries: ${vault.total}`);
    if (vault.recent.length > 0) {
      // AUTO-HUSH: console.log('Recent entries:');
      vault.recent.forEach(entry => {
        // AUTO-HUSH: console.log(`  • ${entry.hash}: ${entry.context} (${new Date(entry.timestamp);.toLocaleTimeString()})`);
      });
    }
    
    // AUTO-HUSH: console.log('\n? TEST COMPLETE');
    return result;
    
  } catch (error) {
    console.error('\n? TEST FAILED:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSovereignTest().catch(console.error);
}

export { runSovereignTest };

