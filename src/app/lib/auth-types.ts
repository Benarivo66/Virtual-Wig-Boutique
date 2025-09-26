// Authentication-related TypeScript interfaces

// JWT payload interface
export interface JWTPayload {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
    iat: number;
    exp: number;
}

// User payload for token generation (without timestamps)
export interface UserPayload {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
}

// Registration data interface
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

// Login credentials interface
export interface LoginCredentials {
    email: string;
    password: string;
}

// Authentication response interface
export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: "user" | "admin";
    };
    message: string;
}

// Error response interface
export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}

// Authentication context type
export interface AuthContextType {
    user: UserPayload | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    clearError: () => void;
}

// Cookie options interface
export interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
    path: string;
}