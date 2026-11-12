"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { updatePassword, validateReset, type FieldErrors } from "../lib/auth";
import AuthShell from "./AuthShell";
import { FormMessage, PasswordField } from "./AuthFields";

export default function ResetPasswordScreen({
  hasRecoverySession,
  onDone,
}: {
  hasRecoverySession: boolean;
  onDone: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

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

    const found = validateReset(password, confirm);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);

    if (result.error) {
      setErrors({ [result.field ?? "form"]: result.error });
      return;
    }
    onDone();
  }

  if (!hasRecoverySession) {
    return (
      <AuthShell
        eyebrow="ACCOUNT RECOVERY"
        title={
          <>
            Link expired <span>or invalid.</span>
          </>
        }
        description="Password reset links work once and expire quickly. Request a new one to continue."
      >
        <Link className="primary-button login-button" href="/forgot-password">
          Request a new link <span>↗</span>
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="ACCOUNT RECOVERY"
      title={
        <>
          Choose a new <span>password.</span>
        </>
      }
      description="Pick something you haven't used before."
    >
      <form id="loginForm" onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="password"
          label="New password"
          placeholder="Create a new password"
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
          label="Confirm new password"
          placeholder="Re-enter your new password"
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
          {submitting ? "Saving…" : "Update password"} <span>↗</span>
        </button>

        {errors.form && <FormMessage kind="error">{errors.form}</FormMessage>}
      </form>
    </AuthShell>
  );
}
