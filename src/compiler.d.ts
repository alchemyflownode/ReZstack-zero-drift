import { RezonicIR, WorkerManifest } from './types';
/**
 * Rezonic Compiler v1.1.0
 * Lowers abstract IR into machine-specific bytecode.
 * Now supports Dynamic Registry Hydration from Worker Manifests.
 */
export declare function transpileToComfyUI(rezonicIR: RezonicIR, worker?: WorkerManifest): Record<string, any>;
