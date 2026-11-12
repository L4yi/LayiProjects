import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { BrandLogo } from "./common";
import { getSessionUser } from "../utils/session";
import { 
    canAccessStaffs, 
    canAccessCustomers, 
    canAccessTransactions, 
    canAccessReports 
} from "../utils/permissions";

export default function Sidebar({ isOpen, onToggle, onClose }) {
    const [user, setUser] = useState(getSessionUser());

    useEffect(() => {
        const handleSessionUpdate = () => {
            setUser(getSessionUser());
        };
        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        return () => window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
    }, []);

    const navItems = [
        { to: "/dashboard", icon: "bi bi-grid-1x2-fill", label: "Dashboard", visible: true },
        { to: "/staffs", icon: "bi bi-person-badge", label: "Staffs", visible: canAccessStaffs(user) },
        { to: "/categories", icon: "bi bi-tags", label: "Categories", visible: true },
        { to: "/products", icon: "bi bi-box-seam", label: "Products", visible: true },
        { to: "/customers", icon: "bi bi-people", label: "Customers", visible: canAccessCustomers(user) },
        { to: "/orders", icon: "bi bi-cart-check", label: "Orders", visible: true },
        { to: "/transactions", icon: "bi bi-credit-card-2-front", label: "Transactions", visible: canAccessTransactions(user) },
        { to: "/report", icon: "bi bi-bar-chart-line", label: "Report", visible: canAccessReports(user) },
    ].filter(item => item.visible);

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-header">
                    <BrandLogo to="/dashboard" onClick={onClose} />
                    <div className="sidebar-header-actions">
                        <button
                            type="button"
                            className="sidebar-toggle-btn desktop-only"
                            onClick={onToggle}
                            title="Toggle Sidebar"
                        >
                            <i className="bi bi-layout-sidebar-inset"></i>
                        </button>
                        <button
                            type="button"
                            className="sidebar-mobile-close-btn mobile-only"
                            onClick={onClose || onToggle}
                            title="Close Navigation"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group-title">Main menu</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile-widget">
                    <Link to="/profile" className="user-info-row" title="View Profile" onClick={onClose}>
                        <div className="user-avatar-img" id="dashboardAvatarInitial">
                            {user?.profileImage || user?.avatar ? (
                                <img src={user.profileImage || user.avatar} alt={user.name} className="sidebar-avatar-img" />
                            ) : (
                                user?.initials || "SU"
                            )}
                        </div>
                        <div className="user-text">
                            <span className="user-name" id="dashboardUserName">
                                {user?.name || "Staff User"}
                            </span>
                            <span className="user-email" id="dashboardUserEmail">
                                {user?.email || ""}
                            </span>
                            <span className="user-role-badge" style={{ fontSize: "10.5px", fontWeight: "700", color: "#10b981", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                                {user?.role || "Staff"}
                            </span>
                        </div>
                    </Link>
                    <Link to="/signin" className="logout-icon-btn" title="Sign Out" onClick={onClose}>
                        <i className="bi bi-box-arrow-right"></i>
                    </Link>
                </div>

                <Link to="/profile" className="shop-btn" onClick={onClose}>
                    <div className="shop-left">
                        <i className="bi bi-person-circle"></i>
                        <span>My Profile</span>
                    </div>
                    <i className="bi bi-arrow-right-short" style={{ fontSize: "18px" }}></i>
                </Link>
            </div>
        </aside>
    );
}
