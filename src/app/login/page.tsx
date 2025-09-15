import type { Metadata } from "next";
import LoginForm from "@/app/ui/LoginForm/login-form";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Virtual Wig Boutique account.",
};

export default function LoginPage() {
  return (
    <main>
        <Suspense>
          <LoginForm />
        </Suspense>
    </main>
  );
}