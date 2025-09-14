"use client";

import React, { useState, useEffect } from "react";
import { clientApiService, Tenant } from "../../lib/clientApiService";
import { useRouter } from "next/navigation";
import { DashboardContext } from "./DashboardContext";
import { AddStoreModal } from "../components/AddStoreModal";
import toast from "react-hot-toast";

type User = {
  id: string;
  email: string;
};

type View =
  | "overview"
  | "orders"
  | "products"
  | "customers"
  | "insights"
  | "settings";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-[#0C0C0C] text-white">
    Loading your dashboard...
  </div>
);

export function DashboardClient({
  initialData,
  user,
  children,
}: {
  initialData: Tenant[];
  user: User | null;
  children: React.ReactNode;
}) {
  const [allTenants, setAllTenants] = useState<Tenant[]>(initialData);
  const [activeView, setActiveView] = useState<View>("overview");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        const savedTenantId = localStorage.getItem("selectedTenantId");
        if (savedTenantId && initialData.some((t) => t.id === savedTenantId)) {
          return savedTenantId;
        }
      }
      return initialData[0]?.id || null;
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newlyInstalledTenant, setNewlyInstalledTenant] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (selectedTenantId) {
      localStorage.setItem("selectedTenantId", selectedTenantId);
    } else {
      localStorage.removeItem("selectedTenantId");
    }
  }, [selectedTenantId]);

  const fetchAndSetTenants = async () => {
    try {
      const res = await clientApiService.getData();
      if (!res.ok) throw new Error("Failed to fetch data.");
      const data = await res.json();

      setAllTenants(data);
      if (
        data.length > 0 &&
        !data.some((t: Tenant) => t.id === selectedTenantId)
      ) {
        setSelectedTenantId(data[0].id);
      } else if (data.length === 0) {
        setSelectedTenantId(null);
      }
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Could not fetch tenants.");
      } else {
        toast.error("Could not fetch tenants.");
      }
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      if (!initialData || initialData.length === 0) {
        await fetchAndSetTenants();
      }
      setIsLoading(false);
    };
    initialLoad();
  }, [initialData]);

  useEffect(() => {
    const checkForNewTenant = () => {
      const storedTenant = localStorage.getItem("newlyInstalledTenant");
      if (storedTenant) {
        setNewlyInstalledTenant(JSON.parse(storedTenant));
        localStorage.removeItem("newlyInstalledTenant");
      }
    };
    checkForNewTenant();
    window.addEventListener("storage", checkForNewTenant);
    return () => window.removeEventListener("storage", checkForNewTenant);
  }, []);

  const handleLinkTenant = async () => {
    if (!newlyInstalledTenant) return;
    setIsLinking(true);
    try {
      await clientApiService.linkTenant(newlyInstalledTenant.id);
      toast.success(`Successfully linked to ${newlyInstalledTenant.url}!`);
      await fetchAndSetTenants();
      setSelectedTenantId(newlyInstalledTenant.id);
      setNewlyInstalledTenant(null);
    } catch (error) {
      toast.error("Failed to link the store.");
    } finally {
      setIsLinking(false);
    }
  };

  const handleSync = async (): Promise<void> => {
    if (!selectedTenantId) {
      toast.error("Please select a store to sync.");
      return;
    }
    setIsSyncing(true);
    try {
      const res = await clientApiService.syncTenant(selectedTenantId);
      if (res.ok) {
        toast.success(
          "Data sync completed successfully! The page will now refresh."
        );
        router.refresh();
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      toast.error("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  const selectedTenant =
    allTenants.find((t) => t.id === selectedTenantId) || null;

  const contextValue = {
    allTenants,
    selectedTenant,
    setSelectedTenantId,
    isLinking,
    isSyncing,
    handleLinkTenant,
    handleSync,
    openAddStoreModal: () => setIsModalOpen(true),
    newlyInstalledTenant,
    activeView,
    setActiveView,
    user,
    fetchTenants: fetchAndSetTenants,
    setSelectedTenant: setSelectedTenantId,
    isLoading,
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
      <AddStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardContext.Provider>
  );
}
