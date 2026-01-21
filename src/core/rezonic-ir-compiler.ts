// rezonic-ir-compiler.ts
export interface IRNode {
  id: string;
  type: 'model' | 'input' | 'output' | 'transform' | 'condition';
  model?: string;
  input?: string;
  transform?: (input: string) => string;
  condition?: (context: any) => boolean;
  edges: string[]; // Connected node IDs
}

export interface IRGraph {
  id: string;
  nodes: IRNode[];
  entryPoint: string;
  exitPoint: string;
}

export class RezonicIRCompiler {
  compileChainToIR(chain: ChainStep[]): IRGraph {
    const nodes: IRNode[] = [
      {
        id: 'input',
        type: 'input',
        edges: [chain[0].id]
      }
    ];
    
    // Add chain steps as nodes
    chain.forEach((step, index) => {
      nodes.push({
        id: step.id,
        type: 'model',
        model: step.model,
        edges: index < chain.length - 1 ? [chain[index + 1].id] : ['output']
      });
    });
    
    nodes.push({
      id: 'output',
      type: 'output',
      edges: []
    });
    
    return {
      id: `ir_${Date.now()}`,
      nodes,
      entryPoint: 'input',
      exitPoint: 'output'
    };
  }
  
  async executeIR(graph: IRGraph, input: string): Promise<string> {
    const context = new Map<string, any>();
    context.set('input', input);
    
    let currentNode = graph.nodes.find(n => n.id === graph.entryPoint);
    
    while (currentNode && currentNode.id !== graph.exitPoint) {
      if (currentNode.type === 'model' && currentNode.model) {
        const result = await this.executeModelNode(currentNode, context.get('current') || input);
        context.set('current', result);
        context.set(currentNode.id, result);
      }
      
      // Move to next node (simple linear execution for now)
      const nextId = currentNode.edges[0];
      currentNode = graph.nodes.find(n => n.id === nextId);
    }
    
    return context.get('current') || input;
  }
  
  private async executeModelNode(node: IRNode, input: string): Promise<string> {
    const orchestrator = getOrchestrator();
    const result = await orchestrator.executeTask(input, {
      tier: 2,
      laws: [],
      semanticNaming: true
    }, node.model!);
    
    return result.response;
  }
}


