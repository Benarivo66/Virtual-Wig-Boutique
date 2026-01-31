"use server"

import { cookies } from "next/headers"
import { verifyToken } from "@/app/lib/jwt"
import type { JWTPayload } from "@/app/lib/auth-types"


export async function requireAuth(): Promise<JWTPayload> {
  const token =  (await cookies()).get("auth-token")?.value

  if (!token) {
    throw new Error("Unauthorized: No token")
  }

  const payload = verifyToken(token)

  if (!payload) {
    throw new Error("Unauthorized: Invalid or expired token")
  }

   if (payload.role !== "admin") {
    throw new Error("Forbidden: Admins only")
  }
  console.log({payload})
  return payload

}

