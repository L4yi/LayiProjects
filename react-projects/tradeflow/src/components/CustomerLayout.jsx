import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { BrandLogo } from "./common";
import { getSessionUser } from "../utils/session";
import { getCartCount } from "../utils/cart";
import { getWishlistCount } from "../utils/wishlist";
import { 
    getNotifications, 
    getUnreadCount, 
    markAllNotificationsAsRead, 
    markNotificationAsRead, 
    NOTIFICATION_UPDATE_EVENT 
} from "../utils/notifications";
import productService from "../services/productService";
import { getStoredTheme, toggleTheme } from "../utils/theme";

export default function CustomerLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Theme state
    const [theme, setTheme] = useState(getStoredTheme());

    // Search state
    const [headerSearch, setHeaderSearch] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchingHeader, setIsSearchingHeader] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Dropdowns and UI state
    const [openDropdown, setOpenDropdown] = useState(null); // 'shop' | 'orders' | 'account' | 'notif' | null
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState(getSessionUser());
    const [cartCount, setCartCount] = useState(getCartCount());
    const [wishlistCount, setWishlistCount] = useState(getWishlistCount);

    // Notifications state
    const [notifications, setNotifications] = useState(getNotifications);
    const [unreadCount, setUnreadCount] = useState(getUnreadCount);

    // Sidebar accordion state - default closed
    const [accordions, setAccordions] = useState({
        catalog: false,
        orders: false,
        preferences: false
    });

    // Refs for click outside
    const profileRef = useRef(null);
    const searchContainerRef = useRef(null);
    const headerNavRef = useRef(null);
    const bellDropdownRef = useRef(null);

    // Auto-close dropdowns, sidebar, and search suggestions on route navigation
    useEffect(() => {
        setIsSidebarOpen(false);
        setShowSuggestions(false);
        setOpenDropdown(null);
    }, [location.pathname]);

    // Active route checks for compact header dropdowns
    const isShopActive = location.pathname.startsWith("/customer/product") || 
                         location.pathname.startsWith("/customer/categor");
    const isOrdersActive = location.pathname.startsWith("/customer/order") || 
                           location.pathname.startsWith("/customer/track");
    const isAccountActive = location.pathname.startsWith("/customer/settings") || 
                            location.pathname.startsWith("/customer/address") || 
                            location.pathname.startsWith("/customer/payment") || 
                            location.pathname.startsWith("/customer/support");

    // Click outside handler & global listeners
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Profile dropdown click outside
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            // Search autocomplete click outside
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            // Header navigation dropdowns click outside
            if (headerNavRef.current && !headerNavRef.current.contains(event.target)) {
                if (openDropdown === "shop" || openDropdown === "orders" || openDropdown === "account") {
                    setOpenDropdown(null);
                }
            }
            // Notifications bell dropdown click outside
            if (bellDropdownRef.current && !bellDropdownRef.current.contains(event.target)) {
                if (openDropdown === "notif") {
                    setOpenDropdown(null);
                }
            }
        };

        const handleSessionUpdate = () => {
            setUser(getSessionUser());
        };
        const handleCartUpdate = () => {
            setCartCount(getCartCount());
        };
        const handleWishlistUpdate = () => {
            setWishlistCount(getWishlistCount());
        };
        const handleNotificationsUpdate = () => {
            setNotifications(getNotifications());
            setUnreadCount(getUnreadCount());
        };
        const handleThemeUpdate = (e) => {
            setTheme(e?.detail?.theme || getStoredTheme());
        };

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        window.addEventListener("tradeflow_cart_update", handleCartUpdate);
        window.addEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
        window.addEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationsUpdate);
        window.addEventListener("tradeflow_theme_update", handleThemeUpdate);
        window.addEventListener("storage", handleNotificationsUpdate);
        window.addEventListener("storage", handleWishlistUpdate);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
            window.removeEventListener("tradeflow_cart_update", handleCartUpdate);
            window.removeEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
            window.removeEventListener(NOTIFICATION_UPDATE_EVENT, handleNotificationsUpdate);
            window.removeEventListener("tradeflow_theme_update", handleThemeUpdate);
            window.removeEventListener("storage", handleNotificationsUpdate);
            window.removeEventListener("storage", handleWishlistUpdate);
        };
    }, [openDropdown]);

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

    const toggleDropdown = (name, e) => {
        if (e) e.stopPropagation();
        setOpenDropdown(prev => prev === name ? null : name);
    };

    const toggleAccordion = (section) => {
        setAccordions(prev => ({ ...prev, [section]: !prev[section] }));
    };

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

    const handleMarkAllRead = (e) => {
        if (e) e.stopPropagation();
        markAllNotificationsAsRead();
    };

    const handleNotificationClick = (item) => {
        markNotificationAsRead(item.id);
        setOpenDropdown(null);
        if (item.actionLink || item.link) {
            navigate(item.actionLink || item.link);
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

                            {/* Accordion: Catalog & Shop */}
                            <div className="sidebar-accordion-group">
                                <button
                                    type="button"
                                    className={`accordion-header-btn ${isShopActive ? "group-active" : ""}`}
                                    onClick={() => toggleAccordion("catalog")}
                                >
                                    <div className="acc-header-left">
                                        <i className="bi bi-shop"></i>
                                        <span>Shop &amp; Catalog</span>
                                    </div>
                                    <i className={`bi bi-chevron-down acc-chevron ${accordions.catalog ? "open" : ""}`}></i>
                                </button>
                                {accordions.catalog && (
                                    <div className="accordion-child-links">
                                        <NavLink
                                            to="/customer/products"
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `cust-nav-child-item ${isActive || location.pathname.startsWith("/customer/product/") ? "active" : ""}`
                                            }
                                        >
                                            <i className="bi bi-box-seam"></i>
                                            <span>All Products</span>
                                        </NavLink>
                                        <NavLink
                                            to="/customer/categories"
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `cust-nav-child-item ${isActive || location.pathname.startsWith("/customer/category/") ? "active" : ""}`
                                            }
                                        >
                                            <i className="bi bi-tags"></i>
                                            <span>Categories</span>
                                        </NavLink>
                                    </div>
                                )}
                            </div>

                            {/* Accordion: Orders & Tracking */}
                            <div className="sidebar-accordion-group">
                                <button
                                    type="button"
                                    className={`accordion-header-btn ${isOrdersActive ? "group-active" : ""}`}
                                    onClick={() => toggleAccordion("orders")}
                                >
                                    <div className="acc-header-left">
                                        <i className="bi bi-bag-check"></i>
                                        <span>Orders &amp; Logistics</span>
                                    </div>
                                    <i className={`bi bi-chevron-down acc-chevron ${accordions.orders ? "open" : ""}`}></i>
                                </button>
                                {accordions.orders && (
                                    <div className="accordion-child-links">
                                        <NavLink
                                            to="/customer/orders"
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `cust-nav-child-item ${isActive ? "active" : ""}`
                                            }
                                        >
                                            <i className="bi bi-receipt"></i>
                                            <span>Your Orders</span>
                                        </NavLink>
                                        <NavLink
                                            to="/customer/track-order"
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `cust-nav-child-item ${isActive ? "active" : ""}`
                                            }
                                        >
                                            <i className="bi bi-truck"></i>
                                            <span>Track Orders</span>
                                        </NavLink>
                                    </div>
                                )}
                            </div>

                            {/* Quick Commerce Actions */}
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
                                <div className="cart-nav-label-wrap">
                                    <i className="bi bi-heart"></i>
                                    <span>Wishlist</span>
                                </div>
                                {wishlistCount > 0 && (
                                    <span className="cart-badge-count">{wishlistCount}</span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/customer/notifications"
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `cust-nav-item ${isActive ? "active" : ""}`
                                }
                            >
                                <div className="cart-nav-label-wrap">
                                    <i className="bi bi-bell"></i>
                                    <span>Notifications</span>
                                </div>
                                {unreadCount > 0 && (
                                    <span className="cart-badge-count">{unreadCount}</span>
                                )}
                            </NavLink>

                            {/* Accordion: Preferences & Account */}
                            <div className="sidebar-accordion-group">
                                <button
                                    type="button"
                                    className={`accordion-header-btn ${isAccountActive ? "group-active" : ""}`}
                                    onClick={() => toggleAccordion("preferences")}
                                >
                                    <div className="acc-header-left">
                                        <i className="bi bi-person-gear"></i>
                                        <span>Account Settings</span>
                                    </div>
                                    <i className={`bi bi-chevron-down acc-chevron ${accordions.preferences ? "open" : ""}`}></i>
                                </button>
                                {accordions.preferences && (
                                    <div className="accordion-child-links">
                                        <NavLink
                                            to="/customer/settings"
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `cust-nav-child-item ${isActive ? "active" : ""}`
                                            }
                                        >
                                            <i className="bi bi-gear"></i>
                                            <span>Profile &amp; Security</span>
                                        </NavLink>
                                        <NavLink
                                            to="/customer/addresses"
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `cust-nav-child-item ${isActive ? "active" : ""}`
                                            }
                                        >
                                            <i className="bi bi-geo-alt"></i>
                                            <span>Saved Addresses</span>
                                        </NavLink>
                                        <NavLink
                                            to="/customer/payment-methods"
                                            onClick={closeSidebar}
                                            className={({ isActive }) =>
                                                `cust-nav-child-item ${isActive ? "active" : ""}`
                                            }
                                        >
                                            <i className="bi bi-credit-card"></i>
                                            <span>Payment Methods</span>
                                        </NavLink>
                                    </div>
                                )}
                            </div>

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

                            {/* Divider & Clean User / Signout Row */}
                            <div className="sidebar-menu-separator"></div>

                            {/* Sidebar Theme Toggle */}
                            <button
                                type="button"
                                className="cust-nav-item cust-sidebar-theme-btn"
                                onClick={toggleTheme}
                                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                <i className={`bi ${theme === "dark" ? "bi-moon-stars-fill" : "bi-brightness-high"}`}></i>
                                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                            </button>

                            <Link to="/customer/signin" className="cust-nav-item logout-item" onClick={closeSidebar}>
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Log-Out</span>
                            </Link>
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

                            {/* Compact Click Dropdown Modules */}
                            <div className="header-nav-pills" ref={headerNavRef}>
                                {/* Direct Link: Dashboard */}
                                <NavLink
                                    to="/customer/dashboard"
                                    className={({ isActive }) =>
                                        `header-pill-btn ${isActive ? "active" : ""}`
                                    }
                                >
                                    <i className="bi bi-grid-1x2-fill"></i> Dashboard
                                </NavLink>

                                {/* Dropdown 1: Shop ▾ */}
                                <div className="cust-header-dropdown-wrap">
                                    <button
                                        type="button"
                                        className={`header-pill-btn cust-header-dropdown-btn ${isShopActive ? "active" : ""} ${openDropdown === "shop" ? "open" : ""}`}
                                        onClick={(e) => toggleDropdown("shop", e)}
                                    >
                                        <i className="bi bi-shop"></i>
                                        <span>Shop</span>
                                        <i className={`bi bi-chevron-down pill-chevron ${openDropdown === "shop" ? "rotated" : ""}`}></i>
                                    </button>
                                    {openDropdown === "shop" && (
                                        <div className="cust-header-dropdown-menu animate-fadeIn">
                                            <Link
                                                to="/customer/products"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-box-seam"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">All Products</span>
                                                    <span className="item-sub">Explore full catalog &amp; stock</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/customer/categories"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-tags"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Categories</span>
                                                    <span className="item-sub">Browse by product category</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/customer/products?filter=deals"
                                                className="cust-dropdown-menu-item highlight-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-fire"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Special Deals</span>
                                                    <span className="item-sub">Discounts for verified buyers</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Dropdown 2: Orders ▾ */}
                                <div className="cust-header-dropdown-wrap">
                                    <button
                                        type="button"
                                        className={`header-pill-btn cust-header-dropdown-btn ${isOrdersActive ? "active" : ""} ${openDropdown === "orders" ? "open" : ""}`}
                                        onClick={(e) => toggleDropdown("orders", e)}
                                    >
                                        <i className="bi bi-bag-check"></i>
                                        <span>Orders</span>
                                        <i className={`bi bi-chevron-down pill-chevron ${openDropdown === "orders" ? "rotated" : ""}`}></i>
                                    </button>
                                    {openDropdown === "orders" && (
                                        <div className="cust-header-dropdown-menu animate-fadeIn">
                                            <Link
                                                to="/customer/orders"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-receipt"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Your Orders</span>
                                                    <span className="item-sub">View recent purchases &amp; receipts</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/customer/track-order"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-truck"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Track Orders</span>
                                                    <span className="item-sub">Live courier delivery updates</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Dropdown 3: Account ▾ */}
                                <div className="cust-header-dropdown-wrap">
                                    <button
                                        type="button"
                                        className={`header-pill-btn cust-header-dropdown-btn ${isAccountActive ? "active" : ""} ${openDropdown === "account" ? "open" : ""}`}
                                        onClick={(e) => toggleDropdown("account", e)}
                                    >
                                        <i className="bi bi-person-gear"></i>
                                        <span>Account</span>
                                        <i className={`bi bi-chevron-down pill-chevron ${openDropdown === "account" ? "rotated" : ""}`}></i>
                                    </button>
                                    {openDropdown === "account" && (
                                        <div className="cust-header-dropdown-menu animate-fadeIn">
                                            <Link
                                                to="/customer/settings"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-gear"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Profile &amp; Settings</span>
                                                    <span className="item-sub">Security, password &amp; bio</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/customer/addresses"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-geo-alt"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Saved Addresses</span>
                                                    <span className="item-sub">Shipping &amp; delivery locations</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/customer/payment-methods"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-credit-card"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Payment Methods</span>
                                                    <span className="item-sub">Saved cards &amp; bank accounts</span>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/customer/support"
                                                className="cust-dropdown-menu-item"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                <i className="bi bi-headset"></i>
                                                <div className="dropdown-item-text">
                                                    <span className="item-title">Help &amp; Support</span>
                                                    <span className="item-sub">Submit tickets &amp; contact care</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
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

                            {/* Dark Mode Toggle Button */}
                            <button
                                type="button"
                                className={`customer-theme-toggle ${theme === "dark" ? "active" : ""}`}
                                onClick={toggleTheme}
                                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                                aria-label="Toggle Dark Mode"
                            >
                                <div className="toggle-handle">
                                    <i className={`bi ${theme === "dark" ? "bi-moon-stars-fill" : "bi-brightness-high"}`}></i>
                                </div>
                            </button>

                            {/* Cart Icon */}
                            <Link to="/customer/cart" className="customer-cart-btn" title="View Cart">
                                <i className="bi bi-cart3"></i>
                                {cartCount > 0 && (
                                    <span className="cart-header-badge">{cartCount}</span>
                                )}
                            </Link>

                            {/* Interactive Bell Notification Trigger & Dropdown */}
                            <div className="customer-bell-wrapper" ref={bellDropdownRef}>
                                <button
                                    type="button"
                                    className={`customer-bell-btn ${openDropdown === "notif" ? "active" : ""}`}
                                    title="Notifications"
                                    onClick={(e) => toggleDropdown("notif", e)}
                                >
                                    <i className="bi bi-bell"></i>
                                    {unreadCount > 0 && (
                                        <span className="bell-badge-count">{unreadCount}</span>
                                    )}
                                </button>

                                {openDropdown === "notif" && (
                                    <div className="customer-notif-dropdown-menu animate-fadeIn">
                                        <div className="notif-dropdown-header">
                                            <div className="notif-header-title">
                                                <span>Notifications</span>
                                                {unreadCount > 0 && (
                                                    <span className="unread-counter-badge">{unreadCount} New</span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    type="button"
                                                    className="btn-notif-mark-all-read"
                                                    onClick={handleMarkAllRead}
                                                >
                                                    <i className="bi bi-check2-all"></i> Mark all read
                                                </button>
                                            )}
                                        </div>

                                        <div className="notif-dropdown-body">
                                            {notifications.length > 0 ? (
                                                notifications.slice(0, 4).map((n) => (
                                                    <div
                                                        key={n.id}
                                                        className={`notif-dropdown-row ${n.isRead ? "read" : "unread"}`}
                                                        onClick={() => handleNotificationClick(n)}
                                                    >
                                                        <div
                                                            className="notif-mini-icon"
                                                            style={{ backgroundColor: n.bgColor || "#ecfdf5", color: n.color || "#10b981" }}
                                                        >
                                                            <i className={n.icon || "bi bi-bell"}></i>
                                                        </div>
                                                        <div className="notif-mini-content">
                                                            <div className="notif-mini-top">
                                                                <span className="notif-mini-title">{n.title}</span>
                                                                {!n.isRead && <span className="mini-unread-dot"></span>}
                                                            </div>
                                                            <p className="notif-mini-msg">{n.message}</p>
                                                            <span className="notif-mini-time">{n.time}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="notif-dropdown-empty">
                                                    <i className="bi bi-bell-slash"></i>
                                                    <span>No notifications yet</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="notif-dropdown-footer">
                                            <Link
                                                to="/customer/notifications"
                                                onClick={() => setOpenDropdown(null)}
                                                className="notif-view-all-link"
                                            >
                                                <span>View All Notifications</span>
                                                <i className="bi bi-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

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
