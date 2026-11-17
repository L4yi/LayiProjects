import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

// Import to register storage listeners
await import("../../src/utils/cart.js");
await import("../../src/utils/wishlist.js");
await import("../../src/utils/session.js");

describe("Integration: Multi-Tab Storage Synchronization", () => {
    beforeEach(() => {
        env.clear();
    });

    test("cart storage event triggers tradeflow_cart_update on window", async () => {
        const received = await new Promise((resolve) => {
            const handler = (e) => {
                window.removeEventListener("tradeflow_cart_update", handler);
                resolve(e.detail);
            };
            window.addEventListener("tradeflow_cart_update", handler);

            // Simulate external tab updating localStorage
            const storageEvent = new Event("storage");
            storageEvent.key = "tradeflow_cart";
            storageEvent.newValue = JSON.stringify([{ id: "SYNC-01", name: "Inverter", price: 85000, quantity: 1 }]);
            window.dispatchEvent(storageEvent);
        });

        assert.equal(received.length, 1);
        assert.equal(received[0].id, "SYNC-01");
    });

    test("wishlist storage event triggers tradeflow_wishlist_update on window", async () => {
        const received = await new Promise((resolve) => {
            const handler = (e) => {
                window.removeEventListener("tradeflow_wishlist_update", handler);
                resolve(e.detail);
            };
            window.addEventListener("tradeflow_wishlist_update", handler);

            const storageEvent = new Event("storage");
            storageEvent.key = "tradeflow_wishlist";
            storageEvent.newValue = JSON.stringify([{ id: "W-SYNC", name: "Solar Cable", price: 12000 }]);
            window.dispatchEvent(storageEvent);
        });

        assert.equal(received.length, 1);
        assert.equal(received[0].id, "W-SYNC");
    });

    test("session storage event triggers tradeflow_session_update on window", async () => {
        const fired = await new Promise((resolve) => {
            const handler = () => {
                window.removeEventListener("tradeflow_session_update", handler);
                resolve(true);
            };
            window.addEventListener("tradeflow_session_update", handler);

            const storageEvent = new Event("storage");
            storageEvent.key = "tradeflow_active_user";
            storageEvent.newValue = JSON.stringify({ id: "U-SYNC", name: "Synced User", role: "Customer" });
            window.dispatchEvent(storageEvent);
        });

        assert.equal(fired, true);
    });
});
