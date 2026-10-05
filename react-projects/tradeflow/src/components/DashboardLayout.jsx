import React, { useState, useEffect } from "react";
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

    // Auto-close sidebar on route change on mobile
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const title = routeTitles[location.pathname] || "Dashboard";

    return (
        <section className="dashboard-section">
            <div className="dashboard-layout">
                <Sidebar
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen((prev) => !prev)}
                    onClose={() => setSidebarOpen(false)}
                />
                {sidebarOpen && (
                    <div
                        className="sidebar-backdrop"
                        onClick={() => setSidebarOpen(false)}
                        title="Close Sidebar Overlay"
                    />
                )}
                <main className="main-content">
                    <TopHeader
                        title={title}
                        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                    />
                    <Outlet />
                </main>
            </div>
        </section>
    );
}
