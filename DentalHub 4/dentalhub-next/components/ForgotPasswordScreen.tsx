"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { requestPasswordReset, validateEmail, type FieldErrors } from "../lib/auth";
import AuthShell from "./AuthShell";
import { FormMessage, TextField } from "./AuthFields";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    setErrors({});

    setSubmitting(true);
    const result = await requestPasswordReset(email);
    setSubmitting(false);

    if (result.error) {
      setErrors({ [result.field ?? "form"]: result.error });
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      eyebrow="ACCOUNT RECOVERY"
      title={
        <>
          Forgot your <span>password?</span>
        </>
      }
      description="Enter your email and we'll send you a link to choose a new one."
    >
      {sent ? (
        <>
          <FormMessage kind="success">
            If an account exists for {email.trim()}, a reset link is on its way. Check your inbox
            and spam folder.
          </FormMessage>
          <p className="auth-switch">
            <Link href="/login">Back to sign in</Link>
          </p>
        </>
      ) : (
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
              if (errors.email || errors.form) setErrors({});
            }}
          />

          <div className="form-options"></div>

          <button className="primary-button login-button" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send reset link"} <span>↗</span>
          </button>

          {errors.form && <FormMessage kind="error">{errors.form}</FormMessage>}

          <p className="auth-switch">
            Remembered it? <Link href="/login">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
