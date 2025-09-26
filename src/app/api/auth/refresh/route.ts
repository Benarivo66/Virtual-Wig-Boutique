import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/app/lib/jwt';
import { ErrorResponse } from '@/app/lib/auth-types';

export async function POST(request: NextRequest) {
    try {
        // Get token from cookies
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            const errorResponse: ErrorResponse = {
                error: 'Unauthorized',
                message: 'No authentication token provided',
                statusCode: 401,
            };
            return NextResponse.json(errorResponse, { status: 401 });
        }

        // Verify current token
        const payload = verifyToken(token);
        if (!payload) {
            const errorResponse: ErrorResponse = {
                error: 'Unauthorized',
                message: 'Invalid or expired authentication token',
                statusCode: 401,
            };
            return NextResponse.json(errorResponse, { status: 401 });
        }

        // Generate new token with same user data
        const newToken = generateToken({
            id: payload.id,
            email: payload.email,
            name: payload.name,
            role: payload.role,
        });

        // Create response
        const response = NextResponse.json(
            {
                message: 'Token refreshed successfully',
                user: {
                    id: payload.id,
                    email: payload.email,
                    name: payload.name,
                    role: payload.role,
                }
            },
            { status: 200 }
        );

        // Set new JWT token in HTTP-only cookie
        response.cookies.set('auth-token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes in seconds
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Token refresh error:', error);
        const errorResponse: ErrorResponse = {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while refreshing token',
            statusCode: 500,
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}