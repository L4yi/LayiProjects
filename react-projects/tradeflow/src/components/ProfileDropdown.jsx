import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSessionUser } from "../utils/session";

export default function ProfileDropdown({ isOpen, onClose, isCustomer = false }) {
    const [user, setUser] = useState(getSessionUser());

    useEffect(() => {
        const handleUpdate = () => {
            setUser(getSessionUser());
        };
        window.addEventListener("tradeflow_session_update", handleUpdate);
        return () => window.removeEventListener("tradeflow_session_update", handleUpdate);
    }, []);

    if (!isOpen) return null;

    const navLinks = isCustomer
        ? [
            { to: "/customer/dashboard", icon: "bi bi-grid-1x2-fill", label: "Dashboard" },
            { to: "/customer/categories", icon: "bi bi-tags", label: "Categories" },
            { to: "/customer/cart", icon: "bi bi-cart3", label: "My Cart" },
            { to: "/customer/settings", icon: "bi bi-person-circle", label: "My Profile" },
            { to: "/customer/settings", icon: "bi bi-gear", label: "Settings" }
        ]
        : [
            { to: "/dashboard", icon: "bi bi-grid-1x2-fill", label: "Dashboard" },
            { to: "/staffs", icon: "bi bi-person-badge", label: "Staffs" },
            { to: "/products", icon: "bi bi-box-seam", label: "Products" },
            { to: "/customers", icon: "bi bi-people", label: "Customers" },
            { to: "/orders", icon: "bi bi-cart-check", label: "Orders" },
            { to: "/transactions", icon: "bi bi-credit-card-2-front", label: "Transactions" },
            { to: "/report", icon: "bi bi-bar-chart-line", label: "Reports" },
            { to: "/profile", icon: "bi bi-gear", label: "Settings" }
        ];

    return (
        <div className="profile-dropdown-card" onClick={(e) => e.stopPropagation()}>
            {/* Header with Avatar & Details */}
            <div className="profile-card-header">
                <div className="profile-initial-badge">
                    {user.initials}
                </div>
                <div className="profile-user-info">
                    <div className="profile-user-name">{user.name}</div>
                    <div className="profile-user-email">{user.email}</div>
                    <div className="profile-user-phone">{user.phone}</div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="profile-card-menu">
                {navLinks.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item.to}
                        className="profile-menu-link"
                        onClick={onClose}
                    >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* Logout Button */}
            <div className="profile-card-footer">
                <Link
                    to={isCustomer ? "/customer/signin" : "/signin"}
                    className="profile-logout-pill-btn"
                    onClick={onClose}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Log-Out</span>
                </Link>
            </div>
        </div>
    );
}
