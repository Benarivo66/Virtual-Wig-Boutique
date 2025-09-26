import { JWTPayload, UserPayload } from './auth-types';

// JWT secret key - in production this should be from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Token expiration time (15 minutes in seconds)
const TOKEN_EXPIRATION = 15 * 60; // 15 minutes

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Base64 URL decode
 */
function base64UrlDecode(str: string): string {
    str += '='.repeat((4 - str.length % 4) % 4);
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}

/**
 * Create HMAC SHA256 signature using Web Crypto API
 */
async function createSignature(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Verify HMAC SHA256 signature using Web Crypto API
 */
async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    const signatureBytes = new Uint8Array(
        base64UrlDecode(signature).split('').map(c => c.charCodeAt(0))
    );

    return await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(data));
}

/**
 * Generate a JWT token for a user (Edge Runtime compatible)
 * @param user - User data to include in the token
 * @returns JWT token string
 */
export async function generateTokenEdge(user: UserPayload): Promise<string> {
    try {
        const now = Math.floor(Date.now() / 1000);

        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        const payload: JWTPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            iat: now,
            exp: now + TOKEN_EXPIRATION
        };

        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));
        const data = `${encodedHeader}.${encodedPayload}`;

        const signature = await createSignature(data, JWT_SECRET);

        return `${data}.${signature}`;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Failed to generate authentication token');
    }
}

/**
 * Verify and decode a JWT token (Edge Runtime compatible)
 * @param token - JWT token string
 * @returns Decoded user payload or null if invalid
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const [encodedHeader, encodedPayload, signature] = parts;
        const data = `${encodedHeader}.${encodedPayload}`;

        // Verify signature
        const isValid = await verifySignature(data, signature, JWT_SECRET);
        if (!isValid) {
            console.log('Invalid JWT signature');
            return null;
        }

        // Decode payload
        const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload;

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            console.log('JWT token expired');
            return null;
        }

        return payload;
    } catch (error) {
        console.error('JWT verification error:', error);
        return null;
    }
}

/**
 * Generate a new token from a valid existing token (Edge Runtime compatible)
 * @param token - Current JWT token
 * @returns New JWT token or null if current token is invalid
 */
export async function refreshTokenEdge(token: string): Promise<string | null> {
    try {
        const decoded = await verifyTokenEdge(token);
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

        return await generateTokenEdge(userPayload);
    } catch (error) {
        console.error('Error refreshing JWT token:', error);
        return null;
    }
}

/**
 * Extract user payload from JWT token without verification (Edge Runtime compatible)
 * Useful for getting user info from expired tokens for refresh
 * @param token - JWT token string
 * @returns User payload or null if token is malformed
 */
export function parseTokenPayloadEdge(token: string): UserPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const payload = JSON.parse(base64UrlDecode(parts[1])) as JWTPayload;

        return {
            id: payload.id,
            email: payload.email,
            name: payload.name,
            role: payload.role,
        };
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
}