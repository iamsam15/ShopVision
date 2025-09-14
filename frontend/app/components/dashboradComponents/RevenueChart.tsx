"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface ChartData {
  date: string;
  revenue: number;
}

export function RevenueChart({ data }: { data: ChartData[] }) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 0, left: -10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F2613F" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F2613F" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(155, 57, 34, 0.3)"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#a0aec0" }}
            stroke="rgba(155, 57, 34, 0.5)"
          />
          <YAxis
            tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
            tick={{ fill: "#a0aec0" }}
            stroke="rgba(155, 57, 34, 0.5)"
          />
          <Tooltip
            formatter={(value: ValueType) => {
              const numeric = typeof value === "number" ? value : Number(value);
              const display = Number.isFinite(numeric)
                ? `$${numeric.toFixed(2)}`
                : `$${value}`;
              return [display, "Revenue"];
            }}
            cursor={{
              stroke: "#F2613F",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            contentStyle={{
              backgroundColor: "rgba(12, 12, 12, 0.8)",
              borderColor: "rgba(155, 57, 34, 0.5)",
              color: "#ffffff",
            }}
            labelStyle={{ color: "#a0aec0" }}
          />
          <Legend wrapperStyle={{ color: "#e2e8f0", paddingTop: "10px" }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#F2613F"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Daily Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
