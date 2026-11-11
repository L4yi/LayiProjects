import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSessionUser } from "../utils/session";
import { getCartCount } from "../utils/cart";
import authService from "../services/authService";

export default function ProfileDropdown({ isOpen, onClose, isCustomer = false }) {
    const [user, setUser] = useState(getSessionUser());
    const [cartCount, setCartCount] = useState(getCartCount());

    useEffect(() => {
        const handleSessionUpdate = () => {
            setUser(getSessionUser());
        };
        const handleCartUpdate = () => {
            setCartCount(getCartCount());
        };

        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        window.addEventListener("tradeflow_cart_update", handleCartUpdate);

        return () => {
            window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
            window.removeEventListener("tradeflow_cart_update", handleCartUpdate);
        };
    }, []);

    if (!isOpen) return null;

    const adminNavLinks = [
        { to: "/dashboard", icon: "bi bi-grid-1x2-fill", label: "Dashboard" },
        { to: "/staffs", icon: "bi bi-person-badge", label: "Staffs" },
        { to: "/categories", icon: "bi bi-tags", label: "Categories" },
        { to: "/products", icon: "bi bi-box-seam", label: "Products" },
        { to: "/customers", icon: "bi bi-people", label: "Customers" },
        { to: "/orders", icon: "bi bi-cart-check", label: "Orders" },
        { to: "/transactions", icon: "bi bi-credit-card-2-front", label: "Transactions" },
        { to: "/report", icon: "bi bi-bar-chart-line", label: "Reports" },
        { to: "/profile", icon: "bi bi-gear", label: "Settings" }
    ];

    const customerNavLinks = [
        { to: "/customer/dashboard", icon: "bi bi-grid-1x2-fill", label: "Dashboard" },
        { to: "/customer/products", icon: "bi bi-box-seam", label: "Products" },
        { to: "/customer/categories", icon: "bi bi-tags", label: "Categories" },
        { to: "/customer/orders", icon: "bi bi-bag-check", label: "Your Orders" },
        { to: "/customer/cart", icon: "bi bi-cart3", label: "Shopping Cart", badge: cartCount > 0 ? cartCount : null },
        { to: "/customer/settings", icon: "bi bi-gear", label: "Settings" }
    ];

    const navLinks = isCustomer ? customerNavLinks : adminNavLinks;
    const logoutDestination = isCustomer ? "/customer/signin" : "/signin";

    return (
        <div className="profile-dropdown-card" onClick={(e) => e.stopPropagation()}>
            <div className="profile-card-header">
                <div className="profile-initial-badge">
                    {user?.initials || (isCustomer ? "CU" : "SU")}
                </div>
                <div className="profile-user-info">
                    <div className="profile-user-name">{user?.name || (isCustomer ? "Customer" : "Staff Member")}</div>
                    <div className="profile-user-email">{user?.email || (isCustomer ? "customer@tradeflow.com" : "staff@tradeflow.com")}</div>
                    {user?.phone && <div className="profile-user-phone">{user.phone}</div>}
                </div>
            </div>

            <div className="profile-card-menu">
                {navLinks.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item.to}
                        className="profile-menu-link"
                        onClick={onClose}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </div>
                        {item.badge && (
                            <span 
                                className="cart-badge-count" 
                                style={{ 
                                    position: "static", 
                                    marginLeft: "auto",
                                    fontSize: "11px",
                                    minWidth: "18px",
                                    height: "18px",
                                    padding: "0 6px"
                                }}
                            >
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            <div className="profile-card-footer">
                <Link
                    to={logoutDestination}
                    className="profile-logout-pill-btn"
                    onClick={() => {
                        authService.logout();
                        onClose();
                    }}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Log-Out</span>
                </Link>
            </div>
        </div>
    );
}
