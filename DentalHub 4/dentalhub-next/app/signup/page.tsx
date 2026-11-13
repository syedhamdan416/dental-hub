"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SignupScreen from "../../components/SignupScreen";
import { useAuth } from "../../lib/useAuth";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  if (loading || user) return null;

  return <SignupScreen onSignedUp={() => router.replace("/dashboard")} />;
}
