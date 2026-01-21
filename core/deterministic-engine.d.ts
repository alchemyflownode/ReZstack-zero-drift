export declare class DeterministicEngine {
    private seed;
    private trustThreshold;
    private patternLibrary;
    constructor(seed?: number, trustThreshold?: number);
    compileToAST<T extends TaskType>(task: string, type: T): Promise<AST<T>>;
    compileToPaintingAST(task: string): Promise<PaintingAST>;
    routeWithPaintingAST(ast: PaintingAST, input: string): Promise<{
        model: string;
        chain: ChainStep[];
        estimatedTime: number;
        confidence: number;
    }>;
    private deterministicHash;
    private scoreTrust;
    private applyPatterns;
}
