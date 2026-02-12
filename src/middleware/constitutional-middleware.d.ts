import type { AIService } from '../services/types';
declare global {
    interface Window {
        __REZSTACK_CONSTITUTIONAL_ERA: boolean;
    }
}
export declare function installConstitutionalMiddleware(aiService: AIService): AIService;
