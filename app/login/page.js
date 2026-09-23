"use client";

import Image from "next/image";
import { useState } from "react";

const DUMMY_EMAIL = "support@skilluence.com";
const DUMMY_PASSWORD = "Skill@123";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!email || !password) {
      setIsError(true);
      setMessage("Please fill in both fields.");
      setIsLoading(false);
      return;
    }

    if (email !== DUMMY_EMAIL || password !== DUMMY_PASSWORD) {
      setIsError(true);
      setMessage("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    document.cookie = "loggedIn=true; path=/; max-age=86400";
    setIsError(false);
    setMessage("Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "/";
    }, 800);
  };

  return (
    <div className="login-page">
      <section className="login-form-side">
        <div className="login-form-inner">
          <div className="login-form-head">
            <h1>Login to your account</h1>
            <p>Enter your email below to login to your account.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                  <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3l18 18" strokeLinecap="round" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" strokeLinecap="round" />
                      <path d="M9.4 5.5A9.6 9.6 0 0 1 12 5c5 0 9 4 10 7-.4 1.2-1.2 2.6-2.4 3.9M6.7 6.7C4.6 8 3.1 9.9 2 12c1 3 5 7 10 7 1.2 0 2.3-.2 3.3-.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div className={`form-message ${isError ? "is-error" : "is-success"}`}>{message}</div>
            )}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Login
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <section className="login-brand">
        <Image
          src="/logo-authentic-scaled.png"
          alt="Skilluence"
          width={160}
          height={56}
          className="login-brand-logo"
        />
        <div className="login-brand-copy">
          <h2>Find your next role.</h2>
          <p>
            Real, live-searched openings from LinkedIn and top employers —
            filtered for visa-friendly, international-talent hiring.
          </p>
        </div>
        <p className="login-brand-footer">&copy; 2026 Skilluence. All rights reserved.</p>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 8px;
          background: var(--white);
        }

        .login-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .login-form-inner {
          width: 100%;
          max-width: 360px;
        }

        .login-form-head h1 {
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text-main);
          margin: 0 0 8px;
        }

        .login-form-head p {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0 0 28px;
        }

        .login-brand {
          position: relative;
          border-radius: 24px;
          padding: 40px;
          background: var(--text-main);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .login-brand-logo {
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .login-brand-copy {
          max-width: 380px;
        }

        .login-brand-copy h2 {
          font-size: 34px;
          font-weight: 600;
          line-height: 1.25;
          margin: 0 0 14px;
        }

        .login-brand-copy p {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
        }

        .login-brand-footer {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
        }

        .field {
          margin-bottom: 18px;
        }

        .field label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          background: var(--bg-color);
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }

        .input-wrap:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--focus-ring);
          background: var(--white);
        }

        .input-wrap svg {
          width: 18px;
          height: 18px;
          margin-left: 14px;
          color: var(--text-light);
          flex-shrink: 0;
        }

        .input-wrap input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          padding: 13px 12px;
          font-size: 15px;
          color: var(--text-main);
          font-family: inherit;
        }

        .toggle-visibility {
          background: none;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          color: var(--text-light);
          display: flex;
        }

        .toggle-visibility svg {
          width: 18px;
          height: 18px;
          margin: 0;
        }

        .submit-btn {
          width: 100%;
          margin-top: 6px;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 8px 16px -6px rgba(57, 126, 209, 0.45);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-message {
          margin-top: 16px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
        }

        .form-message.is-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .form-message.is-success {
          background: var(--primary-xlight);
          color: var(--primary-dark);
          border: 1px solid var(--primary-light);
        }

        .submit-btn svg {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 900px) {
          .login-page {
            grid-template-columns: 1fr;
          }
          .login-brand {
            display: none;
          }
          .login-form-side {
            padding: 40px 24px;
          }
        }
      `}</style>
    </div>
  );
}
