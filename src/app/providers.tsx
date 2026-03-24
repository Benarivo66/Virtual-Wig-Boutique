"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider, ToastProvider, AuthProvider } from "./lib/contexts";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ToastProvider position="top-right">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}
