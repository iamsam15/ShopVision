"use client";

import { useDashboard } from "../../dashboard/DashboardContext";
import { clientApiService } from "@/lib/clientApiService";
import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function SettingsPage() {
  const { selectedTenant, setSelectedTenant, fetchTenants, user } =
    useDashboard();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleDeleteTenant = async () => {
    if (!selectedTenant) return;
    setIsDeleting(true);
    setFeedbackMessage("");
    try {
      const response = await clientApiService.deleteTenant(selectedTenant.id);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Deletion failed");

      setFeedbackMessage(data.message);
      setIsDeleteModalOpen(false);
      setSelectedTenant(null);
      fetchTenants();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setFeedbackMessage(`Error: ${message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setFeedbackMessage("Error: New passwords do not match.");
      return;
    }
    if (!currentPassword || !newPassword) {
      setFeedbackMessage("Error: All password fields are required.");
      return;
    }

    setIsChangingPassword(true);
    setFeedbackMessage("");
    try {
      const response = await clientApiService.changePassword(
        currentPassword,
        newPassword
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Password change failed");

      setFeedbackMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setFeedbackMessage(`Error: ${message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-6 lg:p-8 relative"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#481E14" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-2xl opacity-15"
          style={{ backgroundColor: "#9B3922" }}
        ></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Settings
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">{user?.email}</h2>
          <div
            className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl"
            style={{
              backgroundColor: "rgba(72, 30, 20, 0.3)",
              borderColor: "rgba(155, 57, 34, 0.3)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Change Password
            </h2>
            <div className="space-y-4 max-w-sm">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="w-full pl-4 pr-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
                style={
                  {
                    backgroundColor: "#481E14",
                    borderColor: "#9B3922",
                    "--tw-ring-color": "#F2613F",
                  } as React.CSSProperties
                }
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full pl-4 pr-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
                style={
                  {
                    backgroundColor: "#481E14",
                    borderColor: "#9B3922",
                    "--tw-ring-color": "#F2613F",
                  } as React.CSSProperties
                }
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full pl-4 pr-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
                style={
                  {
                    backgroundColor: "#481E14",
                    borderColor: "#9B3922",
                    "--tw-ring-color": "#F2613F",
                  } as React.CSSProperties
                }
              />
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="w-full bg-[#9B3922] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#F2613F] transition duration-200 disabled:opacity-50"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>

          {selectedTenant && (
            <div
              className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl"
              style={{
                backgroundColor: "rgba(72, 30, 20, 0.3)",
                borderColor: "#F2613F",
              }}
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold text-red-400 mb-4">
                <AlertTriangle />
                Danger Zone
              </h2>
              <p className="text-gray-400 mb-4">
                Delete the store <strong>{selectedTenant.storeUrl}</strong>.
                This is a permanent action and cannot be undone.
              </p>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                Delete this Store
              </button>
            </div>
          )}

          {feedbackMessage && (
            <p className="text-center text-green-400 mt-4">{feedbackMessage}</p>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div
            className="rounded-2xl border p-8 shadow-2xl w-full max-w-md m-4"
            style={{ backgroundColor: "#0C0C0C", borderColor: "#F2613F" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Are you sure?</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              This will permanently delete the store{" "}
              <strong className="text-white">{selectedTenant?.storeUrl}</strong>{" "}
              and all its data. This action cannot be reversed.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTenant}
                disabled={isDeleting}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
