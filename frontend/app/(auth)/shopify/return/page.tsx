"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ShopifyReturnPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const newTenantId = searchParams.get("newTenantId");
    const shopUrl = searchParams.get("shop");

    if (newTenantId && shopUrl) {
      localStorage.setItem(
        "newlyInstalledTenant",
        JSON.stringify({
          id: newTenantId,
          url: shopUrl,
        })
      );
      window.close();
    }
  }, [searchParams]);

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      {/* Subtle background accent */}
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

      {/* Card container */}
      <div className="relative w-full max-w-md">
        <div
          className="backdrop-blur-sm border rounded-2xl p-8 shadow-2xl flex flex-col items-center"
          style={{
            backgroundColor: "rgba(72, 30, 20, 0.3)",
            borderColor: "rgba(155, 57, 34, 0.3)",
          }}
        >
          {/* Icon */}
          <div
            className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-6"
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Loader */}
          <div className="flex items-center justify-center mb-4">
            <svg
              className="animate-spin w-6 h-6"
              style={{ color: "#F2613F" }}
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
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 
                   5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
              ></path>
            </svg>
          </div>

          {/* Text */}
          <p className="text-gray-300 text-center text-sm">
            Finalizing connection... <br />
            This window will close automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
