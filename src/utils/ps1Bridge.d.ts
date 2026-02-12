export declare const runPSCommand: (command: string) => Promise<string>;
export declare const DEPENDENCY_INTENTS: {
    'scan-services': () => Promise<string>;
    'find-unused': () => Promise<string>;
    'get-import-tree': (file: string) => Promise<string>;
};
export declare const checkPowerShell: () => Promise<boolean>;
export declare const getProjectRoot: () => Promise<string>;
export declare const listFilesRecursive: (folderPath: string) => Promise<string[]>;
