"use client";

import { useDashboard } from "../../dashboard/DashboardContext";
import StatCard from "../StatCard";
import TopCustomersList from "../TopCustomersList";
import { Customer, Order } from "../../../lib/clientApiService";

export default function DashboardOverviewPage() {
  const { selectedTenant } = useDashboard();
  console.log(selectedTenant);
  if (!selectedTenant) {
    return (
      <div className="flex items-center justify-center h-full">
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
            Connect a store or select one to view its data.
          </p>
        </div>
      </div>
    );
  }

  const { customers, orders, products, checkouts } = selectedTenant;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const completedCheckouts = checkouts.filter((c) => c.isCompleted).length;
  const processedCustomers = customers.map((c: Customer) => {
    const customerOrders = orders.filter((o: Order) => o.customer?.id === c.id);
    return {
      ...c,
      totalSpend: customerOrders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      ),
    };
  });

  const topCustomers = processedCustomers
    .sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        />
        <StatCard title="Total Orders" value={orders.length} />
        <StatCard title="Total Customers" value={customers.length} />
        <StatCard title="Total Products" value={products.length} />
        <StatCard title="Total Checkouts Initiated" value={checkouts.length} />
        <StatCard
          title="Total Checkouts Completed"
          value={completedCheckouts}
        />
      </div>
      <TopCustomersList customers={topCustomers} />
    </div>
  );
}
