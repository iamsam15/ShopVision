"use client";

import { useDashboard } from "./DashboardContext";
import OrdersPage from "../components/dasboardPages/Orders";
import DashboardOverviewPage from "../components/dasboardPages/Overview";
import ProductsPage from "../components/dasboardPages/Products";
import CustomersPage from "../components/dasboardPages/Customers";
import InsightsPageContent from "../components/dasboardPages/Insights";
import SettingsPage from "../components/dasboardPages/Settings";

export default function DashboardPage() {
  const { activeView } = useDashboard();

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <DashboardOverviewPage />;
      case "orders":
        return <OrdersPage />;
      case "products":
        return <ProductsPage />;
      case "customers":
        return <CustomersPage />;
      case "insights":
        return <InsightsPageContent />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverviewPage />;
    }
  };
  return <>{renderView()}</>;
}
