/**
 * TradeFlow Admin Notification Utilities & Local Store
 * Manages client-side storage, cross-tab synchronization, and fallback seed data
 * for admin operational alerts (orders, out of stock, low stock, users, support tickets).
 */

export const ADMIN_NOTIF_STORAGE_KEY = "tradeflow_admin_notifications";
export const ADMIN_NOTIF_EVENT = "tradeflow_admin_notifications_update";

// Cross-tab synchronization
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === ADMIN_NOTIF_STORAGE_KEY) {
            try {
                const items = e.newValue ? JSON.parse(e.newValue) : [];
                window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT, { detail: items }));
            } catch (err) {
                // Ignore parsing errors from concurrent writes
            }
        }
    });
}

/**
 * Seed notifications used when initializing or when offline
 */
export const DEFAULT_ADMIN_NOTIFICATIONS = [
    {
        id: "NOTIF-105",
        notificationId: "NOTIF-105",
        type: "stock_out",
        category: "stock",
        title: "Out of Stock: Samsung Galaxy A15",
        message: "Item inventory reached 0 units. Customer orders are blocked until restocked.",
        severity: "danger",
        isRead: false,
        entityId: "PROD20261109083122",
        actionLink: "/products?search=Samsung+Galaxy+A15",
        actionText: "Restock Product",
        time: "5 minutes ago",
        createdAt: "2026-11-23 15:06:05"
    },
    {
        id: "NOTIF-104",
        notificationId: "NOTIF-104",
        type: "order",
        category: "orders",
        title: "New Order #ORD20261123104501",
        message: "Quadri Lasisi placed an order for ₦185,000 via Wallet Balance.",
        severity: "success",
        isRead: false,
        entityId: "ORD20261123104501",
        actionLink: "/orders?search=ORD20261123104501",
        actionText: "View Order",
        time: "12 minutes ago",
        createdAt: "2026-11-23 14:59:05"
    },
    {
        id: "NOTIF-103",
        notificationId: "NOTIF-103",
        type: "stock_low",
        category: "stock",
        title: "Low Stock Warning: Nike Air Max",
        message: "Only 3 units remaining in inventory.",
        severity: "warning",
        isRead: false,
        entityId: "PROD20261109083199",
        actionLink: "/products?search=Nike+Air+Max",
        actionText: "Restock Product",
        time: "1 hour ago",
        createdAt: "2026-11-23 14:11:05"
    },
    {
        id: "NOTIF-102",
        notificationId: "NOTIF-102",
        type: "support",
        category: "support",
        title: "New Support Ticket #TCK-849201",
        message: "Quadri Lasisi: 'Orders & Delivery: Delayed shipping status'",
        severity: "info",
        isRead: true,
        entityId: "TCK-849201",
        actionLink: "/customer-support",
        actionText: "Review Ticket",
        time: "2 hours ago",
        createdAt: "2026-11-23 13:11:05"
    },
    {
        id: "NOTIF-101",
        notificationId: "NOTIF-101",
        type: "user",
        category: "users",
        title: "New Customer Registered",
        message: "Quadri Lasisi (quadri@example.com) created an account.",
        severity: "info",
        isRead: true,
        entityId: "CUST202611200001",
        actionLink: "/customers?search=quadri%40example.com",
        actionText: "View Customer",
        time: "Yesterday",
        createdAt: "2026-11-22 15:11:05"
    }
];

/**
 * Format relative time string from timestamp
 */
export function formatRelativeTime(dateString) {
    if (!dateString) return "Just now";
    try {
        const date = new Date(dateString.replace(" ", "T"));
        if (isNaN(date.getTime())) return dateString;
        const now = new Date();
        const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffSec < 60) return "Just now";
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return `${diffHour}h ago`;
        const diffDay = Math.floor(diffHour / 24);
        if (diffDay === 1) return "Yesterday";
        if (diffDay < 7) return `${diffDay}d ago`;
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
        return dateString;
    }
}

/**
 * Maps notification types and severity to presentation icons and colors
 */
export function getSeverityDetails(type, severity) {
    switch (type) {
        case "stock_out":
            return {
                icon: "bi bi-exclamation-octagon-fill",
                color: "#ef4444",
                bgColor: "#fee2e2",
                badgeClass: "badge-danger",
                label: "Out of Stock"
            };
        case "stock_low":
            return {
                icon: "bi bi-exclamation-triangle-fill",
                color: "#f59e0b",
                bgColor: "#fef3c7",
                badgeClass: "badge-warning",
                label: "Low Stock"
            };
        case "order":
            return {
                icon: "bi bi-bag-check-fill",
                color: "#10b981",
                bgColor: "#d1fae5",
                badgeClass: "badge-success",
                label: "Order"
            };
        case "user":
            return {
                icon: "bi bi-person-plus-fill",
                color: "#3b82f6",
                bgColor: "#dbeafe",
                badgeClass: "badge-info",
                label: "Customer"
            };
        case "support":
            return {
                icon: "bi bi-headset",
                color: "#8b5cf6",
                bgColor: "#ede9fe",
                badgeClass: "badge-purple",
                label: "Support"
            };
        default:
            return {
                icon: "bi bi-bell-fill",
                color: "#64748b",
                bgColor: "#f1f5f9",
                badgeClass: "badge-secondary",
                label: "System"
            };
    }
}

/**
 * Retrieve notifications from local storage (or seed if empty)
 */
export function getStoredAdminNotifications() {
    try {
        if (typeof localStorage !== "undefined") {
            const raw = localStorage.getItem(ADMIN_NOTIF_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
            // Seed initial data
            localStorage.setItem(ADMIN_NOTIF_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_NOTIFICATIONS));
            return DEFAULT_ADMIN_NOTIFICATIONS;
        }
    } catch (e) {
        console.error("Failed to read admin notifications from localStorage:", e);
    }
    return DEFAULT_ADMIN_NOTIFICATIONS;
}

/**
 * Persist notifications to local storage and dispatch cross-tab event
 */
export function setStoredAdminNotifications(notifications) {
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(ADMIN_NOTIF_STORAGE_KEY, JSON.stringify(notifications));
        }
    } catch (e) {
        console.error("Failed to save admin notifications to localStorage:", e);
    }
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT, { detail: notifications }));
    }
}

/**
 * Count total unread admin notifications
 */
export function getAdminUnreadCount(notifications = null) {
    const list = notifications || getStoredAdminNotifications();
    return list.filter(n => !n.isRead).length;
}

/**
 * Calculate count breakdown per category
 */
export function getCategoryCounts(notifications = null) {
    const list = notifications || getStoredAdminNotifications();
    const counts = {
        all: list.length,
        orders: 0,
        stock: 0,
        users: 0,
        support: 0
    };
    list.forEach(n => {
        const cat = (n.category || "").toLowerCase();
        if (cat === "orders" || cat === "order") counts.orders++;
        else if (cat === "stock" || cat === "inventory") counts.stock++;
        else if (cat === "users" || cat === "user" || cat === "customers") counts.users++;
        else if (cat === "support" || cat === "ticket") counts.support++;
    });
    return counts;
}

/**
 * Add a new notification to the top of the list
 */
export function addAdminNotification(item) {
    if (!item) return getStoredAdminNotifications();
    const current = getStoredAdminNotifications();
    const id = item.id || item.notificationId || `NOTIF-${Date.now()}`;
    
    // Prevent duplicate entries by notificationId or entityId+type
    const exists = current.some(n => 
        (n.id === id || n.notificationId === id) || 
        (item.entityId && n.entityId === item.entityId && n.type === item.type)
    );
    if (exists) return current;

    const newNotif = {
        id,
        notificationId: id,
        type: item.type || "order",
        category: item.category || "orders",
        title: item.title || "New Notification",
        message: item.message || "",
        severity: item.severity || "info",
        isRead: false,
        entityId: item.entityId || null,
        actionLink: item.actionLink || "/dashboard",
        actionText: item.actionText || "View Details",
        time: item.time || "Just now",
        createdAt: item.createdAt || new Date().toISOString()
    };

    const updated = [newNotif, ...current].slice(0, 100);
    setStoredAdminNotifications(updated);
    return updated;
}

/**
 * Mark a specific notification as read
 */
export function markAdminNotificationAsRead(id) {
    const current = getStoredAdminNotifications();
    const updated = current.map(n => {
        if (n.id === id || n.notificationId === id) {
            return { ...n, isRead: true };
        }
        return n;
    });
    setStoredAdminNotifications(updated);
    return updated;
}

/**
 * Mark all notifications as read
 */
export function markAllAdminNotificationsAsRead() {
    const current = getStoredAdminNotifications();
    const updated = current.map(n => ({ ...n, isRead: true }));
    setStoredAdminNotifications(updated);
    return updated;
}

/**
 * Delete a specific notification
 */
export function deleteAdminNotification(id) {
    const current = getStoredAdminNotifications();
    const updated = current.filter(n => n.id !== id && n.notificationId !== id);
    setStoredAdminNotifications(updated);
    return updated;
}

/**
 * Clear all notifications
 */
export function clearAllAdminNotifications() {
    setStoredAdminNotifications([]);
    return [];
}
