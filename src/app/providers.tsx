'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider, ToastProvider } from "./lib/contexts";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <ToastProvider position="top-right">
                <CartProvider>
                    {children}
                </CartProvider>
            </ToastProvider>
        </SessionProvider>
    );
}