"use client";

import { useState, useMemo } from "react";
import { useDashboard } from "../../dashboard/DashboardContext";
import { RevenueChart } from "../dashboradComponents/RevenueChart";
import { subDays, format, eachDayOfInterval, startOfDay } from "date-fns";
import { RepeatVsFirstTimeChart } from "../dashboradComponents/RepeatVsFirstTimeChart";
import { AbandonedCartPieChart } from "../dashboradComponents/AbandonedCartPieChart";

const TIME_RANGES = [7, 30, 90];

export default function InsightsPageContent() {
  const { selectedTenant } = useDashboard();
  const [timeRange, setTimeRange] = useState<number>(7);

  const chartData = useMemo(() => {
    if (!selectedTenant) return [];
    const { orders } = selectedTenant;
    const endDate = startOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, timeRange - 1));
    const dailyRevenueMap = new Map<string, number>();
    const interval = eachDayOfInterval({ start: startDate, end: endDate });
    interval.forEach((day) => {
      dailyRevenueMap.set(format(day, "MMM dd"), 0);
    });
    orders
      .filter((order) => new Date(order.createdAt) >= startDate)
      .forEach((order) => {
        const date = format(new Date(order.createdAt), "MMM dd");
        const currentRevenue = dailyRevenueMap.get(date) || 0;
        dailyRevenueMap.set(date, currentRevenue + order.totalPrice);
      });
    return Array.from(dailyRevenueMap, ([date, revenue]) => ({
      date,
      revenue,
    }));
  }, [selectedTenant, timeRange]);

  const repeatVsFirstTimeData = useMemo(() => {
    if (!selectedTenant) return [];
    const { orders } = selectedTenant;
    const orderCounts: Record<string, number> = {};
    orders.forEach((order) => {
      if (order.customer && order.customer.id) {
        orderCounts[order.customer.id] =
          (orderCounts[order.customer.id] || 0) + 1;
      }
    });
    let repeat = 0;
    let firstTime = 0;
    let repeatRevenue = 0;
    let firstTimeRevenue = 0;
    orders.forEach((order) => {
      if (order.customer && order.customer.id) {
        if (orderCounts[order.customer.id] > 1) {
          repeat++;
          repeatRevenue += order.totalPrice;
        } else {
          firstTime++;
          firstTimeRevenue += order.totalPrice;
        }
      }
    });
    return [
      {
        label: "First-Time Customers",
        value: firstTime,
        revenue: firstTimeRevenue,
      },
      { label: "Repeat Customers", value: repeat, revenue: repeatRevenue },
    ];
  }, [selectedTenant]);

  const abandonedCartData = useMemo(() => {
    if (!selectedTenant?.checkouts) return [];
    const completedCheckouts = selectedTenant.checkouts.filter(
      (c) => c.isCompleted
    ).length;
    const abandonedCheckouts = selectedTenant.checkouts.filter(
      (c) => !c.isCompleted
    ).length;
    return [
      {
        label: "Completed",
        value: completedCheckouts,
        color: "#48BB78",
      },
      {
        label: "Abandoned",
        value: abandonedCheckouts,
        color: "#F56565",
      },
    ];
  }, [selectedTenant]);

  return (
    <div className="min-h-screen w-full p-6 lg:p-10 relative bg-[#0C0C0C]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[450px] h-[450px] bg-[#481E14] rounded-full blur-[140px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#9B3922] rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative space-y-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Store Insights
        </h1>

        {!selectedTenant ? (
          <div className="mx-auto max-w-lg text-center p-10 rounded-2xl shadow-xl backdrop-blur-lg border border-white/10 bg-white/5">
            <h2 className="text-2xl font-semibold text-white">
              No Store Selected
            </h2>
            <p className="text-gray-400 mt-2">
              Please select a store to view its metrics.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl p-6 shadow-xl backdrop-blur-lg border border-white/10 bg-white/5 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Daily Revenue
                </h2>
                <div className="flex space-x-2 bg-white/10 rounded-lg p-1">
                  {TIME_RANGES.map((days) => (
                    <button
                      key={days}
                      onClick={() => setTimeRange(days)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                        timeRange === days
                          ? "bg-[#9B3922] text-white"
                          : "text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      Last {days} Days
                    </button>
                  ))}
                </div>
              </div>
              <RevenueChart data={chartData} />
            </div>

            <div className="rounded-2xl p-6 shadow-xl backdrop-blur-lg border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold text-white mb-6">
                Customer Breakdown
              </h2>
              <RepeatVsFirstTimeChart data={repeatVsFirstTimeData} />
            </div>

            <div className="rounded-2xl p-6 shadow-xl backdrop-blur-lg border border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold text-white mb-6">
                Checkout Performance
              </h2>
              <AbandonedCartPieChart data={abandonedCartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
