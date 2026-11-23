// Centralized Notifications State Engine with Cross-Tab Synchronization
const STORAGE_KEY = "tradeflow_notifications";
const NOTIFICATION_UPDATE_EVENT = "tradeflow_notifications_update";

export const INITIAL_NOTIFICATIONS = [
    {
        id: "NOTIF01",
        type: "order",
        icon: "bi bi-truck",
        color: "#10b981",
        bgColor: "#ecfdf5",
        title: "Your Order is In Transit!",
        message: "Order #ORD20261111143445 (Samsung Galaxy A15) has been dispatched with TradeFlow Express Logistics. Estimated arrival is Friday, Nov 20.",
        time: "15 minutes ago",
        timestamp: Date.now() - 15 * 60 * 1000,
        isRead: true,
        read: true,
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
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        isRead: true,
        read: true,
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
        timestamp: Date.now() - 18 * 60 * 60 * 1000,
        isRead: true,
        read: true,
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
        timestamp: Date.now() - 48 * 60 * 60 * 1000,
        isRead: true,
        read: true,
        actionLink: "/customer/orders",
        actionText: "Order Details"
    }
];

export function getNotifications() {
    try {
        if (typeof localStorage !== "undefined") {
            const migrated = localStorage.getItem("tradeflow_notif_migrated_v2");
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const normalized = parsed.map(item => {
                        const isLegacySeed = !migrated && (item.id === "NOTIF01" || item.id === "NOTIF02");
                        const readVal = isLegacySeed ? true : (item.isRead ?? item.read ?? false);
                        return {
                            ...item,
                            isRead: readVal,
                            read: readVal
                        };
                    });
                    if (!migrated) {
                        localStorage.setItem("tradeflow_notif_migrated_v2", "true");
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
                    }
                    return normalized;
                }
            }
        }
    } catch (e) {
        console.error("Failed to parse stored notifications:", e);
    }
    // Initialize defaults on first read
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("tradeflow_notif_migrated_v2", "true");
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        }
    } catch (e) { /* ignore storage error */ }
    return INITIAL_NOTIFICATIONS;
}

export function setNotifications(notifications) {
    try {
        const normalized = notifications.map(item => ({
            ...item,
            isRead: item.isRead ?? item.read ?? false,
            read: item.isRead ?? item.read ?? false
        }));
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event(NOTIFICATION_UPDATE_EVENT));
        }
        return normalized;
    } catch (e) {
        console.error("Failed to save notifications:", e);
        return notifications;
    }
}

export function getUnreadCount() {
    const list = getNotifications();
    return list.filter(item => !item.isRead && !item.read).length;
}

export function markNotificationAsRead(id) {
    const list = getNotifications();
    const updated = list.map(item => item.id === id ? { ...item, isRead: true, read: true } : item);
    return setNotifications(updated);
}

export function toggleNotificationRead(id) {
    const list = getNotifications();
    const updated = list.map(item => {
        if (item.id === id) {
            const current = item.isRead ?? item.read ?? false;
            return { ...item, isRead: !current, read: !current };
        }
        return item;
    });
    return setNotifications(updated);
}

export function markAllNotificationsAsRead() {
    const list = getNotifications();
    const updated = list.map(item => ({ ...item, isRead: true, read: true }));
    return setNotifications(updated);
}

export function deleteNotification(id) {
    const list = getNotifications();
    const updated = list.filter(item => item.id !== id);
    return setNotifications(updated);
}

export function addNotification(notification) {
    const list = getNotifications();
    const newNotif = {
        id: `NOTIF-${Date.now()}`,
        time: "Just now",
        timestamp: Date.now(),
        isRead: false,
        read: false,
        type: "order",
        icon: "bi bi-bell",
        color: "#10b981",
        bgColor: "#ecfdf5",
        ...notification
    };
    const updated = [newNotif, ...list];
    return setNotifications(updated);
}

export function mapBackendNotifications(rawList = []) {
    if (!Array.isArray(rawList)) return [];
    const typeStyleMap = {
        order: { icon: "bi bi-truck", color: "#10b981", bgColor: "#ecfdf5" },
        security: { icon: "bi bi-shield-check", color: "#0284c7", bgColor: "#e0f2fe" },
        promo: { icon: "bi bi-tag", color: "#f59e0b", bgColor: "#fef3c7" }
    };
    return rawList.map((n) => {
        const rawType = String(n.type || "order").toLowerCase();
        const normalizedType =
            rawType === "promo" || rawType.includes("deal")
                ? "promo"
                : rawType === "security" || rawType === "system" || rawType === "account"
                    ? "security"
                    : "order";
        const preset = typeStyleMap[normalizedType];
        const readFlag = !!(n.isRead === 1 || n.isRead === true || n.read === 1 || n.read === true);
        return {
            id: String(n.id || n.notificationId || `NOTIF-${Math.random()}`),
            title: n.title || n.subject || "Notification",
            message: n.message || n.text || "",
            date: n.createdAt || n.date || "Just now",
            time: n.time || n.createdAt || n.date || "Just now",
            type: normalizedType,
            icon: n.icon || preset.icon,
            color: n.color || preset.color,
            bgColor: n.bgColor || preset.bgColor,
            isRead: readFlag,
            read: readFlag,
            actionLink: n.actionLink || (normalizedType === "promo" ? "/customer/products" : normalizedType === "security" ? "/customer/settings" : "/customer/orders"),
            actionText: n.actionText || (normalizedType === "promo" ? "View Catalog" : normalizedType === "security" ? "Review Profile" : "Order Details")
        };
    });
}

export { NOTIFICATION_UPDATE_EVENT };
