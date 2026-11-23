import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import AdminNotificationDropdown from "./AdminNotificationDropdown";
import { getSessionUser } from "../utils/session";
import productService from "../services/productService";
import customerService from "../services/customerService";
import adminNotificationService from "../services/adminNotificationService";
import { getAdminUnreadCount, ADMIN_NOTIF_EVENT } from "../utils/adminNotifications";
import { getStoredTheme, toggleTheme } from "../utils/theme";

export default function TopHeader({ title = "Dashboard", onToggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [theme, setTheme] = useState(getStoredTheme());
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifUnreadCount, setNotifUnreadCount] = useState(() => getAdminUnreadCount());
    const [user, setUser] = useState(getSessionUser());
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const searchRef = useRef(null);

    // Live search query for products with 250ms debounce
    useEffect(() => {
        const term = searchTerm.trim();
        if (term.length < 2) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        let isMounted = true;
        setIsSearching(true);
        const timer = setTimeout(async () => {
            try {
                if (location.pathname.startsWith("/customers")) {
                    const res = await customerService.searchCustomer(term);
                    if (!isMounted) return;
                    setSuggestions(res.success && Array.isArray(res.data) ? res.data.slice(0, 5).map(c => ({
                        product_id: c.customerId || c.id,
                        product_name: c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim(),
                        product_price: c.emailAddress || c.email || ""
                    })) : []);
                } else if (location.pathname.startsWith("/orders") || location.pathname.startsWith("/staffs")) {
                    setSuggestions([]);
                } else {
                    const res = await productService.searchProduct(term);
                    if (!isMounted) return;
                    if (res.success && Array.isArray(res.data)) {
                        setSuggestions(res.data.slice(0, 5));
                    } else {
                        setSuggestions([]);
                    }
                }
            } catch (err) {
                if (isMounted) setSuggestions([]);
            } finally {
                if (isMounted) setIsSearching(false);
            }
        }, 250);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [searchTerm]);

    // Close suggestions on route change
    useEffect(() => {
        setShowSuggestions(false);
    }, [location.pathname]);

    const handleSearchSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setShowSuggestions(false);
        const q = searchTerm.trim();
        if (!q) return;

        const path = location.pathname;
        if (path.includes("/customers")) {
            navigate(`/customers?search=${encodeURIComponent(q)}`);
        } else if (path.includes("/categories")) {
            navigate(`/categories?search=${encodeURIComponent(q)}`);
        } else if (path.includes("/staff")) {
            navigate(`/staffs?search=${encodeURIComponent(q)}`);
        } else if (path.includes("/orders")) {
            navigate(`/orders?search=${encodeURIComponent(q)}`);
        } else {
            navigate(`/products?search=${encodeURIComponent(q)}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        const handleNotifUpdate = (e) => {
            setNotifUnreadCount(getAdminUnreadCount(e?.detail));
        };
        const handleSessionUpdate = () => {
            setUser(getSessionUser());
        };
        const handleThemeUpdate = (e) => {
            setTheme(e?.detail?.theme || getStoredTheme());
        };
        const handleWindowFocus = async () => {
            const res = await adminNotificationService.getUnreadCount();
            if (res?.success && typeof res.unreadCount === "number") {
                setNotifUnreadCount(res.unreadCount);
            }
        };

        // Poll unread count every 45s
        const pollInterval = setInterval(handleWindowFocus, 45000);

        document.addEventListener("click", handleClickOutside);
        window.addEventListener("tradeflow_session_update", handleSessionUpdate);
        window.addEventListener("tradeflow_theme_update", handleThemeUpdate);
        window.addEventListener(ADMIN_NOTIF_EVENT, handleNotifUpdate);
        window.addEventListener("focus", handleWindowFocus);

        return () => {
            clearInterval(pollInterval);
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("tradeflow_session_update", handleSessionUpdate);
            window.removeEventListener("tradeflow_theme_update", handleThemeUpdate);
            window.removeEventListener(ADMIN_NOTIF_EVENT, handleNotifUpdate);
            window.removeEventListener("focus", handleWindowFocus);
        };
    }, []);

    return (
        <header className="top-header">
            <div className="top-header-left">
                {onToggleSidebar && (
                    <button
                        type="button"
                        className="mobile-hamburger-btn"
                        onClick={onToggleSidebar}
                        title="Toggle Navigation Menu"
                        aria-label="Toggle Navigation Menu"
                    >
                        <i className="bi bi-list"></i>
                    </button>
                )}
                <h2 className="page-title">{title}</h2>
            </div>

            <div className="admin-search-wrapper" ref={searchRef}>
                <form className="header-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products, orders, customers..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => {
                            if (searchTerm.trim().length >= 2) setShowSuggestions(true);
                        }}
                    />
                    <button type="submit" className="search-submit-btn" title="Search">
                        {isSearching ? (
                            <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px", color: "#64748b" }} role="status"></span>
                        ) : (
                            <i className="bi bi-search search-icon"></i>
                        )}
                    </button>
                </form>

                {/* Live Autocomplete Suggestions Dropdown for Admin */}
                {showSuggestions && searchTerm.trim().length >= 2 && (
                    <div className="admin-search-dropdown-popup">
                        {isSearching ? (
                            <div className="cust-search-dropdown-loading">
                                <span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px", color: "#143526" }} role="status"></span>
                                <span>Searching live inventory &amp; records...</span>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="cust-search-dropdown-list">
                                <div className="cust-search-dropdown-header">
                                    <span>MATCHING PRODUCTS ({suggestions.length})</span>
                                </div>
                                {suggestions.map((item) => {
                                    const id = item.product_id || item.productId || item.id;
                                    const img = item.image_url || item.image || item.imageUrl;
                                    const price = Number(item.product_price || item.price || 0);
                                    return (
                                        <div
                                            key={id}
                                            className="cust-search-dropdown-row"
                                            onClick={() => {
                                                setShowSuggestions(false);
                                                navigate(`/products?search=${encodeURIComponent(item.product_name || item.name || "")}`);
                                            }}
                                            style={{ cursor: "pointer" }}
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
                                                    <span className="cust-search-item-cat">{item.categories_name || "Product"}</span>
                                                    <span className="cust-search-item-price">₦ {price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Quick Shortcuts to Orders & Customers */}
                                <div className="admin-search-quick-links">
                                    <button
                                        type="button"
                                        className="admin-search-quick-btn"
                                        onClick={() => {
                                            setShowSuggestions(false);
                                            navigate(`/orders?search=${encodeURIComponent(searchTerm.trim())}`);
                                        }}
                                    >
                                        <i className="bi bi-cart-check"></i>
                                        <span>Search Orders for "{searchTerm.trim()}"</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-search-quick-btn"
                                        onClick={() => {
                                            setShowSuggestions(false);
                                            navigate(`/customers?search=${encodeURIComponent(searchTerm.trim())}`);
                                        }}
                                    >
                                        <i className="bi bi-people"></i>
                                        <span>Search Customers for "{searchTerm.trim()}"</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="cust-search-view-all-btn"
                                    onClick={handleSearchSubmit}
                                >
                                    <span>View all results for "{searchTerm.trim()}"</span>
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="cust-search-dropdown-empty">
                                <div>
                                    <i className="bi bi-search" style={{ marginRight: "6px", color: "#94a3b8" }}></i>
                                    <span>No direct product matches for "{searchTerm.trim()}".</span>
                                </div>
                                <div className="admin-search-empty-shortcuts">
                                    <button
                                        type="button"
                                        className="admin-search-quick-btn"
                                        onClick={() => {
                                            setShowSuggestions(false);
                                            navigate(`/orders?search=${encodeURIComponent(searchTerm.trim())}`);
                                        }}
                                    >
                                        <i className="bi bi-cart-check"></i> Search Orders table
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-search-quick-btn"
                                        onClick={() => {
                                            setShowSuggestions(false);
                                            navigate(`/customers?search=${encodeURIComponent(searchTerm.trim())}`);
                                        }}
                                    >
                                        <i className="bi bi-people"></i> Search Customers table
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="header-actions">
                <div className="admin-notif-trigger-wrap" ref={notifRef}>
                    <button
                        type="button"
                        className={`header-icon-btn ${isNotifOpen ? "active" : ""}`}
                        title="Admin Notifications"
                        aria-label="Admin Notifications"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsNotifOpen(prev => !prev);
                            setIsProfileOpen(false);
                        }}
                    >
                        <i className="bi bi-bell"></i>
                        {notifUnreadCount > 0 && (
                            <span className="admin-bell-badge">
                                {notifUnreadCount > 9 ? "9+" : notifUnreadCount}
                            </span>
                        )}
                    </button>

                    <AdminNotificationDropdown
                        isOpen={isNotifOpen}
                        onClose={() => setIsNotifOpen(false)}
                    />
                </div>

                <div className="user-profile-relative" ref={dropdownRef}>
                    <button
                        type="button"
                        className="user-avatar-btn-trigger"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsProfileOpen(prev => !prev);
                        }}
                        title={`${user.name} Profile`}
                    >
                        {user.profileImage || user.avatar ? (
                            <img 
                                src={user.profileImage || user.avatar} 
                                alt={user.name} 
                                className="header-avatar-img"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const fallback = e.currentTarget.parentElement?.querySelector(".avatar-initial");
                                    if (fallback) fallback.style.display = "flex";
                                }}
                            />
                        ) : null}
                        <span 
                            className="avatar-initial"
                            style={{ display: (user.profileImage || user.avatar) ? "none" : "flex" }}
                        >
                            {user.initials || "U"}
                        </span>
                    </button>

                    <ProfileDropdown
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                        isCustomer={false}
                    />
                </div>
            </div>
        </header>
    );
}
