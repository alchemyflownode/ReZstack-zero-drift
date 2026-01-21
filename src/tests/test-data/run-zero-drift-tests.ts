// Simple test runner for zero-drift
import { zeroDriftAI } from '../zero-drift.ts';

async function runTests() {
    console.log("🧪 Running Zero-Drift Tests...");
    
    // Test 1: any type detection
    const test1 = \`const data: any = "test";\`;
    const result1 = zeroDriftAI.curate(test1);
    console.log("Test 1 - any type detection:");
    console.log("  Score:", result1.vibeScore);
    console.log("  Violations:", result1.violations.length);
    console.log("  Fixed:", result1.correctedCode.includes("SovereignType"));
    
    // Test 2: clean code
    const test2 = \`const greet = (name: string): string => \`Hello \${name}\`;\`;
    const result2 = zeroDriftAI.curate(test2);
    console.log("\nTest 2 - clean code:");
    console.log("  Score:", result2.vibeScore);
    console.log("  Status:", result2.status);
    
    // Test 3: aggressive refinement
    const test3 = \`function debug() { console.log("test"); // TODO: remove }\`;
    const result3 = zeroDriftAI.refineAggressively(test3);
    console.log("\nTest 3 - aggressive refinement:");
    console.log("  Fixes applied:", result3.fixesApplied.length);
    
    return { result1, result2, result3 };
}

if (import.meta.main) {
    runTests().catch(console.error);
}

export { runTests };
