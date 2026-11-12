"use client";

import { useAuth } from "./useAuth";
import { EMPTY_NAME, STORAGE_KEYS, useLocalStorage } from "./storage";

export function nameFromEmail(email: string) {
  const username = email.split("@")[0];
  return (
    username
      .replace(/[._-]+/g, " ")
      .replace(/\d+/g, "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Student"
  );
}

// Display name: a name saved in Settings, otherwise the name given at sign-up,
// otherwise one derived from the email.
export function useDisplayName() {
  const { user } = useAuth();
  const [saved, setSaved] = useLocalStorage<string>(STORAGE_KEYS.displayName, EMPTY_NAME);
  const name = saved || user?.name || (user ? nameFromEmail(user.email) : "Student");
  return [name, setSaved] as const;
}
