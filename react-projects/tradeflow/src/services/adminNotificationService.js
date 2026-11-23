import api from "../api/axios";
import {
    getStoredAdminNotifications,
    setStoredAdminNotifications,
    formatRelativeTime,
    getSeverityDetails,
    getCategoryCounts
} from "../utils/adminNotifications";

/**
 * Normalizes backend notification objects into a consistent shape
 */
function normalizeAdminNotification(item) {
    if (!item) return null;
    const notifId = String(item.notificationId || item.id || item.notification_id || `NOTIF-${Date.now()}`);
    const rawType = (item.type || "").toLowerCase();
    
    // Determine category based on type or category field
    let category = (item.category || "").toLowerCase();
    if (!category || category === "all") {
        if (rawType.includes("order")) category = "orders";
        else if (rawType.includes("stock")) category = "stock";
        else if (rawType.includes("user") || rawType.includes("customer")) category = "users";
        else if (rawType.includes("support") || rawType.includes("ticket")) category = "support";
        else category = "orders";
    }

    // Determine severity
    let severity = item.severity || "info";
    if (rawType === "stock_out") severity = "danger";
    else if (rawType === "stock_low") severity = "warning";
    else if (rawType === "order") severity = "success";

    const isRead = item.isRead === true || item.is_read === 1 || item.is_read === "1" || item.isRead === "1";
    const createdAt = item.createdAt || item.created_at || new Date().toISOString();
    const time = item.time || formatRelativeTime(createdAt);

    return {
        id: notifId,
        notificationId: notifId,
        type: rawType || "order",
        category,
        title: item.title || "Notification",
        message: item.message || "",
        severity,
        isRead,
        entityId: item.entityId || item.entity_id || null,
        actionLink: item.actionLink || item.action_link || "/dashboard",
        actionText: item.actionText || item.action_text || "View Details",
        time,
        createdAt
    };
}

export const adminNotificationService = {
    /**
     * Fetch all notifications from the backend with optional category & status filtering.
     * Falls back to stored local notifications on network failure.
     */
    async fetchAllNotifications({ category = "all", status = "all", limit = 50 } = {}) {
        try {
            const formData = new FormData();
            if (category && category !== "all") formData.append("category", category);
            if (status && status !== "all") formData.append("status", status);
            if (limit) formData.append("limit", String(limit));

            const response = await api.post("admin/notification/fetch-all.php", formData);
            const resData = response?.data;

            if (resData?.success === true && Array.isArray(resData?.data)) {
                const normalized = resData.data.map(normalizeAdminNotification).filter(Boolean);
                // Update local storage cache
                setStoredAdminNotifications(normalized);

                const unreadCount = typeof resData.unreadCount === "number"
                    ? resData.unreadCount
                    : normalized.filter(n => !n.isRead).length;

                const categoryCounts = resData.categoryCounts || getCategoryCounts(normalized);

                return {
                    success: true,
                    data: normalized,
                    unreadCount,
                    categoryCounts,
                    message: resData.message || "ADMIN NOTIFICATIONS FETCHED SUCCESSFULLY"
                };
            }
        } catch (error) {
            console.warn("Backend notification fetch error, using local fallback cache:", error.message);
        }

        // Resilient fallback to local storage
        const cached = getStoredAdminNotifications();
        let filtered = cached;
        if (category && category !== "all") {
            filtered = filtered.filter(n => (n.category || "").toLowerCase() === category.toLowerCase());
        }
        if (status === "unread") {
            filtered = filtered.filter(n => !n.isRead);
        } else if (status === "read") {
            filtered = filtered.filter(n => n.isRead);
        }

        return {
            success: true,
            data: filtered,
            unreadCount: cached.filter(n => !n.isRead).length,
            categoryCounts: getCategoryCounts(cached),
            isFallback: true,
            message: "Notifications loaded from local cache."
        };
    },

    /**
     * Fetch unread badge count via lightweight polling endpoint
     */
    async getUnreadCount() {
        try {
            const response = await api.post("admin/notification/get-unread-count.php");
            if (response?.data?.success === true && typeof response.data.unreadCount === "number") {
                return {
                    success: true,
                    unreadCount: response.data.unreadCount
                };
            }
        } catch (error) {
            // Polling silently falls back to local count
        }
        const cached = getStoredAdminNotifications();
        return {
            success: true,
            unreadCount: cached.filter(n => !n.isRead).length
        };
    },

    /**
     * Mark a specific notification or all notifications as read
     * @param {string} notificationId - specific ID or "all"
     */
    async markAsRead(notificationId) {
        const cleanId = String(notificationId || "").trim();
        if (!cleanId) return { success: false, message: "Notification ID is required." };

        // Optimistically update local cache
        const cached = getStoredAdminNotifications();
        const updated = cached.map(n => {
            if (cleanId === "all" || n.id === cleanId || n.notificationId === cleanId) {
                return { ...n, isRead: true };
            }
            return n;
        });
        setStoredAdminNotifications(updated);

        try {
            const formData = new FormData();
            formData.append("notificationId", cleanId);
            const response = await api.post("admin/notification/mark-read.php", formData);
            if (response?.data?.success) {
                return {
                    success: true,
                    unreadCount: response.data.unreadCount ?? updated.filter(n => !n.isRead).length,
                    message: response.data.message || "Notification marked as read."
                };
            }
        } catch (error) {
            console.warn("Backend mark-read failed, persisted locally:", error.message);
        }

        return {
            success: true,
            unreadCount: updated.filter(n => !n.isRead).length,
            message: "Marked as read locally."
        };
    },

    /**
     * Delete a single notification or all read notifications
     * @param {string} notificationId - specific ID or "all"
     */
    async deleteNotification(notificationId) {
        const cleanId = String(notificationId || "").trim();
        if (!cleanId) return { success: false, message: "Notification ID is required." };

        // Optimistically update local cache
        const cached = getStoredAdminNotifications();
        const updated = cleanId === "all"
            ? []
            : cached.filter(n => n.id !== cleanId && n.notificationId !== cleanId);
        setStoredAdminNotifications(updated);

        try {
            const formData = new FormData();
            formData.append("notificationId", cleanId);
            const response = await api.post("admin/notification/delete-notification.php", formData);
            if (response?.data?.success) {
                return {
                    success: true,
                    unreadCount: response.data.unreadCount ?? updated.filter(n => !n.isRead).length,
                    message: response.data.message || "Notification deleted."
                };
            }
        } catch (error) {
            console.warn("Backend delete-notification failed, removed locally:", error.message);
        }

        return {
            success: true,
            unreadCount: updated.filter(n => !n.isRead).length,
            message: "Notification removed locally."
        };
    }
};

export default adminNotificationService;
