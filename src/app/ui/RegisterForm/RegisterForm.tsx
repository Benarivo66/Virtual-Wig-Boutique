"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import styles from "./RegisterForm.module.css";
import Link from "next/link";

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: (formData.get("role") as "user" | "admin") || "user",
    };

    try {
      await register(userData);
      setMessage("Registration successful! You are now logged in.");
      // Redirect after successful registration
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        // Try to parse error message for field-specific errors
        if (error.message.includes("email")) {
          setErrors({ email: error.message });
        } else if (error.message.includes("password")) {
          setErrors({ password: error.message });
        } else if (error.message.includes("name")) {
          setErrors({ name: error.message });
        } else {
          setMessage(error.message);
        }
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formTitle}>Register</h2>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className={styles.input}
          disabled={isLoading}
        />
        {errors.email && (
          <p className={styles.error}>{errors.email}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className={styles.input}
          disabled={isLoading}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          name="name"
          type="text"
          required
          className={styles.input}
          disabled={isLoading}
        />
        {errors.name && (
          <p className={styles.error}>{errors.name}</p>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="role" className={styles.label}>
          Role
        </label>
        <select
          name="role"
          required
          className={styles.select}
          disabled={isLoading}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className={styles.error}>{errors.role}</p>
        )}
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
      {message && (
        <p className={message.includes("successful") ? styles.success : styles.error}>
          {message}
        </p>
      )}

      <Link className={styles.loginPageLink} href={"/login"}>
        Go To Login Page
      </Link>
    </form>
  );
}
