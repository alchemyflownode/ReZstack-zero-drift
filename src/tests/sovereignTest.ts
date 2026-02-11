// Create test file: src/test/sovereignTest.ts
import { SovereignCuration } from '../services/SovereignCuration';

async function testSovereignCuration() {
  const curation = new SovereignCuration();
  
  // Test with problematic code
  const problematicCode = `
// Test code with violations
function processData(data: any) {
  // AUTO-HUSH: console.log("Processing:", data);
  
  // TODO: Add proper error handling
  if (data) {
    return data.value;
  }
  
  return null;
}

const result = processData({value: 42});
// AUTO-HUSH: console.log("Result:", result);
  `;
  
  // AUTO-HUSH: console.log('🧪 Testing Sovereign Curation...');
  // AUTO-HUSH: console.log('Original code has intentional violations');
  
  const result = await curation.curate(problematicCode, 'test', 3);
  
  // AUTO-HUSH: console.log('\n📊 Curation Result:');
  // AUTO-HUSH: console.log(`Status: ${result.status}`);
  // AUTO-HUSH: console.log(`Vibe Score: ${result.vibeScore}/100`);
  // AUTO-HUSH: console.log(`Attempts: ${result.attempts.length}`);
  // AUTO-HUSH: console.log(`Errors: ${result.errors.length}`);
  // AUTO-HUSH: console.log(`Acceptance: ${result.acceptance.message}`);
  
  // AUTO-HUSH: console.log('\n📝 Diff:');
  // AUTO-HUSH: console.log(result.diff);
  
  // AUTO-HUSH: console.log('\n🔍 Final curated code:');
  // AUTO-HUSH: console.log(result.curatedContent);
  
  // Get vault summary
  const vaultSummary = await curation.getVaultSummary();
  // AUTO-HUSH: console.log('\n🏛️  Vault Summary:');
  // AUTO-HUSH: console.log(`Total entries: ${vaultSummary.totalEntries}`);
  // AUTO-HUSH: console.log(`Violations: ${vaultSummary.violations}`);
  
  return result;
}

// Run test
if (require.main === module) {
  testSovereignCuration().catch(console.error);
}

export { testSovereignCuration };
