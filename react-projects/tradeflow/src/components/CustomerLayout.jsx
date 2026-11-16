import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { BrandLogo } from "./common";
import { getSessionUser } from "../utils/session";
import { getCartCount } from "../utils/cart";
import productService from "../services/productService";

export default function CustomerLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [headerSearch, setHeaderSearch] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchingHeader, setIsSearchingHeader] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(getSessionUser());
    const [cartCount, setCartCount] = useState(getCartCount());
    const profileRef = useRef(null);
    const searchContainerRef = useRef(null);

    // Auto-close mobile sidebar and search suggestions when navigating routes
    useEffect(() => {
        setIsSidebarOpen(false);
        setShowSuggestions(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        const handleSessionUpdate = () => {
            setUser(getSessionUser());
        };
        const handleCartUpdate = () => {
            setCartCount(getCartCount());
        };

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        window.addEventListener("tradeflow_cart_update", handleCartUpdate);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
            window.removeEventListener("tradeflow_cart_update", handleCartUpdate);
        };
    }, []);

    // Live backend product search query for header search autocomplete
    useEffect(() => {
        const term = headerSearch.trim();
        if (term.length < 2) {
            setSearchSuggestions([]);
            setIsSearchingHeader(false);
            return;
        }

        let isMounted = true;
        setIsSearchingHeader(true);
        const timer = setTimeout(async () => {
            try {
                // Call live backend endpoint: admin/product/search-product.php
                const res = await productService.searchProduct(term);
                if (!isMounted) return;
                if (res.success && Array.isArray(res.data)) {
                    setSearchSuggestions(res.data.slice(0, 5));
                } else {
                    setSearchSuggestions([]);
                }
            } catch (err) {
                console.error("Header backend search error:", err);
                if (isMounted) setSearchSuggestions([]);
            } finally {
                if (isMounted) setIsSearchingHeader(false);
            }
        }, 250);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [headerSearch]);

    const closeSidebar = () => setIsSidebarOpen(false);

    const handleSearchSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setShowSuggestions(false);
        const q = headerSearch.trim();
        if (q) {
            navigate(`/customer/products?search=${encodeURIComponent(q)}`);
        } else {
            navigate("/customer/products");
        }
    };

    return (
        <section className="customer-portal-section">
            <div className="customer-portal-layout">
                {/* Left Sidebar matching Admin theme & layout */}
                <aside className={`customer-sidebar ${isSidebarOpen ? "open" : ""}`} id="customerSidebar">
                    <div className="customer-sidebar-top">
                        <div className="sidebar-header">
                            <BrandLogo to="/customer/dashboard" onClick={closeSidebar} />
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
                                    `cust-nav-item ${isActive || location.pathname.startsWith("/customer/category/") ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-tags"></i>
                                <span>Categories</span>
                            </NavLink>

                            <NavLink
                                to="/customer/products"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive || location.pathname.startsWith("/customer/product/") ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-box-seam"></i>
                                <span>Products</span>
                            </NavLink>

                            <NavLink
                                to="/customer/orders"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-bag-check"></i>
                                <span>Your Orders</span>
                            </NavLink>

                            <NavLink
                                to="/customer/track-order"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-truck"></i>
                                <span>Track Orders</span>
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
                                {cartCount > 0 && (
                                    <span className="cart-badge-count">{cartCount}</span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/customer/wishlist"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-heart"></i>
                                <span>Wishlist</span>
                            </NavLink>

                            <NavLink
                                to="/customer/notifications"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-bell"></i>
                                <span>Notifications</span>
                            </NavLink>

                            <NavLink
                                to="/customer/addresses"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-geo-alt"></i>
                                <span>Saved Addresses</span>
                            </NavLink>

                            <NavLink
                                to="/customer/payment-methods"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-credit-card"></i>
                                <span>Payment Methods</span>
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

                            <NavLink
                                to="/customer/support"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <i className="bi bi-headset"></i>
                                <span>Help &amp; Support</span>
                            </NavLink>

                            {/* Divider matching clean reference menu */}
                            <div className="sidebar-menu-separator"></div>

                            <Link to="/customer/signin" className="cust-nav-item logout-item" onClick={closeSidebar}>
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Log-Out</span>
                            </Link>

                            <NavLink
                                to="/customer/settings"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item cust-my-profile-nav ${isActive ? "active" : ""}`
                                }
                            >
                                <div className="nav-profile-left">
                                    <div className="nav-profile-avatar-thumb">
                                        {user.profileImage || user.avatar ? (
                                            <img src={user.profileImage || user.avatar} alt={user.name} />
                                        ) : (
                                            <i className="bi bi-person-circle"></i>
                                        )}
                                    </div>
                                    <span>My Profile</span>
                                </div>
                                <i className="bi bi-arrow-right-short nav-profile-arrow"></i>
                            </NavLink>
                        </nav>
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
                                    to="/customer/products"
                                    className={({ isActive }) =>
                                        `header-pill-btn ${isActive ? "active" : ""}`
                                    }
                                >
                                    <i className="bi bi-box-seam"></i> Products
                                </NavLink>
                                <NavLink
                                    to="/customer/orders"
                                    className={({ isActive }) =>
                                        `header-pill-btn ${isActive ? "active" : ""}`
                                    }
                                >
                                    <i className="bi bi-bag-check"></i> Orders
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
                            {/* Search bar with live backend autocomplete */}
                            <div className="cust-search-wrap-container" ref={searchContainerRef}>
                                <form className="header-search cust-search-bar" onSubmit={handleSearchSubmit}>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search products, brands and categories..."
                                        value={headerSearch}
                                        onChange={(e) => {
                                            setHeaderSearch(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => {
                                            if (headerSearch.trim().length >= 2) setShowSuggestions(true);
                                        }}
                                    />
                                    <button type="submit" className="search-submit-btn" title="Search catalog">
                                        {isSearchingHeader ? (
                                            <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px", color: "#64748b" }} role="status"></span>
                                        ) : (
                                            <i className="bi bi-search search-icon"></i>
                                        )}
                                    </button>
                                </form>

                                {/* Live Autocomplete Suggestions Dropdown */}
                                {showSuggestions && headerSearch.trim().length >= 2 && (
                                    <div className="cust-search-dropdown-popup">
                                        {isSearchingHeader ? (
                                            <div className="cust-search-dropdown-loading">
                                                <span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px", color: "#143526" }} role="status"></span>
                                                <span>Searching backend catalog...</span>
                                            </div>
                                        ) : searchSuggestions.length > 0 ? (
                                            <div className="cust-search-dropdown-list">
                                                <div className="cust-search-dropdown-header">
                                                    <span>MATCHING PRODUCTS ({searchSuggestions.length})</span>
                                                </div>
                                                {searchSuggestions.map((item) => {
                                                    const id = item.product_id || item.productId || item.id;
                                                    const img = item.image_url || item.image || item.imageUrl;
                                                    const price = Number(item.product_price || item.price || 0);
                                                    return (
                                                        <Link
                                                            key={id}
                                                            to={`/customer/product/${id}`}
                                                            className="cust-search-dropdown-row"
                                                            onClick={() => {
                                                                setShowSuggestions(false);
                                                                setHeaderSearch("");
                                                            }}
                                                        >
                                                            <div className="cust-search-thumb-wrap">
                                                                {img ? (
                                                                    <img src={img} alt={item.product_name} />
                                                                ) : (
                                                                    <i className="bi bi-box-seam"></i>
                                                                )}
                                                            </div>
                                                            <div className="cust-search-item-info">
                                                                <span className="cust-search-item-name">{item.product_name || item.name}</span>
                                                                <div className="cust-search-item-sub">
                                                                    <span className="cust-search-item-cat">{item.categories_name || "Catalog"}</span>
                                                                    <span className="cust-search-item-price">₦ {price.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                                <button
                                                    type="button"
                                                    className="cust-search-view-all-btn"
                                                    onClick={handleSearchSubmit}
                                                >
                                                    <span>View all results for "{headerSearch.trim()}"</span>
                                                    <i className="bi bi-arrow-right"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="cust-search-dropdown-empty">
                                                <i className="bi bi-search" style={{ marginRight: "6px", color: "#94a3b8" }}></i>
                                                <span>No products found for "{headerSearch.trim()}"</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Cart Icon */}
                            <Link to="/customer/cart" className="customer-cart-btn" title="View Cart">
                                <i className="bi bi-cart3"></i>
                                {cartCount > 0 && (
                                    <span className="cart-header-badge">{cartCount}</span>
                                )}
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
                                    {user.profileImage || user.avatar ? (
                                        <img src={user.profileImage || user.avatar} alt={user.name} className="header-avatar-img" />
                                    ) : (
                                        <span className="avatar-initial">{user.initials}</span>
                                    )}
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
