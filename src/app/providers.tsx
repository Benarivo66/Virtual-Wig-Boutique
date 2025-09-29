'use client';

import { CartProvider, ToastProvider, AuthProvider } from "./lib/contexts";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ToastProvider position="top-right">
            <AuthProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </AuthProvider>
        </ToastProvider>
    );
}