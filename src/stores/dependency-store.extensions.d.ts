/**
 * EXTENSION 1: Auto-Scan on Interval
 * Automatically re-scan every 30 seconds
 */
export declare const enableAutoScan: (intervalMs?: number) => () => void;
/**
 * EXTENSION 2: File Watcher Integration
 * Re-scan when files change (requires chokidar)
 * Installation: npm install chokidar
 */
export declare const enableFileWatcher: () => Promise<() => void>;
/**
 * EXTENSION 3: Export Results
 * Export scan results as CSV
 */
export declare const exportResultsAsCSV: () => void;
/**
 * EXTENSION 4: GitHub Integration
 * Auto-create issue for unused files
 */
export declare const createGitHubIssueForUnused: (token: string, owner: string, repo: string) => Promise<any>;
/**
 * EXTENSION 5: CI/CD Integration
 * Check health score and fail if below threshold
 */
export declare const checkHealthThreshold: (threshold?: number) => boolean;
/**
 * EXTENSION 6: Pattern Analysis
 * Identify patterns in unused files
 */
export declare const analyzeUnusedPatterns: () => {
    endsWith: Record<string, number>;
    folder: Record<string, number>;
    sizeRange: {
        small: number;
        medium: number;
        large: number;
    };
};
/**
 * EXTENSION 7: Smart Recommendations
 * Generate AI-powered cleanup recommendations
 */
export declare const generateRecommendations: () => Promise<(false | {
    priority: string;
    action: string;
    reason: string;
    impact: string;
    files?: undefined;
    suggestion?: undefined;
} | {
    priority: string;
    action: string;
    reason: string;
    files: string[];
    impact?: undefined;
    suggestion?: undefined;
} | {
    priority: string;
    action: string;
    reason: string;
    suggestion: string;
    impact?: undefined;
    files?: undefined;
})[]>;
/**
 * EXTENSION 8: Batch Operations
 * Safely delete multiple unused files at once
 */
export declare const batchDeleteUnused: (maxFilesToDelete?: number) => Promise<void>;
export declare const captureHealthSnapshot: () => void;
export declare const getHealthTrend: () => {
    scoreDelta: number;
    filesDelta: number;
    trend: string;
} | null;
/**
 * EXTENSION 10: Slack Notifications
 * Send health report to Slack
 */
export declare const sendSlackNotification: (webhookUrl: string) => Promise<void>;
declare const _default: {
    enableAutoScan: (intervalMs?: number) => () => void;
    enableFileWatcher: () => Promise<() => void>;
    exportResultsAsCSV: () => void;
    createGitHubIssueForUnused: (token: string, owner: string, repo: string) => Promise<any>;
    checkHealthThreshold: (threshold?: number) => boolean;
    analyzeUnusedPatterns: () => {
        endsWith: Record<string, number>;
        folder: Record<string, number>;
        sizeRange: {
            small: number;
            medium: number;
            large: number;
        };
    };
    generateRecommendations: () => Promise<(false | {
        priority: string;
        action: string;
        reason: string;
        impact: string;
        files?: undefined;
        suggestion?: undefined;
    } | {
        priority: string;
        action: string;
        reason: string;
        files: string[];
        impact?: undefined;
        suggestion?: undefined;
    } | {
        priority: string;
        action: string;
        reason: string;
        suggestion: string;
        impact?: undefined;
        files?: undefined;
    })[]>;
    batchDeleteUnused: (maxFilesToDelete?: number) => Promise<void>;
    captureHealthSnapshot: () => void;
    getHealthTrend: () => {
        scoreDelta: number;
        filesDelta: number;
        trend: string;
    } | null;
    sendSlackNotification: (webhookUrl: string) => Promise<void>;
};
export default _default;
