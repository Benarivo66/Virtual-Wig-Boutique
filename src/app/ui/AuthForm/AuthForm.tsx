"use client";

import { useState, useTransition } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaSpinner } from "react-icons/fa";
import { authenticate } from "@/app/lib/actions";
import { createUser } from "@/app/lib/actions";
import "./AuthForm.css";

interface AuthFormProps {
    mode: "login" | "register";
    onModeChange: (mode: "login" | "register") => void;
    returnUrl?: string;
}

export default function AuthForm({ mode, onModeChange, returnUrl = "/" }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            if (mode === "login") {
                // Add return URL to form data
                formData.append("redirectTo", returnUrl);
                const result = await authenticate(undefined, formData);
                if (result) {
                    setError(result);
                }
            } else {
                // Handle registration
                const password = formData.get("password") as string;
                const confirmPassword = formData.get("confirmPassword") as string;

                if (password !== confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }

                const result = await createUser(undefined, formData);
                if (result.errors && Object.keys(result.errors).length > 0) {
                    const firstError = Object.values(result.errors)[0];
                    setError(Array.isArray(firstError) ? firstError[0] : firstError);
                } else if (result.message) {
                    if (result.message.includes("successfully")) {
                        setSuccess(result.message);
                        // Switch to login mode after successful registration
                        setTimeout(() => {
                            onModeChange("login");
                            setSuccess(null);
                        }, 2000);
                    } else {
                        setError(result.message);
                    }
                }
            }
        });
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-tabs">
                <button
                    type="button"
                    className={`auth-tab ${mode === "login" ? "active" : ""}`}
                    onClick={() => onModeChange("login")}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    className={`auth-tab ${mode === "register" ? "active" : ""}`}
                    onClick={() => onModeChange("register")}
                >
                    Sign Up
                </button>
            </div>

            <form action={handleSubmit} className="auth-form">
                {mode === "register" && (
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="form-input"
                            placeholder="Enter your full name"
                            disabled={isPending}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="form-input"
                        placeholder="Enter your email"
                        disabled={isPending}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="form-input password-input"
                            placeholder="Enter your password"
                            minLength={6}
                            disabled={isPending}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {mode === "register" && (
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>
                        <div className="password-input-container">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="form-input password-input"
                                placeholder="Confirm your password"
                                minLength={6}
                                disabled={isPending}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message" role="alert">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    className="auth-submit-button"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <FaSpinner className="spinner" />
                            {mode === "login" ? "Signing In..." : "Creating Account..."}
                        </>
                    ) : (
                        mode === "login" ? "Sign In" : "Create Account"
                    )}
                </button>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <button
                    type="button"
                    className="google-auth-button"
                    disabled={isPending}
                >
                    <FaGoogle />
                    Continue with Google
                </button>

                <div className="auth-footer">
                    {mode === "login" ? (
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="auth-link"
                                onClick={() => onModeChange("register")}
                            >
                                Sign up here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="auth-link"
                                onClick={() => onModeChange("login")}
                            >
                                Sign in here
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}