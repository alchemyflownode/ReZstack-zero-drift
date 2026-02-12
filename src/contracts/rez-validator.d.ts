import { RezSpec } from './rez-spec';
export declare class RezSpecValidator {
    private ajv;
    private validateSchema;
    constructor();
    validate(spec: any): {
        valid: boolean;
        errors: any;
        spec?: undefined;
    } | {
        valid: boolean;
        spec: RezSpec;
        errors?: undefined;
    };
    calculateChecksum(spec: RezSpec): string;
    canGenerate(spec: RezSpec): {
        can: boolean;
        reason?: string;
    };
}
export declare const rezValidator: RezSpecValidator;
