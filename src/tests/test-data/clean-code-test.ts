// Clean code - should pass with high score
export function greet(name: string): string {
    return `Hello, ${name}!`;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export const createUser = (name: string, email: string): User => ({
    id: Date.now(),
    name,
    email
});
