"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, onAuthChange, signOut, type AuthUser } from "./auth";

// Tracks the signed-in Supabase user (null when signed out).
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentUser().then((current) => {
      if (!active) return;
      setUser(current);
      setLoading(false);
    });

    const unsubscribe = onAuthChange((next, isRecovery) => {
      setUser(next);
      if (isRecovery) setRecovery(true);
      setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user, loading, recovery, signOut };
}
