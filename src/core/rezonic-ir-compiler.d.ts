export interface IRNode {
    id: string;
    type: 'model' | 'input' | 'output' | 'transform' | 'condition';
    model?: string;
    input?: string;
    transform?: (input: string) => string;
    condition?: (context: any) => boolean;
    edges: string[];
}
export interface IRGraph {
    id: string;
    nodes: IRNode[];
    entryPoint: string;
    exitPoint: string;
}
export declare class RezonicIRCompiler {
    compileChainToIR(chain: ChainStep[]): IRGraph;
    executeIR(graph: IRGraph, input: string): Promise<string>;
    private executeModelNode;
}
