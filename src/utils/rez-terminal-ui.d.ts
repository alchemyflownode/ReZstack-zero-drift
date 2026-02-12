export interface TerminalTheme {
    background: string;
    foreground: string;
    cursor: string;
    selection: string;
    colors: string[];
}
export declare const defaultTheme: TerminalTheme;
export declare function formatOutput(text: string, type: 'info' | 'error' | 'success' | 'warning'): string;
export declare function parseANSI(text: string): string;
