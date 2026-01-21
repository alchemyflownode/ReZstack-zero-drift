
import { RezonicIR, ValidationResult, WorkerManifest } from './types';

/**
 * Rezonic Guardrail v1.1.0
 * Performs structural, semantic, and pre-flight validation on Rezonic IR.
 */

export const validateRezonicIR = (ir: RezonicIR, manifest?: WorkerManifest): ValidationResult => {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    severity: "none"
  };

  // 1. Structural Validation
  if (ir.version !== "1.1.0") {
    result.errors.push(`Version mismatch: Expected 1.1.0, got ${ir.version}`);
  }
  if (!ir.nodes || ir.nodes.length === 0) {
    result.errors.push("Graph contains no executable nodes.");
  }

  // 2. Semantic Integrity: DAG Check (Cycle Detection)
  if (detectCycles(ir)) {
    result.errors.push("Cyclic dependency detected in graph. Rezonic IR v1.1.0 must be a DAG.");
  }

  // 3. Slot Validation: Edge Mapping
  ir.edges.forEach(([source, target]) => {
    const srcParts = source.split('.');
    const tgtParts = target.split('.');
    
    if (srcParts.length < 2 || tgtParts.length < 2) {
      result.errors.push(`Malformed SSA edge definition: ${source} -> ${target}`);
    } else {
      const [srcId] = srcParts;
      const [tgtId] = tgtParts;
      
      const srcNode = ir.nodes.find(n => n.id === srcId);
      const tgtNode = ir.nodes.find(n => n.id === tgtId);
      
      if (!srcNode) result.errors.push(`Source node %${srcId} not found in nodes registry.`);
      if (!tgtNode) result.errors.push(`Target node %${tgtId} not found in nodes registry.`);
    }
  });

  // 4. Pre-Flight: Worker Compatibility
  if (manifest) {
    ir.nodes.forEach(node => {
      if (!manifest.availableNodes.includes(node.type)) {
        result.errors.push(`Node type '${node.type}' is unavailable on targeted worker '${manifest.id}'.`);
      }
      if (node.workerRequirement?.minVram && node.workerRequirement.minVram > (manifest.vramCapacity - manifest.vramUsed)) {
        result.warnings.push(`Low VRAM potential on node %${node.id}. Required: ${node.workerRequirement.minVram}GB.`);
      }
    });
  }

  if (result.errors.length > 0) {
    result.valid = false;
    result.severity = result.errors.length > 3 ? "critical" : "high";
    result.remediation = "Triggering Autonomous Healing Loop...";
  }

  return result;
};

function detectCycles(ir: RezonicIR): boolean {
  const adj = new Map<string, string[]>();
  ir.nodes.forEach(n => adj.set(n.id, []));
  ir.edges.forEach(([src, tgt]) => {
    const srcId = src.split('.')[0];
    const tgtId = tgt.split('.')[0];
    adj.get(srcId)?.push(tgtId);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const isCyclic = (v: string): boolean => {
    if (recStack.has(v)) return true;
    if (visited.has(v)) return false;

    visited.add(v);
    recStack.add(v);

    const neighbors = adj.get(v) || [];
    for (const neighbor of neighbors) {
      if (isCyclic(neighbor)) return true;
    }

    recStack.delete(v);
    return false;
  };

  for (const node of ir.nodes) {
    if (isCyclic(node.id)) return true;
  }

  return false;
}


