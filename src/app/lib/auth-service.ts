import bcrypt from 'bcrypt';
import { UserField } from './definitions';
import { fetchUserByEmail, createUser } from './data';
import { RegisterData, AuthResponse, LoginCredentials } from './auth-types';

// Salt rounds for bcrypt hashing
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
}

/**
 * Validate a password against its hash
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns Promise resolving to boolean indicating if password is valid
 */
export async function validatePassword(password: string, hash: string): Promise<boolean> {
    try {
        const isValid = await bcrypt.compare(password, hash);
        return isValid;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
}

/**
 * Authenticate a user with email and password
 * @param email - User's email address
 * @param password - User's plain text password
 * @returns Promise resolving to user data or null if authentication fails
 */
export async function authenticateUser(email: string, password: string): Promise<UserField | null> {
    try {
        // Fetch user by email
        const user = await fetchUserByEmail(email);
        if (!user) {
            return null;
        }

        // Validate password
        const isPasswordValid = await validatePassword(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
}

/**
 * Register a new user
 * @param userData - Registration data including name, email, and password
 * @returns Promise resolving to created user data
 */
export async function registerUser(userData: RegisterData): Promise<UserField> {
    try {
        // Check if user already exists
        const existingUser = await fetchUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the password
        const hashedPassword = await hashPassword(userData.password);

        // Create user with hashed password
        const newUser = await createUser({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: 'user' as const, // Default role is 'user'
        });

        return newUser;
    } catch (error) {
        console.error('Error registering user:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to register user');
    }
}

/**
 * Validate registration data
 * @param userData - Registration data to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateRegistrationData(userData: RegisterData): string[] {
    const errors: string[] = [];

    // Validate name
    if (!userData.name || userData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email)) {
        errors.push('Please provide a valid email address');
    }

    // Validate password
    if (!userData.password || userData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    return errors;
}

/**
 * Validate login credentials
 * @param credentials - Login credentials to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateLoginCredentials(credentials: LoginCredentials): string[] {
    const errors: string[] = [];

    // Validate email
    if (!credentials.email || !credentials.email.trim()) {
        errors.push('Email is required');
    }

    // Validate password
    if (!credentials.password || !credentials.password.trim()) {
        errors.push('Password is required');
    }

    return errors;
}

/**
 * Create authentication response object
 * @param user - User data
 * @param message - Response message
 * @returns Authentication response object
 */
export function createAuthResponse(user: UserField, message: string): AuthResponse {
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        message,
    };
}