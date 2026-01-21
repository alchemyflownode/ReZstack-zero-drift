export declare class HardenedRezStackRouter {
    private activeRequests;
    private lastUsed;
    private availableVRAM;
    route(request: any): Promise<any>;
    private analyzeRequirements;
    private estimateComplexity;
    private determineTaskType;
    private hasEnoughVRAM;
    private selectHeavyModel;
    private selectCodeModel;
    private selectGeneralModel;
    private getAlternatives;
    releaseModel(modelId: string): void;
}
export default HardenedRezStackRouter;
