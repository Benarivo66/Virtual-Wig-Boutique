'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContextType, UserPayload, RegisterData } from '../auth-types';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    // Check for existing authentication on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Set up automatic token refresh
    useEffect(() => {
        if (user) {
            // Set up token refresh interval (every 14 minutes for 15-minute tokens)
            const refreshInterval = setInterval(() => {
                refreshAuth();
            }, 14 * 60 * 1000);

            return () => clearInterval(refreshInterval);
        }
    }, [user]);

    const checkAuthStatus = useCallback(async () => {
        try {
            setError(null);
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
                // Don't show error for initial auth check
                if (!isLoading) {
                    setError('Session expired. Please log in again.');
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            if (!isLoading) {
                setError('Unable to verify authentication status');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const login = useCallback(async (email: string, password: string): Promise<UserPayload> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                showToast('success', 'Login successful!');
                // Clear any existing cart data that might be from a different user
                // This ensures cart state is properly managed per user
                return data.user;
            } else {
                const errorMessage = data.message || 'Login failed';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            showToast('error', 'Login failed', errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const register = useCallback(async (userData: RegisterData): Promise<UserPayload> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                showToast('success', 'Registration successful!', 'Welcome to Virtual Wig Boutique!');
                return data.user;
            } else {
                const errorMessage = data.message || 'Registration failed';
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setError(errorMessage);
            showToast('error', 'Registration failed', errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const logout = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            // Always clear local state regardless of server response
            setUser(null);

            // Clear cart data on logout to prevent data leakage between users
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cart');
            }

            if (response.ok) {
                showToast('success', 'Logged out successfully');
            } else {
                showToast('info', 'Logged out');
            }
        } catch (error) {
            // Clear local state even if server request fails
            setUser(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cart');
            }
            showToast('info', 'Logged out');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const refreshAuth = useCallback(async (): Promise<void> => {
        try {
            setError(null);
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // If refresh fails, user needs to log in again
                setUser(null);
                setError('Session expired. Please log in again.');
                showToast('warning', 'Session expired', 'Please log in again.');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            setUser(null);
            setError('Unable to refresh session');
        }
    }, [showToast]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshAuth,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}