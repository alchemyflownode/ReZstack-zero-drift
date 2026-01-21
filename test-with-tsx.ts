// test-with-tsx.ts
import { zeroDriftAI } from './src/services/zero-drift.ts';

console.log("🧪 Testing with tsx...");

// Test 1: Basic functionality
console.log("\n1. Testing basic curate function:");
const code1 = "const data: any = 'test';";
const result1 = zeroDriftAI.curate(code1);
console.log("   Input:", code1);
console.log("   Score:", result1.vibeScore);
console.log("   Status:", result1.status);
console.log("   Violations:", result1.violations.length > 0 ? "Found" : "None");

// Test 2: Check if fixes are applied
console.log("\n2. Checking fixes:");
console.log("   Original had 'any':", code1.includes("any"));
console.log("   Fixed has 'SovereignType':", result1.correctedCode.includes("SovereignType"));

// Test 3: Clean code
console.log("\n3. Testing clean code:");
const code2 = "function greet(name: string): string { return `Hello ${name}`; }";
const result2 = zeroDriftAI.curate(code2);
console.log("   Score:", result2.vibeScore);
console.log("   Status:", result2.status);

// Test 4: Multiple violations
console.log("\n4. Testing multiple violations:");
const code3 = `
import { cloneDeep } from 'lodash';
const config: any = {};
console.log(config);
`;
const result3 = zeroDriftAI.curate(code3);
console.log("   Score:", result3.vibeScore);
console.log("   Violations found:", result3.violations.length);
console.log("   Fixes applied:", result3.fixesApplied.length);

console.log("\n✅ ZERO-DRIFT SERVICE TEST COMPLETE!");
console.log("Summary:");
console.log("  - Any type detection: ", result1.vibeScore < 100 ? "WORKING ✅" : "NOT WORKING ❌");
console.log("  - Clean code handling: ", result2.vibeScore === 100 ? "WORKING ✅" : "NOT WORKING ❌");
console.log("  - Multiple violation detection: ", result3.violations.length >= 2 ? "WORKING ✅" : "NOT WORKING ❌");