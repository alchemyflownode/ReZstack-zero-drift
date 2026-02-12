import { NodeDefinition } from './types';
/**
 * Rezonic Local Bridge Service
 * Encapsulates communication with 127.0.0.1 workers.
 */
export declare const testWorkerConnection: (endpoint: string) => Promise<boolean>;
export declare const fetchComfyNodeRegistry: (endpoint: string) => Promise<NodeDefinition[]>;
