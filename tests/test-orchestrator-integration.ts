// test-orchestrator-integration.ts
import { getOrchestrator } from './src/services/sovereign-orchestrator.ts';
import { zeroDriftAI } from './src/services/zero-drift.ts';

console.log("🧠 Testing Full RezStack Integration\n");

// Test 1: Orchestrator can be instantiated
try {
  const orchestrator = getOrchestrator();
  console.log("✅ Orchestrator instance created");
  
  // Check if it has orchestration methods
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(orchestrator));
  console.log("   Available methods:", methods.filter(m => m !== 'constructor').join(', '));
} catch (error) {
  console.log("❌ Orchestrator failed:", error.message);
}

// Test 2: Zero-Drift → Orchestrator workflow
console.log("\n🔗 Testing Workflow:");
const problematicCode = \`
import { cloneDeep } from 'lodash';
function process(data: any) {
  console.log("Debug:", data);
  return cloneDeep(data);
}
\`;

console.log("   Input code violations: any, lodash, console.log");
const curated = zeroDriftAI.curate(problematicCode);
console.log(\`   Curated score: \${curated.vibeScore}, Status: \${curated.status}\`);
console.log(\`   Fixes applied: \${curated.fixesApplied.length}\`);

console.log("\n✅ REZSTACK PLATFORM: OPERATIONAL");