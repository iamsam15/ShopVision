"use client";
import { useDashboard } from "../../dashboard/DashboardContext";
import { OrdersClient } from "../../components/dashboradComponents/OrdersClient";

export default function OrdersPage() {
  const { selectedTenant } = useDashboard();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Order History</h1>
      {selectedTenant ? (
        <OrdersClient
          initialOrders={selectedTenant.orders.map((o) => ({
            ...o,
            storeUrl: selectedTenant.storeUrl,
          }))}
        />
      ) : (
        <div
          className="backdrop-blur-sm border rounded-2xl p-8 shadow-2xl text-center max-w-lg mx-auto"
          style={{
            backgroundColor: "rgba(72, 30, 20, 0.3)",
            borderColor: "rgba(155, 57, 34, 0.3)",
          }}
        >
          <h2 className="text-2xl font-semibold text-white">
            No Store Selected
          </h2>
          <p className="text-gray-300 mt-2">
            Please select a store to view its order history.
          </p>
        </div>
      )}
    </div>
  );
}
