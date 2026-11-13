import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabase";

export const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type AuthUser = { email: string; name: string | null };

// Which input an error belongs to, so the UI can show it inline.
export type ErrorField = "fullName" | "email" | "password" | "confirm" | "form";
export type AuthResult = { error: string | null; field?: ErrorField };
export type FieldErrors = Partial<Record<ErrorField, string>>;

const NOT_CONFIGURED =
  "Sign-in is not set up yet. Add your Supabase URL and publishable key to .env.local.";

function toUser(session: Session | null): AuthUser | null {
  if (!session?.user.email) return null;
  const name = session.user.user_metadata?.full_name;
  return { email: session.user.email, name: typeof name === "string" && name ? name : null };
}

function failure(error: string, field: ErrorField = "form"): { error: string; field: ErrorField } {
  return { error, field };
}

function mapError(error: { message: string; code?: string }) {
  const m = error.message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return failure("Incorrect email or password.", "password");
  }
  if (m.includes("email not confirmed")) {
    return failure("Please confirm your email first. Check your inbox for the confirmation link.", "email");
  }
  if (error.code === "over_email_send_rate_limit" || m.includes("email rate limit")) {
    return failure("Too many emails have been sent recently. Please wait a while before trying again.");
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return failure("Too many attempts. Please wait a minute and try again.");
  }
  if (m.includes("same password") || m.includes("different from the old")) {
    return failure("Choose a password different from your current one.", "password");
  }
  if (error.code === "weak_password" || m.includes("password")) {
    return failure(error.message, "password");
  }
  return failure(error.message);
}

// ---------- Validation ----------

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Please enter a valid email address.";
  return null;
}

// Mirrors the Supabase "Password requirements" setting (lowercase, uppercase,
// digits and symbols, minimum length). Keep the two in sync.
export function passwordChecks(password: string) {
  return [
    { label: `At least ${MIN_PASSWORD_LENGTH} characters`, met: password.length >= MIN_PASSWORD_LENGTH },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One symbol (e.g. ! @ # $)", met: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function validateNewPassword(password: string): string | null {
  if (!password) return "Please enter a password.";
  return passwordChecks(password).every((c) => c.met)
    ? null
    : "Password doesn't meet all the requirements.";
}

export function validateSignIn(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = "Please enter your password.";
  return errors;
}

export function validateSignUp(
  fullName: string,
  email: string,
  password: string,
  confirm: string,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!fullName.trim()) errors.fullName = "Please enter your full name.";
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  const passwordError = validateNewPassword(password);
  if (passwordError) errors.password = passwordError;
  if (!confirm) errors.confirm = "Please confirm your password.";
  else if (password !== confirm) errors.confirm = "Passwords do not match.";
  return errors;
}

export function validateReset(password: string, confirm: string): FieldErrors {
  const errors: FieldErrors = {};
  const passwordError = validateNewPassword(password);
  if (passwordError) errors.password = passwordError;
  if (!confirm) errors.confirm = "Please confirm your new password.";
  else if (password !== confirm) errors.confirm = "Passwords do not match.";
  return errors;
}

// ---------- Actions ----------

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return failure(NOT_CONFIGURED);

  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  return error ? mapError(error) : { error: null };
}

export async function signUp(
  fullName: string,
  email: string,
  password: string,
): Promise<AuthResult & { needsConfirmation: boolean }> {
  if (!supabase) return { ...failure(NOT_CONFIGURED), needsConfirmation: false };

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: fullName.trim() },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) return { ...mapError(error), needsConfirmation: false };

  // With email confirmation on, an existing address returns a user with no identities.
  if (data.user && data.user.identities?.length === 0) {
    return {
      ...failure("An account with this email already exists. Try signing in instead.", "email"),
      needsConfirmation: false,
    };
  }

  return { error: null, needsConfirmation: !data.session };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!supabase) return failure(NOT_CONFIGURED);

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return error ? mapError(error) : { error: null };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!supabase) return failure(NOT_CONFIGURED);

  const { error } = await supabase.auth.updateUser({ password });
  return error ? mapError(error) : { error: null };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return toUser(data.session);
}

// Signs out this device. The local session is cleared first, so the UI updates
// immediately even if revoking the token on the server is slow.
export async function signOut(): Promise<void> {
  if (!supabase) return;
  const request = supabase.auth.signOut({ scope: "local" }).catch(() => {});
  await Promise.race([request, new Promise((resolve) => setTimeout(resolve, 1500))]);
}

// Calls back on sign-in, sign-out and token refresh. `recovery` is true when
// the user arrived from a password-reset email link.
export function onAuthChange(fn: (user: AuthUser | null, recovery: boolean) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    fn(toUser(session), event === "PASSWORD_RECOVERY");
  });
  return () => data.subscription.unsubscribe();
}

export { isSupabaseConfigured };
