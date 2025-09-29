import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, validateLoginCredentials, createAuthResponse } from '@/app/lib/auth-service';
import { generateToken } from '@/app/lib/jwt';
import { LoginCredentials, ErrorResponse } from '@/app/lib/auth-types';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body: LoginCredentials = await request.json();

        // Validate input data
        const validationErrors = validateLoginCredentials(body);
        if (validationErrors.length > 0) {
            const errorResponse: ErrorResponse = {
                error: 'Validation Error',
                message: validationErrors.join(', '),
                statusCode: 400,
            };
            return NextResponse.json(errorResponse, { status: 400 });
        }

        // Authenticate user
        const user = await authenticateUser(body.email, body.password);
        if (!user) {
            const errorResponse: ErrorResponse = {
                error: 'Authentication Failed',
                message: 'Invalid email or password',
                statusCode: 401,
            };
            return NextResponse.json(errorResponse, { status: 401 });
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        // Create response
        const authResponse = createAuthResponse(user, 'Login successful');

        // Create response with HTTP-only cookie
        const response = NextResponse.json(authResponse, { status: 200 });

        // Set JWT token in HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes in seconds
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        const errorResponse: ErrorResponse = {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred during login',
            statusCode: 500,
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}