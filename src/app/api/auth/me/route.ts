import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { ErrorResponse } from '@/app/lib/auth-types';

export async function GET(request: NextRequest) {
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

        // Verify and decode token
        const payload = verifyToken(token);
        if (!payload) {
            const errorResponse: ErrorResponse = {
                error: 'Unauthorized',
                message: 'Invalid or expired authentication token',
                statusCode: 401,
            };
            return NextResponse.json(errorResponse, { status: 401 });
        }

        // Return user information from token
        const userResponse = {
            user: {
                id: payload.id,
                email: payload.email,
                name: payload.name,
                role: payload.role,
            },
            message: 'User information retrieved successfully',
        };

        return NextResponse.json(userResponse, { status: 200 });

    } catch (error) {
        console.error('Get user info error:', error);
        const errorResponse: ErrorResponse = {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while retrieving user information',
            statusCode: 500,
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}