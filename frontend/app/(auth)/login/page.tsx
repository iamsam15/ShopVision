"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApiService } from "../../../lib/clientApiService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await clientApiService.login(email, password);
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      {/* Subtle background accent using the palette colors */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#481E14" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-2xl opacity-15"
          style={{ backgroundColor: "#9B3922" }}
        ></div>
      </div>

      {/* Main login container */}
      <div className="relative w-full max-w-md">
        {/* Card with palette colors */}
        <div
          className="backdrop-blur-sm border rounded-2xl p-8 shadow-2xl"
          style={{
            backgroundColor: "rgba(72, 30, 20, 0.3)",
            borderColor: "rgba(155, 57, 34, 0.3)",
          }}
        >
          {/* Logo/Icon area */}
          <div className="text-center mb-8">
            <div
              className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#481E14" }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: "#F2613F" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-sm">Sign in to your account</p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="border p-3 rounded-lg mb-6 text-center"
              style={{
                backgroundColor: "rgba(155, 57, 34, 0.2)",
                borderColor: "rgba(242, 97, 63, 0.4)",
                color: "#F2613F",
              }}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
                style={{
                  backgroundColor: "#481E14",
                  borderColor: emailFocused ? "#F2613F" : "#9B3922",
                }}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
                style={{
                  backgroundColor: "#481E14",
                  borderColor: passwordFocused ? "#F2613F" : "#9B3922",
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: "#9B3922",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#F2613F";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#9B3922";
                }
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium transition-colors duration-200"
                style={{ color: "#F2613F" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9B3922";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#F2613F";
                }}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
