import Header from "../components/Header";
import { serverApiService } from "../../lib/serverApiService";
import { DashboardClient } from "./DashBoardClient";
import { Tenant } from "../../lib/clientApiService";
import { NewStoreNotification } from "../components/NewStoreNotification";

async function getInitialData(): Promise<Tenant[]> {
  try {
    return await serverApiService.getDataOnServer();
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    return [];
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await getInitialData();

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0c0c]">
      <DashboardClient initialData={initialData}>
        <Header />
        <div className="flex-1 flex flex-col overflow-hidden">
          <NewStoreNotification />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </DashboardClient>
    </div>
  );
}
