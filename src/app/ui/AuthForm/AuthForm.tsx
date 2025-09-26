"use client"

import { useState } from "react"
import { FaEye, FaEyeSlash, FaGoogle, FaSpinner } from "react-icons/fa"
import { useAuth } from "@/app/lib/hooks/useAuth"
import { useRouter } from "next/navigation"
import "./AuthForm.css"

interface AuthFormProps {
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
  returnUrl?: string
}

export default function AuthForm({
  mode,
  onModeChange,
  returnUrl = "/",
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { login, register, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(null)

    if (mode === "login") {
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      try {
        await login(email, password)
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          router.push(returnUrl)
        }, 1000)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Login failed")
      }
    } else {
      // Handle registration
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirmPassword") as string

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      const userData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: password,
        role: "user" as const,
      }

      try {
        await register(userData)
        setSuccess("Registration successful! You are now logged in.")
        setTimeout(() => {
          router.push(returnUrl)
        }, 2000)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Registration failed")
      }
    }
  }

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
              disabled={isLoading}
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
            disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
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

        <button
          type="button"
          className="google-auth-button"
          disabled={isLoading}
        >
          <FaGoogle />
          Continue with Google
        </button>

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
  )
}
