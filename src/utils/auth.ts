// Simple auth utility for demo purposes
// In a real app, this would integrate with your authentication system

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
}

export const getLoggedInUser = (): User | null => {
    // For demo purposes, return a mock user
    // In a real app, check localStorage, cookies, or auth state
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const setLoggedInUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const logout = (): void => {
    localStorage.removeItem('user');
    // Note: Token is managed by Supabase session
    // Use supabase.auth.signOut() for complete logout
};

export const isAuthenticated = (): boolean => {
    return getLoggedInUser() !== null;
};