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
      <div className="login-card">
        <section className="login-brand">
          <div className="login-brand-glow" />
          <Image
            src="/logo-authentic-scaled.png"
            alt="Skilluence"
            width={150}
            height={52}
            className="login-brand-logo"
          />
          <h2>Land your next role in the U.S.</h2>
          <p>
            Real, live-searched openings from LinkedIn and top employers —
            filtered for visa-friendly, international-talent hiring.
          </p>
          <ul className="login-brand-points">
            <li>Thousands of active roles, updated continuously</li>
            <li>H-1B, OPT, TN &amp; Green Card friendly filters</li>
            <li>No fake postings — sourced directly, not scraped from ads</li>
          </ul>
        </section>

        <section className="login-form-side">
          <div className="login-form-head">
            <h1>Welcome back</h1>
            <p>Sign in to search the job board</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email address</label>
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
                "Sign in"
              )}
            </button>
          </form>

          {message && (
            <div className={`form-message ${isError ? "is-error" : "is-success"}`}>{message}</div>
          )}

          <div className="demo-hint">
            <strong>Demo credentials</strong>
            <div className="demo-hint-row">
              <span>{DUMMY_EMAIL}</span>
              <span>{DUMMY_PASSWORD}</span>
            </div>
          </div>

          <a href="/" className="back-link">
            &larr; Back to home
          </a>
        </section>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(600px circle at 15% 20%, rgba(57, 126, 209, 0.12), transparent 60%),
            radial-gradient(500px circle at 85% 85%, rgba(57, 126, 209, 0.08), transparent 60%),
            var(--bg-color);
        }

        .login-card {
          width: 100%;
          max-width: 880px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--white);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(15, 23, 42, 0.25), var(--shadow-card);
        }

        .login-brand {
          position: relative;
          padding: 48px 40px;
          background: linear-gradient(160deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .login-brand-glow {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          top: -120px;
          right: -100px;
          pointer-events: none;
        }

        .login-brand-logo {
          object-fit: contain;
          filter: brightness(0) invert(1);
          margin-bottom: 28px;
        }

        .login-brand h2 {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.3;
          margin: 0 0 12px;
        }

        .login-brand p {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 24px;
        }

        .login-brand-points {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .login-brand-points li {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.92);
          padding-left: 24px;
          position: relative;
        }

        .login-brand-points li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 6px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.7);
        }

        .login-form-side {
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
        }

        .login-form-head h1 {
          font-size: 26px;
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 6px;
        }

        .login-form-head p {
          font-size: 15px;
          color: var(--text-muted);
          margin: 0 0 28px;
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

        .demo-hint {
          margin-top: 24px;
          padding: 12px 14px;
          border-radius: 10px;
          background: var(--bg-color);
          border: 1px dashed var(--border-color);
          font-size: 12px;
        }

        .demo-hint strong {
          display: block;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-size: 11px;
        }

        .demo-hint-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          color: var(--text-main);
        }

        .back-link {
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: none;
        }

        .back-link:hover {
          color: var(--primary);
        }

        @media (max-width: 760px) {
          .login-card {
            grid-template-columns: 1fr;
            max-width: 440px;
          }
          .login-brand {
            padding: 32px 28px;
          }
          .login-brand h2 {
            font-size: 21px;
          }
          .login-form-side {
            padding: 32px 28px;
          }
        }
      `}</style>
    </div>
  );
}
