import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { getSessionUser } from "../utils/session";

export default function TopHeader({ title = "Dashboard", onToggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(getSessionUser());
    const dropdownRef = useRef(null);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = searchTerm.trim();
        if (!q) return;

        const path = location.pathname;
        if (path.includes("/customers")) {
            navigate(`/customers?search=${encodeURIComponent(q)}`);
        } else if (path.includes("/categories")) {
            navigate(`/categories?search=${encodeURIComponent(q)}`);
        } else if (path.includes("/staff")) {
            navigate(`/staff?search=${encodeURIComponent(q)}`);
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

            <form className="header-search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search products, customers, categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-submit-btn" title="Search">
                    <i className="bi bi-search search-icon"></i>
                </button>
            </form>

            <div className="header-actions" ref={dropdownRef}>
                <button
                    type="button"
                    className="header-icon-btn"
                    title="Notifications"
                >
                    <i className="bi bi-bell"></i>
                    <span className="badge-dot"></span>
                </button>

                <div
                    className="theme-toggle"
                    title="Toggle Light/Dark Theme"
                >
                    <div className="toggle-handle">
                        <i className="bi bi-brightness-high"></i>
                    </div>
                </div>

                <div className="user-profile-relative">
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
                            <img src={user.profileImage || user.avatar} alt={user.name} className="header-avatar-img" />
                        ) : (
                            <span className="avatar-initial">{user.initials}</span>
                        )}
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
