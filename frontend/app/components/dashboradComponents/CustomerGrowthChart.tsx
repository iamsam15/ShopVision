"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GrowthData {
  date: string;
  Customers: number;
}

interface CustomerGrowthChartProps {
  data: GrowthData[];
}

export const CustomerGrowthChart: React.FC<CustomerGrowthChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-400">Not enough data to display chart.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis dataKey="date" stroke="#888888" tick={{ fontSize: 12 }} />
          <YAxis
            stroke="#888888"
            tick={{ fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              borderColor: "#2A2A2A",
              color: "#FFFFFF",
            }}
            cursor={{ fill: "rgba(155, 57, 34, 0.2)" }}
          />
          <Legend wrapperStyle={{ color: "#FFFFFF" }} />
          <Line
            type="monotone"
            dataKey="Customers"
            stroke="#F2613F"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
