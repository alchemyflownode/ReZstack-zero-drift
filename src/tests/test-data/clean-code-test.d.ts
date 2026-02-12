export declare function greet(name: string): string;
export interface User {
    id: number;
    name: string;
    email: string;
}
export declare const createUser: (name: string, email: string) => User;
