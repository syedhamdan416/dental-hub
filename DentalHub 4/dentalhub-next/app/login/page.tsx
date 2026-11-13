"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginScreen from "../../components/LoginScreen";
import { useAuth } from "../../lib/useAuth";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  if (loading || user) return null;

  return <LoginScreen onLogin={() => router.replace("/dashboard")} />;
}
