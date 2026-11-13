"use client";

import { useRouter } from "next/navigation";
import ResetPasswordScreen from "../../components/ResetPasswordScreen";
import { openedFromRecoveryLink } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";

export default function ResetPasswordPage() {
  const { user, loading, recovery } = useAuth();
  const router = useRouter();

  if (loading) return null;

  return (
    <ResetPasswordScreen
      hasRecoverySession={Boolean(user) && (recovery || openedFromRecoveryLink)}
      onDone={() => router.replace("/dashboard")}
    />
  );
}
