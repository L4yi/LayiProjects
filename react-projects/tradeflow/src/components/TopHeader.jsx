import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { getSessionUser } from "../utils/session";

export default function TopHeader({ title = "Dashboard" }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState(getSessionUser());
    const dropdownRef = useRef(null);

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
            <h2 className="page-title">{title}</h2>

            <div className="header-search">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search data, users, or reports"
                />
                <i className="bi bi-search search-icon"></i>
            </div>

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
                        <span className="avatar-initial">{user.initials}</span>
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
