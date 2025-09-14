"use client";
import { Product } from "@/lib/clientApiService";
import { useDashboard } from "../../dashboard/DashboardContext";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { TopProductsChart } from "../dashboradComponents/TopProductsChart";

export default function ProductsPage() {
  const { selectedTenant } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const products = useMemo(
    () => (selectedTenant ? selectedTenant.products : []),
    [selectedTenant]
  );

  const topProductsData = useMemo(() => {
    if (!products) return [];

    return products
      .map((product) => ({
        name: product.title,
        sales:
          product.lineItems?.reduce(
            (total, item) => total + item.quantity,
            0
          ) || 0,
      }))
      .filter((p) => p.sales > 0)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 3);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-6 lg:p-8 relative"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: "#481E14" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-2xl opacity-15"
          style={{ backgroundColor: "#9B3922" }}
        ></div>
      </div>

      <div className="relative w-full">
        {!selectedTenant ? (
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
              Please choose a store to see product data.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div
              className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl"
              style={{
                backgroundColor: "rgba(72, 30, 20, 0.3)",
                borderColor: "rgba(155, 57, 34, 0.3)",
              }}
            >
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-white">All Products</h1>
                <div className="relative w-full sm:w-auto sm:max-w-xs">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title or vendor..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200"
                    style={
                      {
                        backgroundColor: "#481E14",
                        borderColor: "#9B3922",
                        "--tw-ring-color": "#F2613F",
                      } as React.CSSProperties
                    }
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {products.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No products found for this store.
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No products match your search.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((p: Product) => (
                    <div
                      key={p.id.toString()}
                      className="rounded-xl border p-5 shadow-md transition hover:shadow-lg hover:-translate-y-1 duration-200"
                      style={{
                        backgroundColor: "rgba(12, 12, 12, 0.7)",
                        borderColor: "rgba(155, 57, 34, 0.4)",
                      }}
                    >
                      <h2 className="text-lg font-semibold text-white mb-2 truncate">
                        {p.title}
                      </h2>
                      <p className="text-sm text-gray-400 mb-1">
                        Vendor: {p.vendor || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Added: {format(new Date(p.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className="backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow-2xl"
              style={{
                backgroundColor: "rgba(72, 30, 20, 0.3)",
                borderColor: "rgba(155, 57, 34, 0.3)",
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Top Selling Products
              </h2>
              <TopProductsChart data={topProductsData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
