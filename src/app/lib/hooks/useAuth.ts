import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { AuthContextType, UserPayload } from '../auth-types';
import { useEffect, useCallback } from 'react';

/**
 * Custom hook for accessing authentication functionality
 * Provides access to user state, authentication methods, and loading states
 */
export function useAuth(): AuthContextType {
    return useAuthContext();
}

/**
 * Helper hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
    const { user } = useAuth();
    return user !== null;
}

/**
 * Helper hook to check if user has admin role
 */
export function useIsAdmin(): boolean {
    const { user } = useAuth();
    return user?.role === 'admin';
}

/**
 * Helper hook to get current user information
 */
export function useCurrentUser() {
    const { user, isLoading, error } = useAuth();
    return { user, isLoading, error };
}

/**
 * Helper hook to get user display name
 */
export function useUserDisplayName(): string {
    const { user } = useAuth();
    return user?.name || 'Guest';
}

/**
 * Helper hook for authentication state with automatic error clearing
 */
export function useAuthState() {
    const { user, isLoading, error, clearError } = useAuth();

    // Auto-clear errors after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    return {
        user,
        isLoading,
        error,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'admin',
        clearError
    };
}

/**
 * Helper hook for protected route logic
 */
export function useRequireAuth(redirectTo?: string) {
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user && redirectTo) {
            // In a real app, you'd use router.push here
            // For now, we'll just log the intended redirect
            console.log(`User not authenticated, should redirect to: ${redirectTo}`);
        }
    }, [user, isLoading, redirectTo]);

    return {
        user,
        isLoading,
        isAuthenticated: user !== null
    };
}

/**
 * Helper hook for admin-only functionality
 */
export function useRequireAdmin() {
    const { user, isLoading } = useAuth();
    const isAdmin = user?.role === 'admin';

    return {
        user,
        isLoading,
        isAdmin,
        canAccess: !isLoading && isAdmin
    };
}

/**
 * Hook for handling authentication-dependent cart functionality
 */
export function useAuthenticatedCart() {
    const { user, isLoading } = useAuth();

    const getUserCartKey = useCallback(() => {
        return user ? `cart_${user.id}` : 'cart';
    }, [user]);

    const isCartReady = !isLoading;

    return {
        user,
        isLoading,
        isCartReady,
        getUserCartKey,
        isAuthenticated: user !== null
    };
}