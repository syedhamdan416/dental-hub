"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { signIn, validateSignIn, type FieldErrors } from "../lib/auth";
import AuthShell from "./AuthShell";
import { FormMessage, PasswordField, TextField } from "./AuthFields";

export default function LoginScreen({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function clear(field: keyof FieldErrors) {
    setErrors((prev) => (prev[field] || prev.form ? { ...prev, [field]: undefined, form: undefined } : prev));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateSignIn(email, password);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.error) {
      setErrors({ [result.field ?? "form"]: result.error });
      return;
    }
    onLogin?.();
  }

  return (
    <AuthShell
      eyebrow="WELCOME TO DENTALHUB"
      title={
        <>
          Good to have you
          <br /> <span>back.</span>
        </>
      }
      description="Sign in to pick up where your learning left off."
    >
      <form id="loginForm" onSubmit={handleSubmit} noValidate>
        <TextField
          id="email"
          label="Email address"
          icon="mail"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(v) => {
            setEmail(v);
            clear("email");
          }}
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(v) => {
            setPassword(v);
            clear("password");
          }}
          extra={
            <Link className="auth-link" href="/forgot-password">
              Forgot password?
            </Link>
          }
        />

        <div className="form-options"></div>

        <button className="primary-button login-button" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Enter your workspace"} <span>↗</span>
        </button>

        {errors.form && <FormMessage kind="error">{errors.form}</FormMessage>}
      </form>

      <p className="auth-switch">
        New to DentalHub? <Link href="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
