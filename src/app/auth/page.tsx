"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "../ui/AuthForm/AuthForm";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/";

    // Check if there's a preferred mode in URL params
    useEffect(() => {
        const modeParam = searchParams.get("mode");
        if (modeParam === "register") {
            setMode("register");
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to Virtual Wig Boutique
                    </h1>
                    <p className="text-gray-600">
                        {mode === "login"
                            ? "Sign in to access your account and continue shopping"
                            : "Create an account to start your wig shopping journey"
                        }
                    </p>
                </div>

                <AuthForm
                    mode={mode}
                    onModeChange={setMode}
                    returnUrl={returnUrl}
                />
            </div>
        </div>
    );
}