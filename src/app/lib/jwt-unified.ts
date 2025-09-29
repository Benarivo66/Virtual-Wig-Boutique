// Unified JWT functions that work in both Node.js and Edge Runtime
import { JWTPayload, UserPayload } from './auth-types';

// Check if we're in Edge Runtime
const isEdgeRuntime = typeof EdgeRuntime !== 'undefined';

/**
 * Generate a JWT token for a user
 * Works in both Node.js and Edge Runtime
 */
export async function generateToken(user: UserPayload): Promise<string> {
    if (isEdgeRuntime) {
        const { generateTokenEdge } = await import('./jwt-edge');
        return generateTokenEdge(user);
    } else {
        const { generateToken: generateTokenNode } = await import('./jwt');
        return generateTokenNode(user);
    }
}

/**
 * Verify and decode a JWT token
 * Works in both Node.js and Edge Runtime
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    if (isEdgeRuntime) {
        const { verifyTokenEdge } = await import('./jwt-edge');
        return verifyTokenEdge(token);
    } else {
        const { verifyToken: verifyTokenNode } = await import('./jwt');
        return verifyTokenNode(token);
    }
}

/**
 * Generate a new token from a valid existing token
 * Works in both Node.js and Edge Runtime
 */
export async function refreshToken(token: string): Promise<string | null> {
    if (isEdgeRuntime) {
        const { refreshTokenEdge } = await import('./jwt-edge');
        return refreshTokenEdge(token);
    } else {
        const { refreshToken: refreshTokenNode } = await import('./jwt');
        return refreshTokenNode(token);
    }
}

/**
 * Extract user payload from JWT token without verification
 * Works in both Node.js and Edge Runtime
 */
export function parseTokenPayload(token: string): UserPayload | null {
    if (isEdgeRuntime) {
        const { parseTokenPayloadEdge } = require('./jwt-edge');
        return parseTokenPayloadEdge(token);
    } else {
        const { parseTokenPayload: parseTokenPayloadNode } = require('./jwt');
        return parseTokenPayloadNode(token);
    }
}