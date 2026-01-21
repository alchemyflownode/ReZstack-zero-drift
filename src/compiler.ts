
import { RezonicIR, RezonicNode, WorkerManifest } from './types';

/**
 * Rezonic Compiler v1.1.0
 * Lowers abstract IR into machine-specific bytecode.
 * Now supports Dynamic Registry Hydration from Worker Manifests.
 */

export function transpileToComfyUI(rezonicIR: RezonicIR, worker?: WorkerManifest): Record<string, any> {
  let nodesToProcess = [...rezonicIR.nodes];

  // Pass 1: Dead Code Elimination (DCE)
  if (rezonicIR.executionHints?.compilerFlags?.pruneDeadNodes) {
    const reachable = new Set<string>();
    const terminalNodes = nodesToProcess.filter(n => 
      n.type === "SaveImage" || n.outputType === "image"
    );
    
    const walk = (nodeId: string) => {
      if (reachable.has(nodeId)) return;
      reachable.add(nodeId);
      rezonicIR.edges
        .filter(([_, tgt]) => tgt.startsWith(`${nodeId}.`))
        .forEach(([src, _]) => walk(src.split('.')[0]));
    };

    terminalNodes.forEach(n => walk(n.id));
    nodesToProcess = nodesToProcess.filter(n => reachable.has(n.id));
  }

  const comfyPayload: Record<string, any> = {};

  // Pass 2: Node Instantiation
  nodesToProcess.forEach(node => {
    comfyPayload[node.id] = {
      class_type: node.type,
      inputs: { ...node.inputs }
    };
  });

  // Pass 3: SSA Edge Lowering using Worker Registry for indexing
  rezonicIR.edges.forEach(([source, target]) => {
    const [srcId, srcOutName] = source.split('.');
    const [tgtId, tgtInName] = target.split('.');

    if (comfyPayload[srcId] && comfyPayload[tgtId]) {
      let slotIndex = 0;
      
      // If we have a worker manifest, find the actual port index
      if (worker && worker.nodeRegistry) {
        const nodeDef = worker.nodeRegistry.find(n => n.type === comfyPayload[srcId].class_type);
        if (nodeDef) {
          const outputKeys = Object.keys(nodeDef.outputs);
          const foundIdx = outputKeys.findIndex(k => k.toUpperCase() === srcOutName.toUpperCase());
          slotIndex = foundIdx === -1 ? 0 : foundIdx;
        }
      }

      comfyPayload[tgtId].inputs[tgtInName] = [srcId, slotIndex];
    }
  });

  // Pass 4: CFG Completion
  if (rezonicIR.executionHints?.compilerFlags?.autoInsertSave) {
    const hasSave = Object.values(comfyPayload).some(n => n.class_type === "SaveImage");
    if (!hasSave) {
      const lastImageNode = nodesToProcess.find(n => n.outputType === "image");
      if (lastImageNode) {
        comfyPayload["999"] = {
          class_type: "SaveImage",
          inputs: {
            filename_prefix: "Rezonic_AutoSave",
            images: [lastImageNode.id, 0]
          }
        };
      }
    }
  }

  return comfyPayload;
}


