// TEMPORARY, INSECURE front-end-only auth. There is no server or user database:
// only the accounts listed below can sign in (visible to anyone who views the
// page source), and a fake session is kept in localStorage.
// Replace with a real auth provider before shipping.

const TEMP_ACCOUNTS = [{ email: "hamzaazmat718@gmail.com", password: "Test@123" }];

const SESSION_KEY = "dentalhub_temp_session_v1";
export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Listener = (email: string | null) => void;
const listeners = new Set<Listener>();

export function validateCredentials(email: string, password: string): string | null {
  if (!email.trim() || !password) return "Please enter your email and password.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Please enter a valid email address.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

function writeSession(email: string | null) {
  try {
    if (email) localStorage.setItem(SESSION_KEY, email);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable: session lasts until refresh */
  }
  listeners.forEach((fn) => fn(email));
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ email: string | null; error: string | null }> {
  const error = validateCredentials(email, password);
  if (error) return { email: null, error };

  const normalized = email.trim().toLowerCase();
  const account = TEMP_ACCOUNTS.find((a) => a.email === normalized);

  if (!account) return { email: null, error: "Email not registered." };
  if (account.password !== password) return { email: null, error: "Incorrect password." };

  writeSession(normalized);
  return { email: normalized, error: null };
}

export async function getSessionEmail(): Promise<string | null> {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    // Ignore sessions left over from earlier versions for unregistered emails.
    return TEMP_ACCOUNTS.some((a) => a.email === stored) ? stored : null;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  writeSession(null);
}

// Calls back with the current email (or null) on every auth change.
export function onAuthChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
