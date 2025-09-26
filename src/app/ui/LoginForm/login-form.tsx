"use client";

import { useState } from "react";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./login-form.module.css";
import Link from "next/link";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const { login, isLoading, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const loggedInUser = await login(email, password);

      // Redirect based on user role if no specific callback URL
      if (!searchParams.get("callbackUrl")) {
        const redirectUrl = loggedInUser.role === 'admin' ? '/admin' : '/me';
        router.push(redirectUrl);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <h1 className={styles.formTitle}>Please log in to continue.</h1>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <div>
            <input
              className={styles.input}
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <div>
            <input
              className={styles.input}
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
        </div>
        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        <div className={styles.error} aria-live="polite" aria-atomic="true">
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <Link className={styles.registerPageLink} href={"/register"}>
          Go To Register Page
        </Link>
      </div>
    </form>
  );
}
