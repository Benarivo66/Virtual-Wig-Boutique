// import type { NextAuthConfig } from 'next-auth';

// export const authConfig = {
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const pathname = nextUrl.pathname;

//       // Allow public access to product list and product detail pages
//       const publicRoutes = [
//         '/dashboard/products',
//       ];

//       const isProductDetail = /^\/dashboard\/products\/[^\/]+$/.test(pathname);
//       const isPublicRoute = publicRoutes.includes(pathname) || isProductDetail;

//       if (isPublicRoute) {
//         return true; //  Allow public access
//       }

//       // All other /dashboard routes require login
//       const isProtectedDashboardRoute = pathname.startsWith('/dashboard');
//       if (isProtectedDashboardRoute) {
//         return isLoggedIn;
//       }

//       return true; // Allow everything else (e.g., '/', '/login', etc.)
//     },
//   },
//   providers: [],
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

      const publicRoutes = [
        '/',
      ];

      const isPublicRoute = publicRoutes.includes(pathname);

      if (isPublicRoute) {
        return true; 
      }

     return isLoggedIn; 
    },
  },
  providers: [],
} satisfies NextAuthConfig;



