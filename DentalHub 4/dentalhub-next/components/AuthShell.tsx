"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
};

// Shared two-panel layout for sign in, sign up and password recovery.
export default function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
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

  return (
    <main className="login-screen" id="loginScreen">
      <section className="login-visual" ref={visualRef}>
        <Link className="brand brand-light text-wordmark" href="/login" aria-label="DentalHub home">
          Dental<span>Hub</span>
        </Link>

        <div className="visual-content">
          <span className="eyebrow light-eyebrow">YOUR JOURNEY STARTS HERE</span>
          <h1>
            Learn dentistry.
            <br />
            Build <span>confidence.</span>
          </h1>
          <p>
            Your space to study smarter, explore clinical cases, and grow into the dentist you want
            to be.
          </p>

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

          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p className="login-description">{description}</p>

          {children}

          <div className="login-divider"><span>YOUR LEARNING SPACE</span></div>

          <div className="login-bottom-note">
            <span className="mini-shield">✓</span>
            <span>
              <strong>One place to grow.</strong>
              <br />
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
