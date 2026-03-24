"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import "./AuthForm.css";

interface AuthFormProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
  returnUrl?: string;
}

export default function AuthForm({
  mode,
  onModeChange,
  returnUrl = "/",
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { login, register, isLoading } = useAuth();
  const router = useRouter();

  /**
   * Centralized redirect logic
   * - Uses returnUrl if provided
   * - Otherwise redirects based on role
   */
  const redirectUser = (user: any) => {
    const destination =
      returnUrl && returnUrl !== "/"
        ? returnUrl
        : user?.role === "admin"
          ? "/admin"
          : "/me";

    window.location.href = destination;
  };

  /**
   * Email / Password submit handler
   */
  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    if (mode === "login") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const user = await login(email, password);
        setSuccess("Login successful! Redirecting...");
        redirectUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } else {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const userData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password,
        role: "user" as const,
      };

      try {
        const user = await register(userData);
        setSuccess("Registration successful! Redirecting...");
        redirectUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
      }
    }
  };

  /**
   * Google OAuth success handler
   */
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    try {
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      if (!res.ok) throw new Error("Google login failed");

      const user = await res.json();

      setSuccess("Login successful! Redirecting...");
      redirectUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  const handleGoogleError = () => {
    setError("Google Login Failed");
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
            <label className="form-label">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            name="email"
            type="email"
            required
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-input-container">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              className="form-input password-input"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="password-input-container">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                className="form-input password-input"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner" />
              {mode === "login" ? "Signing In..." : "Creating Account..."}
            </>
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="google-auth-button">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div className="auth-footer">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
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
