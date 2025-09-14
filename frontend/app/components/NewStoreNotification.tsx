"use client";

import { useDashboard } from "../dashboard/DashboardContext";
import { Link2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function NewStoreNotification() {
  const { newlyInstalledTenant, handleLinkTenant, isLinking } = useDashboard();
  const [dismissed, setDismissed] = useState(false);

  if (!newlyInstalledTenant || dismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
    >
      <div
        className="backdrop-blur-sm border rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative"
        style={{
          backgroundColor: "rgba(72, 30, 20, 0.5)", // #481E14 with opacity
          borderColor: "rgba(155, 57, 34, 0.4)", // #9B3922 with opacity
        }}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          aria-label="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-grow text-center sm:text-left">
          <p className="text-sm text-gray-200">
            <span
              className="font-semibold"
              style={{ color: "#F2613F" }} // Theme accent color
            >
              Installation Successful
            </span>
            <span className="text-gray-400"> — </span>
            Connect store{" "}
            <span className="font-medium text-white">
              {newlyInstalledTenant.url}
            </span>{" "}
            to your account.
          </p>
        </div>

        <button
          onClick={handleLinkTenant}
          disabled={isLinking}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "#9B3922", // Theme button color
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#F2613F")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#9B3922")
          }
        >
          <Link2 className="w-4 h-4" />
          {isLinking ? "Linking..." : "Link Store"}
        </button>
      </div>
    </motion.div>
  );
}
