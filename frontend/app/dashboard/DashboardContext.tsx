"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Tenant } from "../../lib/clientApiService";

interface User {
  id: string;
  email: string;
}

type View =
  | "overview"
  | "orders"
  | "products"
  | "customers"
  | "insights"
  | "settings";

interface DashboardContextType {
  allTenants: Tenant[];
  selectedTenant: Tenant | null;
  setSelectedTenant: (id: string | null) => void;
  isLinking: boolean;
  isSyncing: boolean;
  handleLinkTenant: () => Promise<void>;
  handleSync: () => Promise<void>;
  openAddStoreModal: () => void;
  newlyInstalledTenant: { id: string; url: string } | null;
  activeView: View;
  setActiveView: Dispatch<SetStateAction<View>>;
  user: User | null;
  fetchTenants: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
