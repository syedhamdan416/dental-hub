"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth";
import DashboardShell from "./DashboardShell";
import ToastProvider from "./ToastProvider";

// Wraps every signed-in page: redirects to /login when there is no session.
export default function AppFrame({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <ToastProvider>
      <DashboardShell>{children}</DashboardShell>
    </ToastProvider>
  );
}
