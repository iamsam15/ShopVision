"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div
      className="backdrop-blur-sm border rounded-2xl p-6 shadow-lg"
      style={{
        backgroundColor: "rgba(72, 30, 20, 0.3)",
        borderColor: "rgba(155, 57, 34, 0.3)",
      }}
    >
      <p className="text-gray-300 text-sm font-medium uppercase tracking-wider">
        {title}
      </p>
      <p className="text-3xl font-semibold text-white mt-2">{value}</p>
    </div>
  );
}
