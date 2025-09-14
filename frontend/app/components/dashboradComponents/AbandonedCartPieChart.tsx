// @ts-nocheck
"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="p-3 rounded-lg shadow-xl"
        style={{
          backgroundColor: "rgba(12, 12, 12, 0.9)",
          border: "1px solid rgba(155, 57, 34, 0.7)",
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "#F2613F" }}>
          {data.label}
        </p>
        <p className="text-xs" style={{ color: "#a0aec0" }}>
          {`${data.value} checkouts`}
        </p>
      </div>
    );
  }
  return null;
};

interface AbandonedCartData {
  label: string;
  value: number;
}

const COLORS = ["#F2613F", "#9B3922"]; // Orange + Deep Red (same as reference chart)

export function AbandonedCartPieChart({ data }: { data: AbandonedCartData[] }) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ label, percent }) =>
              `${label} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>

          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            content={<CustomTooltip />}
          />

          <Legend wrapperStyle={{ color: "#e2e8f0", paddingTop: "10px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
