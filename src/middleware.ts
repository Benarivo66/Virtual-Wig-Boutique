import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/app/lib/jwt-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static assets
  const isApiRoute = pathname.startsWith("/api/");
  const isStaticRoute =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public/");

  if (isApiRoute || isStaticRoute) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth",
    "/login",
    "/register",
    "/products",
    "/cart",
  ];

  // Check if it's a product detail page (e.g., /product/123)
  const isProductDetailPage = /^\/product\/[^\/]+$/.test(pathname);
  const isPublicRoute = publicRoutes.includes(pathname) || isProductDetailPage;

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get JWT token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Verify JWT token
  const payload = await verifyTokenEdge(token);

  if (!payload) {
    console.log("Invalid token, redirecting to login");
    // Clear the invalid token
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  console.log("Token verified:", {
    userId: payload.id,
    email: payload.email,
    role: payload.role
  });

  // Protected routes that require authentication
  if (pathname.startsWith("/admin")) {
    const isAdmin = payload.role === "admin";
    console.log("Admin route check:", { isLoggedIn: true, isAdmin });

    if (!isAdmin) {
      console.log("Access denied: User is not admin");
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // User-specific routes (me, checkout) - any authenticated user can access
  if (pathname === "/me" || pathname.startsWith("/checkout")) {
    // User is already authenticated (token verified above)
    console.log("User route access granted");
  }

  // Add user info to request headers for use in components
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.id);
  response.headers.set('x-user-email', payload.email);
  response.headers.set('x-user-role', payload.role);

  return response;
}

export const config = {
  // Protect admin routes, user account, and checkout
  matcher: ['/admin/:path*', '/me', '/checkout/:path*'],
};
