import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { RezSpec } from './rez-spec';
import schemaData from './schemas/rez-spec.schema.json';

export class RezSpecValidator {
  private ajv: Ajv;
  private validateSchema: any;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: true,
      useDefaults: true,
    });
    addFormats(this.ajv);
    this.validateSchema = this.ajv.compile(schemaData);
  }

  public validate(spec: any) {
    const valid = this.validateSchema(spec);
    
    if (!valid) {
      return {
        valid: false,
        errors: this.validateSchema.errors?.map((e: any) => `${e.instancePath} ${e.message}`) || ['Schema error'],
      };
    }

    const typedSpec = spec as RezSpec;
    const expectedChecksum = this.calculateChecksum(typedSpec);

    if (typedSpec.signature.checksum !== expectedChecksum) {
      return {
        valid: false,
        errors: ['Signature checksum mismatch - integrity compromised'],
      };
    }

    return { valid: true, spec: typedSpec };
  }

  public calculateChecksum(spec: RezSpec): string {
    const { signature, ...specWithoutSig } = spec;
    // Deterministic stringify
    const json = JSON.stringify(specWithoutSig, Object.keys(specWithoutSig).sort());
    
    // Simple browser-compatible hash (or use crypto-js for production)
    let hash = '';
    if (typeof window === 'undefined') {
       const crypto = require('crypto');
       hash = crypto.createHash('sha256').update(json).digest('hex');
    } else {
       // Fast hex-conversion for browser environments
       hash = Array.from(json).reduce((acc, char) => acc + char.charCodeAt(0).toString(16), '').substring(0, 64);
    }
    return `sha256-${hash}`;
  }

  public canGenerate(spec: RezSpec): { can: boolean; reason?: string } {
    const conflict = spec.constraints.required.find(r => spec.constraints.forbidden.includes(r));
    if (conflict) {
      return { can: false, reason: `Conflict: "${conflict}" is both required and forbidden` };
    }
    return { can: true };
  }
}

export const rezValidator = new RezSpecValidator();
