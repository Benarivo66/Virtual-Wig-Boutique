import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const publicRoutes = [
        '/',
        '/auth',
        '/login',
        '/register',
        '/cart'
      ];

      const isPublicRoute = publicRoutes.includes(pathname);

      if (isPublicRoute) {
        return true;
      }

      // Protected routes that require authentication
      if (pathname.startsWith('/admin') || pathname === '/me') {
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;



