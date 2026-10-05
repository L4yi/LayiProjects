import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { getSessionUser } from "../utils/session";

export default function CustomerLayout() {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(getSessionUser());
    const profileRef = useRef(null);

    // Auto-close mobile sidebar when navigating routes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        const handleSessionUpdate = () => {
            setUser(getSessionUser());
        };

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("tradeflow_session_update", handleSessionUpdate);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
        };
    }, []);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <section className="customer-portal-section">
            <div className="customer-portal-layout">
                {/* Left Sidebar matching Admin theme & layout */}
                <aside className={`customer-sidebar ${isSidebarOpen ? "open" : ""}`} id="customerSidebar">
                    <div className="customer-sidebar-top">
                        <div className="sidebar-header">
                            <Link to="/customer/dashboard" className="solara-logo" onClick={closeSidebar}>
                                <div className="brand-logo-icon">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <span className="brand-title">TradeFlow</span>
                            </Link>
                            <div className="sidebar-header-actions">
                                <button
                                    type="button"
                                    className="sidebar-toggle-btn desktop-only"
                                    onClick={() => setIsSidebarOpen(prev => !prev)}
                                    title="Toggle Sidebar"
                                >
                                    <i className="bi bi-layout-sidebar-inset"></i>
                                </button>
                                <button
                                    type="button"
                                    className="sidebar-mobile-close-btn mobile-only"
                                    onClick={closeSidebar}
                                    title="Close Navigation"
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                        </div>

                        <nav className="customer-sidebar-nav">
                            <div className="nav-group-title">CUSTOMER MENU</div>
                            <NavLink
                                to="/customer/dashboard"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive && (location.pathname === "/customer/dashboard" || location.pathname === "/customer") ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-grid-1x2-fill"></i>
                                <span>Dashboard</span>
                            </NavLink>

                            <NavLink
                                to="/customer/categories"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-tags"></i>
                                <span>Categories</span>
                            </NavLink>

                            <NavLink
                                to="/customer/cart"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <div className="cart-nav-label-wrap">
                                    <i className="bi bi-cart3"></i>
                                    <span>My Cart</span>
                                </div>
                                <span className="cart-badge-count">1</span>
                            </NavLink>

                            <NavLink
                                to="/customer/settings"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-gear"></i>
                                <span>Settings</span>
                            </NavLink>

                            <Link to="/customer/signin" className="cust-nav-item logout-item" onClick={closeSidebar}>
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Log-Out</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="customer-sidebar-footer">
                        <Link to="/signin" className="admin-switch-btn" title="Switch to Admin Dashboard" onClick={closeSidebar}>
                            <i className="bi bi-shield-lock"></i>
                            <span>Admin Portal</span>
                        </Link>
                    </div>
                </aside>

                {/* Mobile Backdrop Overlay */}
                {isSidebarOpen && (
                    <div
                        className="customer-sidebar-backdrop"
                        onClick={closeSidebar}
                        title="Close Sidebar Overlay"
                    />
                )}

                {/* Main Content Area */}
                <main className="customer-main-area">
                    {/* Top Header matching Admin Portal style & icons */}
                    <header className="customer-top-header">
                        <div className="header-left-title">
                            <button
                                type="button"
                                className="mobile-hamburger-btn"
                                onClick={() => setIsSidebarOpen(prev => !prev)}
                                title="Toggle Navigation Menu"
                                aria-label="Toggle Navigation Menu"
                            >
                                <i className="bi bi-list"></i>
                            </button>
                            <span className="user-portal-tag">USER PORTAL</span>
                            <div className="header-nav-pills">
                                <NavLink
                                    to="/customer/dashboard"
                                    className={({ isActive }) =>
                                        `header-pill-btn ${isActive ? "active" : ""}`
                                    }
                                >
                                    <i className="bi bi-grid-1x2-fill"></i> Dashboard
                                </NavLink>
                                <NavLink
                                    to="/customer/settings"
                                    className={({ isActive }) =>
                                        `header-pill-btn ${isActive ? "active" : ""}`
                                    }
                                >
                                    <i className="bi bi-person-circle"></i> My Profile
                                </NavLink>
                            </div>
                        </div>

                        <div className="header-right-tools" ref={profileRef}>
                            {/* Search bar */}
                            <div className="header-search cust-search-bar">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search products, brands and categories..."
                                />
                                <i className="bi bi-search search-icon"></i>
                            </div>

                            {/* Cart Icon */}
                            <Link to="/customer/cart" className="customer-cart-btn" title="View Cart">
                                <i className="bi bi-cart3"></i>
                                <span className="cart-header-badge">1</span>
                            </Link>

                            {/* Bell Notification */}
                            <button type="button" className="customer-bell-btn" title="Notifications">
                                <i className="bi bi-bell"></i>
                                <span className="bell-badge-dot"></span>
                            </button>

                            {/* Avatar Trigger with Dropdown */}
                            <div className="user-profile-relative">
                                <button
                                    type="button"
                                    className="user-avatar-btn-trigger cust-avatar-trigger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsProfileOpen(prev => !prev);
                                    }}
                                    title={`${user.name} Profile`}
                                >
                                    <span className="avatar-initial">{user.initials}</span>
                                </button>

                                <ProfileDropdown
                                    isOpen={isProfileOpen}
                                    onClose={() => setIsProfileOpen(false)}
                                    isCustomer={true}
                                />
                            </div>
                        </div>
                    </header>

                    {/* Body Content */}
                    <div className="customer-body-content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </section>
    );
}
