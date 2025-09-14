"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStoreModal({ isOpen, onClose }: AddStoreModalProps) {
  const [storeName, setStoreName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeName.includes(".myshopify.com")) {
      setError("Please enter a valid .myshopify.com store URL.");
      return;
    }
    const installUrl = `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/api/shopify/install?shop=${storeName.trim()}`;

    window.open(installUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl transform transition-all duration-300 scale-100 backdrop-blur-sm border"
        style={{
          backgroundColor: "rgba(72, 30, 20, 0.9)",
          borderColor: "rgba(155, 57, 34, 0.5)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">
          Connect a New Store
        </h2>
        <p className="text-gray-300 mb-6 text-sm">
          Enter your store&apos;s{" "}
          <span className="font-mono text-[#F2613F]">.myshopify.com</span> URL
          to begin the installation process in a new tab.
        </p>

        {/* Error Message */}
        {error && (
          <p
            className="border p-3 rounded-lg mb-4 text-sm text-center"
            style={{
              backgroundColor: "rgba(155, 57, 34, 0.2)",
              borderColor: "rgba(242, 97, 63, 0.4)",
              color: "#F2613F",
            }}
          >
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Store URL
            </label>
            <input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
              style={{
                backgroundColor: "#481E14",
                borderColor: error ? "#F2613F" : "#9B3922",
              }}
              placeholder="your-store-name.myshopify.com"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: "#9B3922",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F2613F";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#9B3922";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: "#F2613F",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#9B3922";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F2613F";
              }}
            >
              Connect Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
