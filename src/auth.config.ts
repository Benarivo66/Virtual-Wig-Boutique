import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      const publicRoutes = [
        "/",
        "/auth",
        "/login",
        "/register",
        "/products",
        "/product/[id]",
        "/cart",
      ]

      // Allow product detail pages and other dynamic routes for guest browsing
      const isApiRoute = pathname.startsWith("/api/")
      const isStaticRoute =
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/images/") ||
        pathname.startsWith("/favicon")

      const isPublicRoute = publicRoutes.includes(pathname)

      if (isPublicRoute || isApiRoute || isStaticRoute) {
        return true
      }

      // Protected routes that require authentication
      if (
        pathname.startsWith("/admin") ||
        pathname === "/me" ||
        pathname.startsWith("/checkout")
      ) {
        return isLoggedIn
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
