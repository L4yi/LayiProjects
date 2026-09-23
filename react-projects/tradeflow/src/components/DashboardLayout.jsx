import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

const routeTitles = {
    "/dashboard": "Dashboard",
    "/staffs": "Staffs",
    "/categories": "Categories",
    "/products": "Products",
    "/customers": "Customers",
    "/orders": "Orders",
    "/transactions": "Transactions",
    "/report": "Report",
    "/profile": "Profile"
};

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const title = routeTitles[location.pathname] || "Dashboard";

    return (
        <section className="dashboard-section">
            <div className="dashboard-layout">
                <Sidebar
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen((prev) => !prev)}
                />
                <main className="main-content">
                    <TopHeader title={title} />
                    <Outlet />
                </main>
            </div>
        </section>
    );
}
