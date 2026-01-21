export declare class PatternLibrary {
    private patterns;
    private successLog;
    constructor();
    private loadDefaultPatterns;
    findMatches(ast: any): Promise<PatternMatch[]>;
    crossDomainTransfer(sourceAST: any, targetDomain: string): Promise<Pattern[]>;
    recordSuccess(patternId: string, ast: any, result: any, quality: number): Promise<void>;
    private calculateMatchScore;
}
