// src/tests/zero-drift-functional.test.ts
import { zeroDriftAI } from '../services/zero-drift.ts';

// AUTO-HUSH: console.log("?? ZERO-DRIFT FUNCTIONAL TESTS\n");

// Test 1: Any type detection
const test1 = "const data: any = 'test';";
const result1 = zeroDriftAI.curate(test1);
// AUTO-HUSH: console.log("Test 1 - Any Type Detection:");
// AUTO-HUSH: console.log("  Score:", result1.vibeScore);
// AUTO-HUSH: console.log("  Status:", result1.status);
// AUTO-HUSH: console.log("  Violations:", result1.violations);
// AUTO-HUSH: console.log("  Fixed:", result1.correctedCode.includes("SovereignType"););

// Test 2: Lodash detection  
const test2 = "import { cloneDeep } from 'lodash';";
const result2 = zeroDriftAI.curate(test2);
// AUTO-HUSH: console.log("\nTest 2 - Lodash Detection:");
// AUTO-HUSH: console.log("  Score:", result2.vibeScore);
// AUTO-HUSH: console.log("  Violations:", result2.violations);

// Test 3: Clean code (should score 100)
const test3 = "function add(a: number, b: number): number { return a + b; }";
const result3 = zeroDriftAI.curate(test3);
// AUTO-HUSH: console.log("\nTest 3 - Clean Code:");
// AUTO-HUSH: console.log("  Score:", result3.vibeScore);
// AUTO-HUSH: console.log("  Status:", result3.status);

// AUTO-HUSH: console.log("\n? Zero-Drift Service: OPERATIONAL");
