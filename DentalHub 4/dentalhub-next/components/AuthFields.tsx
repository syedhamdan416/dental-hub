"use client";

import { useId, useState, type FocusEvent, type ReactNode } from "react";
import { passwordChecks } from "../lib/auth";

type IconName = "mail" | "user" | "lock";

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m3.5 7.5 8.5 6 8.5-6" />
      </svg>
    );
  }
  if (name === "user") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.5 20c.8-3.6 3.8-5.6 7.5-5.6s6.7 2 7.5 5.6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

type BaseProps = {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  extra?: ReactNode;
};

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p className="field-error" id={id} role="alert">
      {error}
    </p>
  );
}

export function TextField({
  id,
  label,
  icon,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  extra,
}: BaseProps & { icon: "mail" | "user"; type?: string }) {
  return (
    <div className="auth-field">
      <div className="password-heading">
        <label htmlFor={id}>{label}</label>
        {extra}
      </div>
      <div className={`input-wrap ${error ? "has-error" : ""}`}>
        <span className="field-icon">
          <Icon name={icon} />
        </span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  extra,
  showRequirements = false,
}: BaseProps & { showRequirements?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const listId = useId();

  // Keep the checklist open while focus stays anywhere inside this field
  // (including the Show/Hide button).
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  }

  return (
    <div className="auth-field" onFocus={() => setFocused(true)} onBlur={handleBlur}>
      <div className="password-heading">
        <label htmlFor={id}>{label}</label>
        {extra}
      </div>
      <div className={`input-wrap ${error ? "has-error" : ""}`}>
        <span className="field-icon">
          <Icon name="lock" />
        </span>
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error ? `${id}-error` : null, showRequirements ? listId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      <FieldError id={`${id}-error`} error={error} />

      {showRequirements && focused && (
        <ul className="password-rules" id={listId} aria-label="Password requirements">
          {passwordChecks(value).map((check) => (
            <li key={check.label} className={check.met ? "met" : ""}>
              <span aria-hidden="true">{check.met ? "✓" : "○"}</span>
              {check.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FormMessage({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  return (
    <p className={`login-message ${kind === "success" ? "is-success" : ""}`} role="status">
      {children}
    </p>
  );
}
