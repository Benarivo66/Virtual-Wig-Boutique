import jwt from 'jsonwebtoken';
import { JWTPayload, UserPayload } from './auth-types';

// JWT secret key - in production this should be from environment variables
const JWT_SECRET = process.env.JWT_SECRET as string;

// Token expiration time (15 minutes)
const TOKEN_EXPIRATION = '15m';

/**
 * Generate a JWT token for a user
 * @param user - User data to include in the token
 * @returns JWT token string
 */
export function generateToken(user: UserPayload): string {
    try {
        const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: TOKEN_EXPIRATION,
        });
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Failed to generate authentication token');
    }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded user payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.log('JWT token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.log('Invalid JWT token');
        } else {
            console.error('JWT verification error:', error);
        }
        return null;
    }
}

/**
 * Generate a new token from a valid existing token
 * @param token - Current JWT token
 * @returns New JWT token or null if current token is invalid
 */
export function refreshToken(token: string): string | null {
    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return null;
        }

        // Create new token with same user data
        const userPayload: UserPayload = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
        };

        return generateToken(userPayload);
    } catch (error) {
        console.error('Error refreshing JWT token:', error);
        return null;
    }
}

/**
 * Extract user payload from JWT token without verification
 * Useful for getting user info from expired tokens for refresh
 * @param token - JWT token string
 * @returns User payload or null if token is malformed
 */
export function parseTokenPayload(token: string): UserPayload | null {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        if (!decoded || typeof decoded !== 'object') {
            return null;
        }

        return {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
        };
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
}