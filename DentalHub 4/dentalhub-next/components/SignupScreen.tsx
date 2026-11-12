"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { signUp, validateSignUp, type FieldErrors } from "../lib/auth";
import AuthShell from "./AuthShell";
import { FormMessage, PasswordField, TextField } from "./AuthFields";

export default function SignupScreen({ onSignedUp }: { onSignedUp: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  function clear(...fields: (keyof FieldErrors)[]) {
    setErrors((prev) => {
      const next = { ...prev, form: undefined };
      fields.forEach((f) => {
        next[f] = undefined;
      });
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateSignUp(fullName, email, password, confirm);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    const result = await signUp(fullName, email, password);
    setSubmitting(false);

    if (result.error) {
      setErrors({ [result.field ?? "form"]: result.error });
      return;
    }
    if (result.needsConfirmation) {
      setConfirmationSent(true);
      return;
    }
    onSignedUp();
  }

  if (confirmationSent) {
    return (
      <AuthShell
        eyebrow="ALMOST THERE"
        title={
          <>
            Check your <span>inbox.</span>
          </>
        }
        description={`We sent a confirmation link to ${email.trim()}. Open it to activate your account, then sign in.`}
      >
        <Link className="primary-button login-button" href="/login">
          Go to sign in <span>↗</span>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="JOIN DENTALHUB"
      title={
        <>
          Create your <span>account.</span>
        </>
      }
      description="Start learning with clinical cases, courses, and progress tracking."
    >
      <form id="loginForm" onSubmit={handleSubmit} noValidate>
        <TextField
          id="fullName"
          label="Full name"
          icon="user"
          placeholder="Your name"
          autoComplete="name"
          value={fullName}
          error={errors.fullName}
          onChange={(v) => {
            setFullName(v);
            clear("fullName");
          }}
        />
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
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          error={errors.password}
          showRequirements
          onChange={(v) => {
            setPassword(v);
            clear("password", "confirm");
          }}
        />
        <PasswordField
          id="confirm"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm}
          onChange={(v) => {
            setConfirm(v);
            clear("confirm");
          }}
        />

        <div className="form-options"></div>

        <button className="primary-button login-button" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"} <span>↗</span>
        </button>

        {errors.form && <FormMessage kind="error">{errors.form}</FormMessage>}
      </form>

      <p className="auth-switch">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
