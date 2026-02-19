"use client";

import LoginForm from "./_components/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If a token cookie already exists, redirect to dashboard
    if (typeof document !== "undefined") {
      const hasToken = document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("token="));

      if (hasToken) {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  return <LoginForm />;
}
