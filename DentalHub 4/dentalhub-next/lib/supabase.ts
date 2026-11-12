import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

// Publishable (or legacy anon) keys are safe in the browser. A secret key
// must never be exposed here, so it is rejected outright.
const looksLikeSecret = Boolean(supabaseKey?.startsWith("sb_secret_"));

export const isSupabaseConfigured =
  isValidHttpUrl(supabaseUrl) &&
  Boolean(supabaseKey) &&
  !looksLikeSecret &&
  supabaseKey !== "PASTE_PUBLISHABLE_KEY_HERE";

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseKey as string)
  : null;

// Captured at import time, before Supabase processes and clears the URL hash:
// true when the visitor landed here from a password-reset email link.
export const openedFromRecoveryLink =
  typeof window !== "undefined" && /type=recovery/.test(window.location.hash);
