// Create test file: src/test/sovereignTest.ts
import { SovereignCuration } from '../services/SovereignCuration';

async function testSovereignCuration() {
  const curation = new SovereignCuration();
  
  // Test with problematic code
  const problematicCode = `
// Test code with violations
function processData(data: any) {
  console.log("Processing:", data);
  
  // TODO: Add proper error handling
  if (data) {
    return data.value;
  }
  
  return null;
}

const result = processData({value: 42});
console.log("Result:", result);
  `;
  
  console.log('🧪 Testing Sovereign Curation...');
  console.log('Original code has intentional violations');
  
  const result = await curation.curate(problematicCode, 'test', 3);
  
  console.log('\n📊 Curation Result:');
  console.log(`Status: ${result.status}`);
  console.log(`Vibe Score: ${result.vibeScore}/100`);
  console.log(`Attempts: ${result.attempts.length}`);
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Acceptance: ${result.acceptance.message}`);
  
  console.log('\n📝 Diff:');
  console.log(result.diff);
  
  console.log('\n🔍 Final curated code:');
  console.log(result.curatedContent);
  
  // Get vault summary
  const vaultSummary = await curation.getVaultSummary();
  console.log('\n🏛️  Vault Summary:');
  console.log(`Total entries: ${vaultSummary.totalEntries}`);
  console.log(`Violations: ${vaultSummary.violations}`);
  
  return result;
}

// Run test
if (require.main === module) {
  testSovereignCuration().catch(console.error);
}

export { testSovereignCuration };