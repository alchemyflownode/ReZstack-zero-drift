// Base Service - Core service functionality
export interface ServiceConfig {
  baseUrl?: string;
  timeout?: number;
}

export abstract class BaseService {
  protected config: ServiceConfig;

  constructor(config: ServiceConfig = {}) {
    this.config = {
      baseUrl: '/api',
      timeout: 30000,
      ...config
    };
  }

  protected async handleError(error: unknown): Promise<never> {
    console.error('Service error:', error);
    throw error;
  }
}

export default BaseService;


