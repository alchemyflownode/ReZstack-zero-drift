// test-bad-code.ts
import { zeroDriftAI } from './src/services/zero-drift.ts';

const badCode = `
import { cloneDeep } from 'lodash';
const config: any = {};
console.log('Debug:', config);
`;

console.log("🧪 Testing with REAL bad code:");
console.log("Code to analyze:");
console.log(badCode);

const result = zeroDriftAI.curate(badCode);

console.log("\n📊 RESULTS:");
console.log("Vibe Score:", result.vibeScore, "/ 100");
console.log("Status:", result.status);
console.log("Violations found:", result.violations.length);
console.log("Fixes applied:", result.fixesApplied.length);

console.log("\n🔧 What was fixed:");
result.fixesApplied.forEach((fix, i) => {
  console.log(\`  \${i + 1}. \${fix}\`);
});

console.log("\n📝 Corrected code (first 200 chars):");
console.log(result.correctedCode.substring(0, 200) + (result.correctedCode.length > 200 ? "..." : ""));