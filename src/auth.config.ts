// import type { NextAuthConfig } from "next-auth";

// export const authConfig = {
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       console.log({auth});
//       const isLoggedIn = !!auth?.user;
//       const isOnProfile = nextUrl.pathname.startsWith("/profile");
//       if (isOnProfile) {
//         if (isLoggedIn) return true;
//         return false; // Redirect unauthenticated users to login page
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL("/products", nextUrl));
//       }
//       return true;
//     },
//     async session({ session, token, user }) {
//       // Attach user id and role to session if available
//       if (user && user.id) {
//         session.user = session.user || {};
//         session.user.id = user.id;
//         // @ts-expect-error: custom property
//         session.user.role = (user as any).role;
//       } else if (token && token.sub) {
//         session.user = session.user || {};
//         session.user.id = token.sub;
//         // @ts-expect-error: custom property
//         session.user.role = (token as any).role;
//       }
//       return session;
//     },
//   },
//   providers: [], // Add providers with an empty array for now
// } satisfies NextAuthConfig;

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Allow public access to product list and product detail pages
      const publicRoutes = [
        '/dashboard/products',
      ];

      const isProductDetail = /^\/dashboard\/products\/[^\/]+$/.test(pathname);
      const isPublicRoute = publicRoutes.includes(pathname) || isProductDetail;

      if (isPublicRoute) {
        return true; //  Allow public access
      }

      // All other /dashboard routes require login
      const isProtectedDashboardRoute = pathname.startsWith('/dashboard');
      if (isProtectedDashboardRoute) {
        return isLoggedIn;
      }

      return true; // Allow everything else (e.g., '/', '/login', etc.)
    },
  },
  providers: [],
} satisfies NextAuthConfig;


