import { NextRequest, NextResponse } from 'next/server';
import { registerUser, validateRegistrationData, createAuthResponse } from '@/app/lib/auth-service';
import { generateToken } from '@/app/lib/jwt';
import { RegisterData, ErrorResponse } from '@/app/lib/auth-types';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body: RegisterData = await request.json();

        // Validate input data
        const validationErrors = validateRegistrationData(body);
        if (validationErrors.length > 0) {
            const errorResponse: ErrorResponse = {
                error: 'Validation Error',
                message: validationErrors.join(', '),
                statusCode: 400,
            };
            return NextResponse.json(errorResponse, { status: 400 });
        }

        // Register user
        const user = await registerUser(body);

        // Generate JWT token for automatic login
        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        // Create response
        const authResponse = createAuthResponse(user, 'Registration successful');

        // Create response with HTTP-only cookie
        const response = NextResponse.json(authResponse, { status: 201 });

        // Set JWT token in HTTP-only cookie for automatic login
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes in seconds
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);

        // Handle specific error cases
        if (error instanceof Error) {
            if (error.message === 'User with this email already exists') {
                const errorResponse: ErrorResponse = {
                    error: 'User Already Exists',
                    message: 'An account with this email address already exists',
                    statusCode: 409,
                };
                return NextResponse.json(errorResponse, { status: 409 });
            }
        }

        const errorResponse: ErrorResponse = {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred during registration',
            statusCode: 500,
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}