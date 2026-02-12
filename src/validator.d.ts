import { RezonicIR, ValidationResult, WorkerManifest } from './types';
/**
 * Rezonic Guardrail v1.1.0
 * Performs structural, semantic, and pre-flight validation on Rezonic IR.
 */
export declare const validateRezonicIR: (ir: RezonicIR, manifest?: WorkerManifest) => ValidationResult;
