import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Protect admin routes, user account, and checkout
  matcher: ['/admin/:path*', '/me', '/checkout/:path*'],
};
