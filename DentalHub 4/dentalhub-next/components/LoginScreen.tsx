
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { signIn } from "../lib/auth";

type LoginScreenProps = {
  onLogin?: (email: string) => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const visualRef = useRef<HTMLElement>(null);

  // Restrained cursor-following water sheen on the visual panel.
  useEffect(() => {
    const panel = visualRef.current;
    if (
      !panel ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let latestX = 0;
    let latestY = 0;

    function onMove(event: PointerEvent) {
      const target = panel as HTMLElement;
      const rect = target.getBoundingClientRect();
      latestX = event.clientX - rect.left;
      latestY = event.clientY - rect.top;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const x = Math.max(0, Math.min(100, (latestX / rect.width) * 100));
        const y = Math.max(0, Math.min(100, (latestY / rect.height) * 100));
        target.style.setProperty("--water-x", `${x}%`);
        target.style.setProperty("--water-y", `${y}%`);
        target.style.setProperty("--water-shift-x", `${(x - 50) * -0.035}px`);
        target.style.setProperty("--water-shift-y", `${(y - 50) * -0.035}px`);
        target.classList.add("is-water-active");
        frame = 0;
      });
    }

    function onLeave() {
      const target = panel as HTMLElement;
      target.classList.remove("is-water-active");
      target.style.setProperty("--water-x", "50%");
      target.style.setProperty("--water-y", "50%");
      target.style.setProperty("--water-shift-x", "0px");
      target.style.setProperty("--water-shift-y", "0px");
    }

    panel.addEventListener("pointermove", onMove, { passive: true });
    panel.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setSubmitting(true);

    const result = await signIn(email.trim(), password);

    setSubmitting(false);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    onLogin?.(result.email ?? email.trim());
  }

  return (
    <main className="login-screen" id="loginScreen">
      <section className="login-visual" ref={visualRef}>
        <Link className="brand brand-light text-wordmark" href="/login" aria-label="DentalHub home">
          Dental<span>Hub</span>
        </Link>

        <div className="visual-content">
          <span className="eyebrow light-eyebrow">YOUR JOURNEY STARTS HERE</span>
          <h1>Learn dentistry.<br />Build <span>confidence.</span></h1>
          <p>Your space to study smarter, explore clinical cases, and grow into the dentist you want to be.</p>

          <div className="visual-points">
            <div className="visual-point"><span className="point-icon">✓</span> Learn at your own pace</div>
            <div className="visual-point"><span className="point-icon">✓</span> Explore clinical cases</div>
            <div className="visual-point"><span className="point-icon">✓</span> Track your progress</div>
          </div>
        </div>

        <div className="tooth-art" aria-hidden="true">
          <div className="art-orbit orbit-one"></div>
          <div className="art-orbit orbit-two"></div>
          <div className="tooth-symbol">✦</div>
          <div className="art-label label-top">LEARN <span>01</span></div>
          <div className="art-label label-bottom">PRACTICE <span>02</span></div>
        </div>

        <div className="visual-footer">MADE FOR FUTURE DENTAL PROFESSIONALS</div>
      </section>

      <section className="login-panel">
        <div className="login-top">
          <Link className="mobile-brand text-wordmark" href="/login" aria-label="DentalHub home">
            Dental<span>Hub</span>
          </Link>
          <span className="secure-label"><span className="status-dot"></span> STUDENT PORTAL</span>
        </div>

        <div className="login-form-wrap">
          <Image
            className="login-logo"
            src="/dentalhub-logo.png"
            alt="DentalHub logo"
            width={1107}
            height={973}
            priority
          />

          <span className="eyebrow">WELCOME TO DENTALHUB</span>
          <h2>Good to have you<br /> <span>back.</span></h2>
          <p className="login-description">Sign in to pick up where your learning left off.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="field-icon">✉</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="password-heading">
              <label htmlFor="password">Password</label>
            </div>

            <div className="input-wrap">
              <span className="field-icon">⌑</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="form-options">
              <label className="remember-option">
                <input type="checkbox" id="remember" />
                <span>Remember me</span>
              </label>
            </div>

            <button className="primary-button login-button" type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Enter your workspace"} <span>↗</span>
            </button>

            <p className="login-message" role="status">{message}</p>
          </form>

          <div className="login-divider"><span>YOUR LEARNING SPACE</span></div>

          <div className="login-bottom-note">
            <span className="mini-shield">✓</span>
            <span>
              <strong>One place to grow.</strong><br />
              Courses, cases, and progress — together.
            </span>
          </div>
        </div>

        <footer className="login-footer">
          <span>© 2026 DentalHub</span>
          <span>LEARN · PRACTICE · GROW</span>
        </footer>
      </section>
    </main>
  );
}
