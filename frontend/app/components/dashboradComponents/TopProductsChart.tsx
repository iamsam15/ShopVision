"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProductData {
  name: string;
  sales: number;
}

interface TopProductsChartProps {
  data: ProductData[];
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-400">No product data available.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 30,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis type="number" stroke="#888888" />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#888888"
            width={100}
            tick={{ fontSize: 12 }}
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
          <Bar dataKey="sales" fill="#F2613F" name="Total Sales" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
