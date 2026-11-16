import React, { useState } from "react";
import { Link } from "react-router-dom";

const INITIAL_NOTIFICATIONS = [
    {
        id: "NOTIF01",
        type: "order",
        icon: "bi bi-truck",
        color: "#10b981",
        bgColor: "#ecfdf5",
        title: "Your Order is In Transit!",
        message: "Order #ORD20261111143445 (Samsung Galaxy A15) has been dispatched with TradeFlow Express Logistics. Estimated arrival is Friday, Nov 20.",
        time: "15 minutes ago",
        isRead: false,
        actionLink: "/customer/track-order?orderId=ORD20261111143445",
        actionText: "Track Package"
    },
    {
        id: "NOTIF02",
        type: "security",
        icon: "bi bi-shield-check",
        color: "#0284c7",
        bgColor: "#e0f2fe",
        title: "Account Profile Verified",
        message: "Your customer identity verification was confirmed. Enjoy zero-limit purchases, live order updates, and priority customer care.",
        time: "2 hours ago",
        isRead: false,
        actionLink: "/customer/settings",
        actionText: "Review Profile"
    },
    {
        id: "NOTIF03",
        type: "promo",
        icon: "bi bi-tag",
        color: "#f59e0b",
        bgColor: "#fef3c7",
        title: "Flash Sales: Up to 15% Off Gadgets",
        message: "Special verified customer discount applied across Mobile Devices and Office Supplies categories for the next 48 hours.",
        time: "Yesterday • 04:30 PM",
        isRead: true,
        actionLink: "/customer/products",
        actionText: "View Catalog"
    },
    {
        id: "NOTIF04",
        type: "order",
        icon: "bi bi-check2-circle",
        color: "#10b981",
        bgColor: "#ecfdf5",
        title: "Order Placed Successfully",
        message: "We received your order #ORD20261111143445. Payment confirmed via Moniepoint Bank Transfer.",
        time: "Nov 16, 2026 • 10:16 AM",
        isRead: true,
        actionLink: "/customer/orders",
        actionText: "Order Details"
    }
];

export default function CustomerNotifications() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === "all") return true;
        return n.type === activeFilter;
    });

    const handleMarkAllRead = () => {
        setIsMarkingAll(true);
        setTimeout(() => {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setIsMarkingAll(false);
        }, 250);
    };

    const handleToggleRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
    };

    const handleDeleteNotification = (id) => {
        setDeletingId(id);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
            setDeletingId(null);
        }, 200);
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Notifications</span>
            </div>

            {/* Notifications Header Panel */}
            <div className="customer-panel-card mb-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-bell-fill"></i>
                        </div>
                        <div>
                            <div className="title-with-badge-row">
                                <h2 className="panel-title">Notifications &amp; Activity Alerts</h2>
                                {unreadCount > 0 && (
                                    <span className="unread-counter-badge">{unreadCount} New</span>
                                )}
                            </div>
                            <p className="panel-subtitle">
                                Live alerts on your package delivery, security, order status, and promotional deals
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <div className="panel-header-actions">
                            <button
                                type="button"
                                className="btn-mark-all-read"
                                onClick={handleMarkAllRead}
                                disabled={isMarkingAll}
                            >
                                {isMarkingAll ? (
                                    <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px", marginRight: "6px" }} role="status"></span>
                                ) : (
                                    <i className="bi bi-check2-all"></i>
                                )}
                                <span>{isMarkingAll ? "Marking..." : "Mark All as Read"}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Pills */}
                <div className="notifications-filter-bar">
                    <button
                        type="button"
                        className={`notif-filter-btn ${activeFilter === "all" ? "active" : ""}`}
                        onClick={() => setActiveFilter("all")}
                    >
                        <span>All</span>
                        <span className="filter-count">({notifications.length})</span>
                    </button>
                    <button
                        type="button"
                        className={`notif-filter-btn ${activeFilter === "order" ? "active" : ""}`}
                        onClick={() => setActiveFilter("order")}
                    >
                        <i className="bi bi-box-seam"></i>
                        <span>Orders</span>
                        <span className="filter-count">({notifications.filter(n => n.type === "order").length})</span>
                    </button>
                    <button
                        type="button"
                        className={`notif-filter-btn ${activeFilter === "security" ? "active" : ""}`}
                        onClick={() => setActiveFilter("security")}
                    >
                        <i className="bi bi-shield-check"></i>
                        <span>Security</span>
                        <span className="filter-count">({notifications.filter(n => n.type === "security").length})</span>
                    </button>
                    <button
                        type="button"
                        className={`notif-filter-btn ${activeFilter === "promo" ? "active" : ""}`}
                        onClick={() => setActiveFilter("promo")}
                    >
                        <i className="bi bi-tag"></i>
                        <span>Promos</span>
                        <span className="filter-count">({notifications.filter(n => n.type === "promo").length})</span>
                    </button>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length > 0 ? (
                    <div className="notifications-feed-list">
                        {filteredNotifications.map((n) => (
                            <div
                                key={n.id}
                                className={`notification-item-row ${n.isRead ? "read" : "unread"}`}
                                onClick={() => handleToggleRead(n.id)}
                            >
                                <div
                                    className="notif-icon-circle"
                                    style={{ backgroundColor: n.bgColor, color: n.color }}
                                >
                                    <i className={n.icon}></i>
                                </div>

                                <div className="notif-content-area">
                                    <div className="notif-top-row">
                                        <h4 className="notif-title">
                                            {!n.isRead && <span className="unread-dot"></span>}
                                            <span>{n.title}</span>
                                        </h4>
                                        <span className="notif-time-text">{n.time}</span>
                                    </div>

                                    <p className="notif-message-text">{n.message}</p>

                                    <div className="notif-bottom-tools" onClick={(e) => e.stopPropagation()}>
                                        {n.actionLink && (
                                            <Link to={n.actionLink} className="notif-action-link">
                                                <span>{n.actionText || "View Details"}</span>
                                                <i className="bi bi-arrow-right-short"></i>
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            className="btn-delete-notif"
                                            onClick={() => handleDeleteNotification(n.id)}
                                            disabled={deletingId === n.id}
                                            title="Delete notification"
                                        >
                                            {deletingId === n.id ? (
                                                <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} role="status"></span>
                                            ) : (
                                                <i className="bi bi-trash3"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="notifications-empty-state">
                        <div className="notif-empty-icon">
                            <i className="bi bi-bell-slash"></i>
                        </div>
                        <h3>No notifications in this category</h3>
                        <p>You are completely up to date! Check back when you place a new order or receive a delivery update.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
