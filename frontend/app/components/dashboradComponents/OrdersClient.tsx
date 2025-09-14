"use client";

import React, { useState, useMemo } from "react";
import { Order } from "../../../lib/clientApiService";
import { DateRange } from "react-day-picker";
import { addDays, format, endOfDay } from "date-fns";
import { DatePickerWithRange } from "../DatePicker";

const INITIAL_VISIBLE_COUNT = 6;

export function OrdersClient({
  initialOrders,
}: {
  initialOrders: (Order & { storeUrl: string })[];
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const filteredOrders = useMemo(() => {
    return initialOrders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const toDate = dateRange?.to ? endOfDay(dateRange.to) : undefined;
        if (dateRange?.from && orderDate < dateRange.from) return false;
        if (toDate && orderDate > toDate) return false;
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [initialOrders, dateRange]);

  const displayedOrders = useMemo(() => {
    return filteredOrders.slice(0, visibleCount);
  }, [filteredOrders, visibleCount]);

  const handleShowMore = () => {
    setVisibleCount(filteredOrders.length);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <div
      className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl"
      style={{
        backgroundColor: "rgba(72, 30, 20, 0.3)",
        borderColor: "rgba(155, 57, 34, 0.3)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">All Orders</h2>
        <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "rgba(155, 57, 34, 0.5)" }}
            >
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                CustomerId
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Store
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "rgba(155, 57, 34, 0.3)" }}
          >
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    #{order.id.substring(order.id.length - 7)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    #
                    {order.customer?.id
                      ? order.customer.id.substring(
                          order.customer.id.length - 7
                        )
                      : "--"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {order.storeUrl}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        order.financialStatus === "paid"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {order.financialStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 text-right font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No orders found for the selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* --- "Show More" Button --- */}
      {filteredOrders.length > INITIAL_VISIBLE_COUNT && (
        <div className="text-center mt-6">
          <button
            onClick={
              visibleCount > INITIAL_VISIBLE_COUNT
                ? handleShowLess
                : handleShowMore
            }
            className="text-sm text-[#F2613F] hover:underline"
          >
            {visibleCount > INITIAL_VISIBLE_COUNT ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
