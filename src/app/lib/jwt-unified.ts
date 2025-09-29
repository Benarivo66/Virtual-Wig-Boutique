// Unified JWT functions that work in both Node.js and Edge Runtime
import { JWTPayload, UserPayload } from "./auth-types"

/**
 * Generate a JWT token for a user
 * Works in both Node.js and Edge Runtime
 */
export async function generateToken(user: UserPayload): Promise<string> {
  const { generateToken: generateTokenNode } = await import("./jwt")
  return generateTokenNode(user)
}

/**
 * Verify and decode a JWT token
 * Works in both Node.js and Edge Runtime
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  const { verifyToken: verifyTokenNode } = await import("./jwt")
  return verifyTokenNode(token)
}

/**
 * Generate a new token from a valid existing token
 * Works in both Node.js and Edge Runtime
 */
export async function refreshToken(token: string): Promise<string | null> {
  const { refreshToken: refreshTokenNode } = await import("./jwt")
  return refreshTokenNode(token)
}

/**
 * Extract user payload from JWT token without verification
 * Works in both Node.js and Edge Runtime
 */
export async function parseTokenPayload(
  token: string
): Promise<UserPayload | null> {
  const { parseTokenPayload: parseTokenPayloadNode } = await import("./jwt")
  return parseTokenPayloadNode(token)
}
