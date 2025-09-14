"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clientApiService } from "../../../lib/clientApiService";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Password strength checker
  useEffect(() => {
    const calculateStrength = (pass: string) => {
      let strength = 0;
      if (pass.length >= 8) strength++;
      if (pass.match(/[a-z]/)) strength++;
      if (pass.match(/[A-Z]/)) strength++;
      if (pass.match(/[0-9]/)) strength++;
      if (pass.match(/[^a-zA-Z0-9]/)) strength++;
      return strength;
    };
    setPasswordStrength(calculateStrength(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength < 3) {
      setError(
        "Password should be at least 8 characters with uppercase, lowercase, and numbers"
      );
      setLoading(false);
      return;
    }

    try {
      const res = await clientApiService.register(email, password);
      if (res.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during registration.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "#F2613F";
    if (passwordStrength <= 3) return "#9B3922";
    return "#481E14";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    if (passwordStrength <= 4) return "Strong";
    return "Very Strong";
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
          className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#481E14" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-2xl opacity-15"
          style={{ backgroundColor: "#9B3922" }}
        ></div>
      </div>

      {/* Main register container */}
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-300 text-sm">Join us and get started</p>
          </div>

          {/* Success message */}
          {success && (
            <div
              className="border p-3 rounded-lg mb-6 text-center"
              style={{
                backgroundColor: "rgba(72, 30, 20, 0.3)",
                borderColor: "rgba(155, 57, 34, 0.5)",
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm">{success}</span>
              </div>
            </div>
          )}

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
                placeholder="Create a strong password"
                required
              />

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">
                      Password Strength
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: getStrengthColor() }}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getStrengthColor(),
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                className="w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
                style={{
                  backgroundColor: "#481E14",
                  borderColor: confirmPasswordFocused ? "#F2613F" : "#9B3922",
                }}
                placeholder="Confirm your password"
                required
              />

              {/* Password match indicator */}
              {confirmPassword && (
                <div className="mt-1 flex items-center space-x-1">
                  {password === confirmPassword ? (
                    <>
                      <svg
                        className="w-3 h-3"
                        style={{ color: "#F2613F" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-xs" style={{ color: "#F2613F" }}>
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span className="text-xs text-red-400">
                        Passwords don&apos;t match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Register button */}
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium transition-colors duration-200"
                style={{ color: "#F2613F" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9B3922";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#F2613F";
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
