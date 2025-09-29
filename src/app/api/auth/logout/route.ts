import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Create response
        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        // Clear the authentication cookie
        response.cookies.set('auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: 'An unexpected error occurred during logout',
                statusCode: 500
            },
            { status: 500 }
        );
    }
}