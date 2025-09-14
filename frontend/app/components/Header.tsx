"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Store,
  PlusCircle,
  RefreshCw,
  Package,
  UserCircle,
  LayoutDashboard,
  ShoppingCart,
  Users,
  BarChart2,
  ChevronDown,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDashboard } from "../dashboard/DashboardContext";
import { LogoutButton } from "./LogoutButton";

type View = "overview" | "orders" | "products" | "customers" | "insights";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "insights", label: "Insights", icon: BarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    allTenants,
    selectedTenant,
    setSelectedTenant,
    isSyncing,
    handleSync,
    openAddStoreModal,
    activeView,
    setActiveView,
  } = useDashboard();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#0C0C0C] border-b border-[#2A2A2A]">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
        <div className="flex items-center gap-2 text-white">
          <Package className="h-7 w-7 text-[#F2613F]" />
          <span className="text-xl font-bold tracking-tight">Xeno</span>
        </div>

        <nav className="hidden md:flex items-center gap-1 relative">
          {navItems.map((item) => {
            const isActive = activeView === item.id;

            return (
              <button
                key={item.label}
                onClick={() => setActiveView(item.id as View)}
                className={`relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-md bg-[#F2613F]"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? "text-white" : "text-gray-300"
                  }`}
                >
                  <item.icon className="inline h-5 w-5 mr-2" />
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
        <div className="relative" ref={menuRef} style={{ zIndex: 2 }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1A1A1A] text-gray-300 hover:bg-[#F2613F] hover:text-white transition-colors"
          >
            <UserCircle className="h-6 w-6" />
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-lg shadow-xl p-4 bg-[#121212] border border-[#2A2A2A]">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-gray-400">
                    Active Store
                  </label>
                  <div className="flex items-center gap-2 rounded-md px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A]">
                    <Store className="w-4 h-4 text-[#F2613F]" />
                    <select
                      value={selectedTenant?.id || ""}
                      onChange={(e) => setSelectedTenant(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#F2613F] focus:outline-none"
                    >
                      {allTenants.map((t) => (
                        <option
                          key={t.id}
                          value={t.id}
                          className="bg-[#0C0C0C] hover:bg-[#F2613F]"
                        >
                          {t.storeUrl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#2A2A2A] pt-4">
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#F2613F] text-white hover:opacity-90 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
                    />
                    {isSyncing ? "Syncing..." : "Sync Data"}
                  </button>
                  <button
                    onClick={openAddStoreModal}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#2A2A2A] text-white hover:bg-[#F2613F]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Connect New Store
                  </button>
                </div>

                <div className="border-t border-[#2A2A2A] pt-4">
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
