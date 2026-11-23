import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
    getStoredAdminNotifications,
    setStoredAdminNotifications,
    getAdminUnreadCount,
    getCategoryCounts,
    markAdminNotificationAsRead,
    markAllAdminNotificationsAsRead,
    deleteAdminNotification,
    clearAllAdminNotifications,
    addAdminNotification,
    getSeverityDetails,
    formatRelativeTime,
    DEFAULT_ADMIN_NOTIFICATIONS
} from "../../src/utils/adminNotifications.js";

// Mock localStorage for Node test runner
const memoryStore = new Map();
global.localStorage = {
    getItem: (key) => memoryStore.get(key) || null,
    setItem: (key, val) => memoryStore.set(key, String(val)),
    removeItem: (key) => memoryStore.delete(key),
    clear: () => memoryStore.clear()
};

describe("Unit: Admin Notifications Engine & Store", () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test("getStoredAdminNotifications initializes with default alerts on first access", () => {
        const notifs = getStoredAdminNotifications();
        assert.ok(Array.isArray(notifs));
        assert.equal(notifs.length, DEFAULT_ADMIN_NOTIFICATIONS.length);
        assert.ok(notifs[0].id);
        assert.ok(notifs[0].category);
    });

    test("getAdminUnreadCount computes unread alerts accurately", () => {
        const notifs = getStoredAdminNotifications();
        const expected = notifs.filter(n => !n.isRead).length;
        assert.equal(getAdminUnreadCount(), expected);
    });

    test("getCategoryCounts accurately groups notifications by category", () => {
        const counts = getCategoryCounts();
        assert.ok(typeof counts.all === "number");
        assert.ok(typeof counts.orders === "number");
        assert.ok(typeof counts.stock === "number");
        assert.ok(typeof counts.users === "number");
        assert.ok(typeof counts.support === "number");
        assert.equal(counts.all, DEFAULT_ADMIN_NOTIFICATIONS.length);
        assert.equal(counts.all, counts.orders + counts.stock + counts.users + counts.support);
    });

    test("markAdminNotificationAsRead updates a specific item to read", () => {
        const initial = getStoredAdminNotifications();
        const unreadItem = initial.find(n => !n.isRead);
        assert.ok(unreadItem, "There should be at least one unread default item");

        markAdminNotificationAsRead(unreadItem.id);
        const updated = getStoredAdminNotifications();
        const target = updated.find(n => n.id === unreadItem.id);
        assert.equal(target.isRead, true);
    });

    test("markAllAdminNotificationsAsRead marks all alerts as read", () => {
        markAllAdminNotificationsAsRead();
        assert.equal(getAdminUnreadCount(), 0);
        const list = getStoredAdminNotifications();
        assert.ok(list.every(n => n.isRead));
    });

    test("deleteAdminNotification removes item from state", () => {
        const initial = getStoredAdminNotifications();
        const targetId = initial[0].id;
        deleteAdminNotification(targetId);

        const list = getStoredAdminNotifications();
        assert.equal(list.length, initial.length - 1);
        assert.equal(list.some(n => n.id === targetId), false);
    });

    test("clearAllAdminNotifications wipes all items", () => {
        clearAllAdminNotifications();
        const list = getStoredAdminNotifications();
        assert.equal(list.length, 0);
        assert.equal(getAdminUnreadCount(), 0);
    });

    test("addAdminNotification prepends item and prevents duplicates", () => {
        const newNotif = {
            id: "NOTIF-TEST-999",
            type: "stock_out",
            category: "stock",
            title: "Out of Stock: Test Widget",
            message: "0 units left.",
            severity: "danger",
            entityId: "PROD-TEST-1"
        };
        const updated = addAdminNotification(newNotif);
        assert.equal(updated[0].id, "NOTIF-TEST-999");
        assert.equal(updated[0].isRead, false);

        // Attempting to re-add duplicate must not duplicate
        const retry = addAdminNotification(newNotif);
        assert.equal(retry.length, updated.length);
    });

    test("getSeverityDetails maps types to appropriate icons and styling", () => {
        const stockOut = getSeverityDetails("stock_out", "danger");
        assert.equal(stockOut.color, "#ef4444");
        assert.ok(stockOut.icon.includes("octagon"));

        const stockLow = getSeverityDetails("stock_low", "warning");
        assert.equal(stockLow.color, "#f59e0b");
        assert.ok(stockLow.icon.includes("triangle"));

        const order = getSeverityDetails("order", "success");
        assert.equal(order.color, "#10b981");
        assert.ok(order.icon.includes("bag"));

        const user = getSeverityDetails("user", "info");
        assert.equal(user.color, "#3b82f6");
        assert.ok(user.icon.includes("person"));

        const support = getSeverityDetails("support", "info");
        assert.equal(support.color, "#8b5cf6");
        assert.ok(support.icon.includes("headset"));
    });

    test("formatRelativeTime formats relative strings accurately", () => {
        assert.equal(formatRelativeTime(""), "Just now");
        assert.equal(formatRelativeTime(null), "Just now");
        const nowIso = new Date().toISOString();
        assert.equal(formatRelativeTime(nowIso), "Just now");
    });
});
