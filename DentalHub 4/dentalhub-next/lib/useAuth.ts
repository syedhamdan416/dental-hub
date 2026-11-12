"use client";

import { useEffect, useState } from "react";
import { getSessionEmail, onAuthChange, signOut } from "./auth";

// Tracks the signed-in email from the temporary local auth.
export function useAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getSessionEmail().then((current) => {
      if (!active) return;
      setEmail(current);
      setLoading(false);
    });

    const unsubscribe = onAuthChange(setEmail);

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user: email ? { email } : null, loading, signOut };
}
