"use client";

import { Store, PlusCircle, RefreshCw, Package } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useDashboard } from "../dashboard/DashboardContext";
export function Sidebar2() {
  const {
    allTenants,
    selectedTenant,
    setSelectedTenantId,
    isSyncing,
    handleSync,
    openAddStoreModal,
  } = useDashboard();

  return (
    <aside
      className="w-64 flex flex-col bg-[#0C0C0C] border-r"
      style={{ borderColor: "rgba(72, 30, 20, 0.7)" }}
    >
      {/* Logo/Header */}
      <div
        className="h-20 flex items-center px-6 border-b"
        style={{ borderColor: "rgba(72, 30, 20, 0.7)" }}
      >
        <div className="flex items-center gap-3 text-white">
          <Package className="h-8 w-8 text-[#F2613F]" />
          <span className="text-2xl font-bold tracking-wider">Xeno</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 space-y-6">
        {/* Tenant Switcher */}
        <div className="space-y-2">
          <label className="px-2 text-xs font-semibold uppercase text-gray-400">
            Active Store
          </label>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 shadow-sm"
            style={{
              backgroundColor: "#481E14",
              border: "1px solid #9B3922",
            }}
          >
            <Store className="w-4 h-4 text-[#F2613F]" />
            <select
              id="tenant-switcher"
              value={selectedTenant?.id || ""}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm text-[#F2613F] appearance-none"
            >
              {allTenants.length > 0 ? (
                allTenants.map((tenant) => (
                  <option
                    key={tenant.id}
                    value={tenant.id}
                    className="bg-[#0C0C0C]"
                  >
                    {tenant.storeUrl}
                  </option>
                ))
              ) : (
                <option className="bg-[#0C0C0C] text-[#9B3922]">
                  No stores connected
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleSync}
            disabled={isSyncing || allTenants.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: isSyncing ? "#9B3922" : "#F2613F",
              color: "white",
            }}
          >
            <RefreshCw
              className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Syncing..." : "Sync Data"}
          </button>
          <button
            onClick={openAddStoreModal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
            style={{
              backgroundColor: "#9B3922",
              color: "white",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#F2613F")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#9B3922")
            }
          >
            <PlusCircle className="w-4 h-4" />
            Connect New Store
          </button>
        </div>
      </div>

      {/* Footer/Logout */}
      <div
        className="p-4 border-t"
        style={{ borderColor: "rgba(72, 30, 20, 0.7)" }}
      >
        <LogoutButton />
      </div>
    </aside>
  );
}
