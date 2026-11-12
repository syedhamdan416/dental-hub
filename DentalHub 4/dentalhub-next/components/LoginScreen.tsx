
"use client";

import { useState, type FormEvent } from "react";

type LoginScreenProps = {
  onLogin: (email: string) => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setMessage("");
    onLogin(email.trim());
  }

  return (
    <main className="login-screen" id="loginScreen">
      <section className="login-visual">
        <a className="brand brand-light text-wordmark" href="#" aria-label="DentalHub home">
          Dental<span>Hub</span>
        </a>

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
          <a className="mobile-brand text-wordmark" href="#" aria-label="DentalHub home">
            Dental<span>Hub</span>
          </a>
          <span className="secure-label"><span className="status-dot"></span> STUDENT PORTAL</span>
        </div>

        <div className="login-form-wrap">
          <img
            className="login-logo"
            src="/original-frontend/assets/dentalhub-logo.png"
            alt="DentalHub logo"
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
              <span className="demo-hint">Demo access</span>
            </div>

            <div className="input-wrap">
              <span className="field-icon">⌑</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter any password"
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
              <span className="demo-note">Demo login only</span>
            </div>

            <button className="primary-button login-button" type="submit">
              Enter your workspace <span>↗</span>
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
