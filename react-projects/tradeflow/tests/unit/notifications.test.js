import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { 
    getNotifications, 
    setNotifications, 
    mapBackendNotifications,
    getUnreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    addNotification,
    INITIAL_NOTIFICATIONS
} from "../../src/utils/notifications.js";

// Mock localStorage for Node test runner
const memoryStore = new Map();
global.localStorage = {
    getItem: (key) => memoryStore.get(key) || null,
    setItem: (key, val) => memoryStore.set(key, String(val)),
    removeItem: (key) => memoryStore.delete(key),
    clear: () => memoryStore.clear()
};

describe("Unit: Notifications Engine", () => {
    beforeEach(() => {
        global.localStorage.clear();
    });

    test("getNotifications initializes with default alerts on first access", () => {
        const notifs = getNotifications();
        assert.ok(Array.isArray(notifs));
        assert.equal(notifs.length, INITIAL_NOTIFICATIONS.length);
        assert.ok(notifs[0].id);
    });

    test("getUnreadCount accurately computes unread items", () => {
        const notifs = getNotifications();
        const expected = notifs.filter(n => !n.isRead && !n.read).length;
        assert.equal(getUnreadCount(), expected);
    });

    test("markNotificationAsRead updates specific item to read", () => {
        const initial = getNotifications();
        const targetId = initial[0].id;
        markNotificationAsRead(targetId);
        
        const updated = getNotifications();
        const target = updated.find(n => n.id === targetId);
        assert.equal(target.isRead, true);
        assert.equal(target.read, true);
    });

    test("markAllNotificationsAsRead marks all alerts as read", () => {
        markAllNotificationsAsRead();
        assert.equal(getUnreadCount(), 0);
        const list = getNotifications();
        assert.ok(list.every(n => n.isRead && n.read));
    });

    test("deleteNotification removes item from state", () => {
        const initial = getNotifications();
        const targetId = initial[0].id;
        const initialCount = initial.length;

        deleteNotification(targetId);
        const updated = getNotifications();
        assert.equal(updated.length, initialCount - 1);
        assert.equal(updated.find(n => n.id === targetId), undefined);
    });

    test("addNotification prepends new notification to top", () => {
        const initialCount = getNotifications().length;
        addNotification({
            title: "Test Alert",
            message: "Unit test message"
        });

        const updated = getNotifications();
        assert.equal(updated.length, initialCount + 1);
        assert.equal(updated[0].title, "Test Alert");
        assert.equal(updated[0].isRead, false);
    });

    test("mapBackendNotifications normalizes system/promo/order types and icons", () => {
        const mapped = mapBackendNotifications([
            { notificationId: "N1", title: "Welcome!", message: "Verified", type: "system", isRead: false },
            { notificationId: "N2", title: "Deals", message: "Discounts", type: "promo", isRead: true }
        ]);
        assert.equal(mapped.length, 2);
        assert.equal(mapped[0].type, "security");
        assert.equal(mapped[0].icon, "bi bi-shield-check");
        assert.equal(mapped[1].type, "promo");
        assert.equal(mapped[1].icon, "bi bi-tag");
    });
});
