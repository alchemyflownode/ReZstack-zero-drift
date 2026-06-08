// test-zero-drift.mjs (ESM module)
console.log("🧪 Testing Zero-Drift Service (ESM)...");

try {
  // Dynamic import for ESM
  const module = await import('./src/services/zero-drift.ts');
  
  console.log("✅ Import successful");
  console.log("Exports:", Object.keys(module));
  
  if (!module.zeroDriftAI) {
    console.log("❌ zeroDriftAI not found in exports");
    process.exit(1);
  }
  
  const { zeroDriftAI } = module;
  
  console.log("\n1. Testing 'any' type detection...");
  const result1 = zeroDriftAI.curate("const x: any = 5;");
  console.log("   Score:", result1.vibeScore);
  console.log("   Status:", result1.status);
  console.log("   Violations:", result1.violations);
  console.log("   Fixed code contains 'SovereignType':", result1.correctedCode.includes("SovereignType"));
  
  console.log("\n2. Testing lodash import detection...");
  const result2 = zeroDriftAI.curate("import { cloneDeep } from 'lodash';");
  console.log("   Score:", result2.vibeScore);
  console.log("   Violations:", result2.violations);
  console.log("   Fixed code:", result2.correctedCode.substring(0, 100) + "...");
  
  console.log("\n3. Testing clean code...");
  const result3 = zeroDriftAI.curate("const add = (a: number, b: number): number => a + b;");
  console.log("   Score:", result3.vibeScore);
  console.log("   Status:", result3.status);
  
  console.log("\n4. Testing refineAggressively...");
  const result4 = zeroDriftAI.refineAggressively("console.log('test'); // TODO: remove this");
  console.log("   Score:", result4.vibeScore);
  console.log("   Fixes applied:", result4.fixesApplied);
  
  console.log("\n✅ ZERO-DRIFT SERVICE IS OPERATIONAL!");
  
} catch (error) {
  console.error("❌ Test failed:", error.message);
  console.error("Stack:", error.stack);
  process.exit(1);
}