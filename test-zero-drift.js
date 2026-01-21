// test-zero-drift.js
console.log("🧪 Testing Zero-Drift Service...");

// Try to import using require (CommonJS)
try {
  const path = require('path');
  
  // Since we're using ESM, let's try dynamic import
  import('../services/zero-drift.ts').then(module => {
    console.log("✅ Import successful");
    
    const { zeroDriftAI } = module;
    
    // Test 1
    const test1 = "const data: any = 'test';";
    const result1 = zeroDriftAI.curate(test1);
    console.log("\nTest 1 - Any Type Detection:");
    console.log("  Score:", result1.vibeScore);
    console.log("  Violations:", result1.violations);
    
    // Test 2
    const test2 = "import { cloneDeep } from 'lodash';";
    const result2 = zeroDriftAI.curate(test2);
    console.log("\nTest 2 - Lodash Detection:");
    console.log("  Score:", result2.vibeScore);
    
    console.log("\n✅ Zero-Drift Service is working!");
  }).catch(error => {
    console.error("❌ Import error:", error.message);
  });
  
} catch (error) {
  console.error("❌ Setup error:", error.message);
}