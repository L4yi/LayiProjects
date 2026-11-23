import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    getNotifications, 
    setNotifications as saveNotifications,
    mapBackendNotifications,
    markAllNotificationsAsRead, 
    toggleNotificationRead, 
    deleteNotification,
    NOTIFICATION_UPDATE_EVENT 
} from "../../utils/notifications";
import { getSessionUser } from "../../utils/session";
import { customerService } from "../../services/customerService";

export default function CustomerNotifications() {
    const [notifications, setNotifications] = useState(getNotifications);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const handleUpdate = () => {
            setNotifications(getNotifications());
        };
        window.addEventListener(NOTIFICATION_UPDATE_EVENT, handleUpdate);
        window.addEventListener("storage", handleUpdate);

        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            customerService.fetchNotifications(customerId).then(res => {
                if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
                    const mapped = mapBackendNotifications(res.data);
                    saveNotifications(mapped);
                    setNotifications(mapped);
                }
            }).catch(() => {});
        }

        return () => {
            window.removeEventListener(NOTIFICATION_UPDATE_EVENT, handleUpdate);
            window.removeEventListener("storage", handleUpdate);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = notifications.filter(n => {
        if (activeFilter === "all") return true;
        return n.type === activeFilter;
    });

    const handleMarkAllRead = async () => {
        setIsMarkingAll(true);
        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            try {
                await customerService.markNotificationRead(customerId, null, 1);
            } catch (err) {
                console.warn("Backend mark all read fallback:", err);
            }
        }
        markAllNotificationsAsRead();
        setIsMarkingAll(false);
    };

    const handleToggleRead = async (id) => {
        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            try {
                await customerService.markNotificationRead(customerId, id, 0);
            } catch (err) {
                console.warn("Backend mark notification read fallback:", err);
            }
        }
        toggleNotificationRead(id);
    };

    const handleDeleteNotification = (id) => {
        setDeletingId(id);
        setTimeout(() => {
            deleteNotification(id);
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
                                        <span className="notif-timestamp">{n.time}</span>
                                    </div>

                                    <p className="notif-message-text">{n.message}</p>

                                    <div className="notif-actions-bottom" onClick={(e) => e.stopPropagation()}>
                                        {n.actionLink && (
                                            <Link to={n.actionLink} className="notif-action-cta">
                                                <span>{n.actionText || "View Details"}</span>
                                                <i className="bi bi-arrow-right-short"></i>
                                            </Link>
                                        )}

                                        <div className="notif-utility-btns">
                                            <button
                                                type="button"
                                                className="btn-notif-toggle-read"
                                                onClick={() => handleToggleRead(n.id)}
                                                title={n.isRead ? "Mark as unread" : "Mark as read"}
                                            >
                                                <i className={`bi ${n.isRead ? "bi-envelope" : "bi-envelope-open"}`}></i>
                                                <span>{n.isRead ? "Mark Unread" : "Mark Read"}</span>
                                            </button>

                                            <button
                                                type="button"
                                                className="btn-notif-delete"
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-notifications-state">
                        <div className="empty-notif-icon">
                            <i className="bi bi-bell-slash"></i>
                        </div>
                        <h3>No Notifications Found</h3>
                        <p>You have no activity alerts in this category at this moment.</p>
                        <button
                            type="button"
                            className="btn-customer-primary mt-12"
                            onClick={() => setActiveFilter("all")}
                        >
                            View All Notifications
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
