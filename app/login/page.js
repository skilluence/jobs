"use client";

import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Dummy credentials
    const dummyEmail = "admin@skilluence.com";
    const dummyPassword = "demo123";

    // Simple validation
    if (!email || !password) {
      setMessage("Please fill in both fields.");
      setIsLoading(false);
      return;
    }

    // Check dummy credentials
    if (email !== dummyEmail || password !== dummyPassword) {
      setMessage("Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    // Set cookie and redirect
    document.cookie = "loggedIn=true; path=/; max-age=86400"; // 1 day
    setMessage("Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, var(--primary-xlight) 0%, var(--bg-color) 100%)",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        padding: "48px",
        borderRadius: "20px",
        boxShadow: "var(--shadow-card), 0 20px 40px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Image
            src="/logo-authentic-scaled.png"
            alt="Skilluence"
            width={140}
            height={48}
            style={{
              marginBottom: "16px",
              objectFit: "contain"
            }}
          />
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "var(--text-main)",
            marginBottom: "8px"
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: "var(--text-muted)",
            fontSize: "16px"
          }}>
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "var(--text-main)",
                fontSize: "14px"
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 44px",
                  border: "2px solid var(--border-color)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  color: "var(--text-main)",
                  background: "white",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  outline: "none"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--focus-ring)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
              <svg
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "18px",
                  height: "18px",
                  color: "var(--text-muted)"
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "var(--text-main)",
                fontSize: "14px"
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 44px",
                  border: "2px solid var(--border-color)",
                  borderRadius: "12px",
                  fontSize: "16px",
                  color: "var(--text-main)",
                  background: "white",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  outline: "none"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                  e.target.style.boxShadow = "0 0 0 3px var(--focus-ring)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-color)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
              <svg
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "18px",
                  height: "18px",
                  color: "var(--text-muted)"
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              background: isLoading ? "var(--text-muted)" : "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.background = "var(--primary-hover)";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(57, 126, 209, 0.3)";
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.background = "var(--primary)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {isLoading ? (
              <>
                <svg
                  style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.3" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: "24px",
            padding: "12px 16px",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "500",
            background: message.includes("successful") ? "var(--primary-xlight)" : "#fef2f2",
            color: message.includes("successful") ? "var(--primary-dark)" : "#dc2626",
            border: `1px solid ${message.includes("successful") ? "var(--primary-light)" : "#fecaca"}`
          }}>
            {message}
          </div>
        )}

        <p style={{
          marginTop: "24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "14px"
        }}>
          <a href="/" style={{ color: "var(--primary)", textDecoration: "none" }}>
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}

