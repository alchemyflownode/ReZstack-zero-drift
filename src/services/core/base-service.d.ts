export interface ServiceConfig {
    baseUrl?: string;
    timeout?: number;
}
export declare abstract class BaseService {
    protected config: ServiceConfig;
    constructor(config?: ServiceConfig);
    protected handleError(error: unknown): Promise<never>;
}
export default BaseService;
