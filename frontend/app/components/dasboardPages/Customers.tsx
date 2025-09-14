"use client";
import { useDashboard } from "../../dashboard/DashboardContext";
import { Customer, Order } from "../../../lib/clientApiService";
import { useMemo, useState } from "react";
import { TopCustomersChart } from "../dashboradComponents/topCustomerChart";
import { CustomerGrowthChart } from "../dashboradComponents/CustomerGrowthChart";
import {
  parseISO,
  startOfDay,
  subDays,
  eachDayOfInterval,
  format,
} from "date-fns";

export default function CustomersPage() {
  const { selectedTenant } = useDashboard();
  const [showAll, setShowAll] = useState(false);

  // --- Customers by Spend ---
  const customersBySpend = selectedTenant
    ? selectedTenant.customers
        .map((c: Customer) => {
          const customerOrders = selectedTenant.orders.filter(
            (o: Order) => o.customer?.id === c.id
          );
          return {
            ...c,
            totalSpend: customerOrders.reduce(
              (sum: number, order: Order) => sum + order.totalPrice,
              0
            ),
          };
        })
        .sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0))
    : [];

  // --- Top Customers by Order Volume ---
  const topCustomersData = useMemo(() => {
    if (!selectedTenant || !selectedTenant.orders || !selectedTenant.customers)
      return [];

    const { orders, customers } = selectedTenant;
    const customerOrderCounts = new Map();

    orders.forEach((order) => {
      if (order.customer && order.customer.id) {
        const currentCount = customerOrderCounts.get(order.customer.id) || 0;
        customerOrderCounts.set(order.customer.id, currentCount + 1);
      }
    });

    const customerMap = new Map(customers.map((c) => [c.id, c]));

    const chartData = Array.from(customerOrderCounts.entries())
      .map(([customerId, orderCount]) => {
        const customer = customerMap.get(customerId);
        const name = customer
          ? `${customer.firstName} ${customer.lastName}`.trim()
          : `Customer...${customerId.slice(-4)}`;
        return { name, orders: orderCount };
      })
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 10);

    return chartData.reverse();
  }, [selectedTenant]);

  // --- Customer Growth Data ---
  const timeRange = 7; // last 7 days
  const customerGrowthData = useMemo(() => {
    if (!selectedTenant) return [];
    const { customers } = selectedTenant;

    const endDate: Date = startOfDay(new Date());
    const startDate: Date = startOfDay(subDays(endDate, timeRange - 1));

    let cumulativeCount = customers.filter(
      (c) => parseISO(c.createdAt as unknown as string) < startDate
    ).length;

    const dailyNewCustomers = new Map<string, number>();
    const interval: Date[] = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    interval.forEach((day: Date) => {
      dailyNewCustomers.set(format(day, "MMM dd"), 0);
    });

    customers
      .filter((c) => {
        const createdAt: Date = parseISO(c.createdAt as unknown as string);
        return createdAt >= startDate && createdAt <= endDate;
      })
      .forEach((c) => {
        const date = format(
          parseISO(c.createdAt as unknown as string),
          "MMM dd"
        );
        dailyNewCustomers.set(date, (dailyNewCustomers.get(date) || 0) + 1);
      });

    return Array.from(dailyNewCustomers.entries()).map(
      ([date, newCustomers]) => {
        cumulativeCount += newCustomers;
        return { date, Customers: cumulativeCount };
      }
    );
  }, [selectedTenant, timeRange]);

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 relative bg-[#0C0C0C]">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/3 w-[450px] h-[450px] bg-[#481E14] rounded-full blur-[140px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#9B3922] rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative w-full space-y-8">
        {!selectedTenant ? (
          <div className="backdrop-blur-sm border rounded-2xl p-8 shadow-2xl text-center max-w-lg mx-auto bg-white/5 border-white/10">
            <h2 className="text-2xl font-semibold text-white">
              No Store Selected
            </h2>
            <p className="text-gray-300 mt-2">
              Please choose a store to see customer data.
            </p>
          </div>
        ) : (
          <>
            {/* Row 1: Charts Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl bg-white/5 border-white/10">
                <h1 className="text-2xl font-bold text-white mb-6">
                  Top Customers by Order Volume
                </h1>
                <div style={{ height: 250 }}>
                  <TopCustomersChart data={topCustomersData} />
                </div>
              </div>

              <div className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl bg-white/5 border-white/10">
                <h1 className="text-2xl font-bold text-white mb-6">
                  Customer Growth Over Time
                </h1>
                <div style={{ height: 250 }}>
                  <CustomerGrowthChart data={customerGrowthData} />
                </div>
              </div>
            </div>

            {/* Row 2: Full-width Customer Spending */}
            <div className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl bg-white/5 border-white/10">
              <h1 className="text-2xl font-bold text-white mb-6">
                All Customers by Spending
              </h1>
              <div>
                {customersBySpend.length > 0 ? (
                  <>
                    <ul className="space-y-2">
                      {customersBySpend
                        .slice(0, showAll ? customersBySpend.length : 5)
                        .map((customer, index) => (
                          <li
                            key={customer.id}
                            className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200 hover:bg-white/10 border-b border-white/10"
                          >
                            <div className="flex items-center">
                              <span className="text-lg font-bold mr-4 w-6 text-center text-[#F2613F]">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-semibold text-white">
                                  {customer.firstName} {customer.lastName}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {customer.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">
                                ${customer.totalSpend.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-400">
                                Total Spend
                              </p>
                            </div>
                          </li>
                        ))}
                    </ul>
                    {customersBySpend.length > 5 && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowAll(!showAll)}
                          className="text-sm text-[#F2613F] hover:underline"
                        >
                          {showAll ? "Show Less" : "Show More"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No customer spending data available yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
