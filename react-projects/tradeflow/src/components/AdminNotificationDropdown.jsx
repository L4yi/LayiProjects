import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import adminNotificationService from "../services/adminNotificationService";
import {
    getStoredAdminNotifications,
    getAdminUnreadCount,
    getCategoryCounts,
    getSeverityDetails,
    ADMIN_NOTIF_EVENT
} from "../utils/adminNotifications";

const TABS = [
    { id: "all", label: "All", icon: "bi bi-grid-fill" },
    { id: "orders", label: "Orders", icon: "bi bi-bag-check-fill" },
    { id: "stock", label: "Stock", icon: "bi bi-box-seam-fill" },
    { id: "users", label: "Users", icon: "bi bi-people-fill" },
    { id: "support", label: "Support", icon: "bi bi-headset" }
];

export default function AdminNotificationDropdown({ isOpen, onClose }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [activeTab, setActiveTab] = useState("all");
    const [notifications, setNotifications] = useState(getStoredAdminNotifications());
    const [unreadCount, setUnreadCount] = useState(getAdminUnreadCount());
    const [categoryCounts, setCategoryCounts] = useState(getCategoryCounts());
    const [isLoading, setIsLoading] = useState(false);

    // Fetch fresh notifications from backend whenever opened
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        setIsLoading(true);

        adminNotificationService.fetchAllNotifications({ category: activeTab })
            .then(res => {
                if (!isMounted) return;
                if (res.success && Array.isArray(res.data)) {
                    setNotifications(res.data);
                    if (typeof res.unreadCount === "number") setUnreadCount(res.unreadCount);
                    if (res.categoryCounts) setCategoryCounts(res.categoryCounts);
                }
            })
            .catch(err => {
                console.warn("Failed to fetch fresh admin notifications:", err);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, activeTab]);

    // Listen to local / cross-tab storage changes
    useEffect(() => {
        const handleNotifUpdate = (e) => {
            const list = e?.detail || getStoredAdminNotifications();
            setNotifications(list);
            setUnreadCount(getAdminUnreadCount(list));
            setCategoryCounts(getCategoryCounts(list));
        };

        window.addEventListener(ADMIN_NOTIF_EVENT, handleNotifUpdate);
        return () => {
            window.removeEventListener(ADMIN_NOTIF_EVENT, handleNotifUpdate);
        };
    }, []);

    // Escape key listener to close dropdown
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Filter by active tab on client side
    const filteredList = notifications.filter(n => {
        if (activeTab === "all") return true;
        const cat = (n.category || "").toLowerCase();
        if (activeTab === "orders") return cat === "orders" || cat === "order";
        if (activeTab === "stock") return cat === "stock" || cat === "inventory";
        if (activeTab === "users") return cat === "users" || cat === "user" || cat === "customers";
        if (activeTab === "support") return cat === "support" || cat === "ticket";
        return true;
    });

    const handleMarkAllRead = async () => {
        const res = await adminNotificationService.markAsRead("all");
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to clear all admin notifications?")) {
            const res = await adminNotificationService.deleteNotification("all");
            if (res.success) {
                setNotifications([]);
                setUnreadCount(0);
                setCategoryCounts({ all: 0, orders: 0, stock: 0, users: 0, support: 0 });
            }
        }
    };

    const handleItemClick = async (n) => {
        if (!n.isRead) {
            await adminNotificationService.markAsRead(n.id);
        }
        if (n.actionLink) {
            onClose?.();
            navigate(n.actionLink);
        }
    };

    const handleDeleteItem = async (e, id) => {
        e.stopPropagation();
        await adminNotificationService.deleteNotification(id);
        setNotifications(prev => prev.filter(n => n.id !== id && n.notificationId !== id));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <div 
            className="admin-notif-dropdown-menu animate-fadeIn" 
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="admin-notif-header">
                <div className="admin-notif-header-title">
                    <i className="bi bi-bell-fill"></i>
                    <span>Notifications</span>
                    {unreadCount > 0 ? (
                        <span className="admin-notif-unread-pill">{unreadCount} New</span>
                    ) : (
                        <span className="admin-notif-read-pill">All read</span>
                    )}
                </div>
                <div className="admin-notif-header-actions">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            className="admin-notif-btn-action"
                            onClick={handleMarkAllRead}
                            title="Mark all as read"
                        >
                            <i className="bi bi-check2-all"></i>
                            <span>Mark all read</span>
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            type="button"
                            className="admin-notif-btn-clear"
                            onClick={handleClearAll}
                            title="Clear all"
                        >
                            <i className="bi bi-trash3"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="admin-notif-tabs">
                {TABS.map(tab => {
                    const count = categoryCounts[tab.id] || 0;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={`admin-notif-tab ${isActive ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <i className={tab.icon}></i>
                            <span>{tab.label}</span>
                            {count > 0 && (
                                <span className={`admin-notif-tab-badge ${isActive ? "active" : ""}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notification Body List */}
            <div className="admin-notif-body">
                {isLoading ? (
                    <div className="admin-notif-loading">
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Syncing live notifications...</span>
                    </div>
                ) : filteredList.length > 0 ? (
                    filteredList.map((item) => {
                        const styleInfo = getSeverityDetails(item.type, item.severity);
                        return (
                            <div
                                key={item.id}
                                className={`admin-notif-row ${item.isRead ? "read" : "unread"}`}
                                onClick={() => handleItemClick(item)}
                            >
                                <div
                                    className="admin-notif-icon-wrap"
                                    style={{
                                        backgroundColor: styleInfo.bgColor,
                                        color: styleInfo.color
                                    }}
                                >
                                    <i className={styleInfo.icon}></i>
                                </div>

                                <div className="admin-notif-content">
                                    <div className="admin-notif-top">
                                        <div className="admin-notif-title-row">
                                            <span 
                                                className="admin-notif-tag"
                                                style={{
                                                    backgroundColor: styleInfo.bgColor,
                                                    color: styleInfo.color
                                                }}
                                            >
                                                {styleInfo.label}
                                            </span>
                                            <span className="admin-notif-title">{item.title}</span>
                                        </div>
                                        {!item.isRead && <span className="admin-notif-unread-dot" title="Unread"></span>}
                                    </div>

                                    <p className="admin-notif-msg">{item.message}</p>

                                    <div className="admin-notif-footer-row">
                                        <span className="admin-notif-time">
                                            <i className="bi bi-clock"></i> {item.time}
                                        </span>
                                        <div className="admin-notif-actions-group">
                                            {item.actionText && (
                                                <button
                                                    type="button"
                                                    className="admin-notif-cta-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleItemClick(item);
                                                    }}
                                                >
                                                    <span>{item.actionText}</span>
                                                    <i className="bi bi-arrow-right"></i>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="admin-notif-del-btn"
                                                onClick={(e) => handleDeleteItem(e, item.id)}
                                                title="Delete notification"
                                            >
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="admin-notif-empty">
                        <div className="admin-notif-empty-icon">
                            <i className="bi bi-bell-slash"></i>
                        </div>
                        <span className="admin-notif-empty-title">No notifications</span>
                        <p className="admin-notif-empty-desc">
                            {activeTab === "all"
                                ? "You're all caught up! No recent system or store alerts."
                                : `No notifications found under ${activeTab}.`}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="admin-notif-footer">
                <span className="admin-notif-status-indicator">
                    <span className="live-dot"></span> System Live &amp; Monitoring
                </span>
                <button
                    type="button"
                    className="admin-notif-close-btn"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
