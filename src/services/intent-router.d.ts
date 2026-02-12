export interface IntentClassification {
    primaryIntent: string;
    secondaryIntents: string[];
    confidence: number;
    urgency: 'immediate' | 'near-term' | 'exploratory';
    modality: 'visual' | 'data' | 'interactive' | 'administrative';
    userState: {
        isStruggling: boolean;
        context: string[];
        preferredDensity: 'compact' | 'balanced' | 'expanded';
    };
}
export interface ComponentManifest {
    id: string;
    name: string;
    description: string;
    intents: string[];
    props: Record<string, {
        type: string;
        required: boolean;
        description: string;
    }>;
    driftLaws: string[];
    motionProfile: 'subtle' | 'expressive' | 'immersive';
    accessibilityLevel: 'basic' | 'enhanced' | 'full';
}
export interface ViewArchitecture {
    layout: 'fullscreen' | 'overlay' | 'sidebar' | 'modal' | 'ambient';
    primaryComponent: string;
    supportingComponents: string[];
    transitions: {
        entry: 'slide-up' | 'fade-in' | 'scale' | 'morph';
        exit: 'slide-down' | 'fade-out' | 'scale-down' | 'morph-out';
        duration: number;
    };
    contextPersistence: 'session' | 'temporary' | 'persistent';
}
declare class IntentRouter {
    private readonly componentManifest;
    private readonly designTokens;
    /**
     * Classify user intent using local LLM
     */
    classifyIntent(userInput: string, context: {
        previousIntents: IntentClassification[];
        systemState: Record<string, any>;
        userBehavior: {
            attentionSpan: number;
            interactionRate: number;
            struggleIndicators: string[];
        };
    }): Promise<IntentClassification>;
    private buildIntentClassificationPrompt;
    /**
     * Architect a complete view based on intent
     */
    architectView(intent: IntentClassification, availableData: Record<string, any>): Promise<ViewArchitecture>;
    private selectPrimaryComponent;
    private selectSupportingComponents;
    private determineLayout;
    private designTransitions;
    /**
     * Generate props for a component based on intent and data
     */
    generateComponentProps(component: ComponentManifest, intent: IntentClassification, availableData: Record<string, any>): Record<string, any>;
    private generatePropValue;
    private getDesignTokensForIntent;
    private generateMockFinancialData;
    private enforceClassificationLaws;
    private ruleBasedClassification;
}
export declare const intentRouter: IntentRouter;
export {};
