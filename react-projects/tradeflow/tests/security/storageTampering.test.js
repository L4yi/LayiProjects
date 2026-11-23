import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

const { getSessionUser } = await import("../../src/utils/session.js");
const { getCartItems } = await import("../../src/utils/cart.js");
const { getWishlistItems } = await import("../../src/utils/wishlist.js");

describe("Security: Storage Tampering & Corrupted Payload Resilience", () => {
    beforeEach(() => {
        env.clear();
    });

    test("getSessionUser gracefully recovers when tradeflow_active_user is poisoned with corrupt JSON", () => {
        localStorage.setItem("tradeflow_active_user", "{malformed_json_syntax: 123");
        
        // Must not crash or throw unhandled syntax errors
        const user = getSessionUser();
        assert.ok(user, "User must fallback to default guest/staff structure");
        assert.equal(user.name, "Guest");
        assert.equal(user.role, "GUEST");
        assert.equal(user.isAuthenticated, false);
    });

    test("getCartItems gracefully recovers when tradeflow_cart is non-array or corrupt string", () => {
        localStorage.setItem("tradeflow_cart", "{\"objectInsteadOfArray\": true}");
        
        let items = getCartItems();
        assert.ok(items !== null && items !== undefined);

        localStorage.setItem("tradeflow_cart", "corrupted_raw_text");
        items = getCartItems();
        assert.ok(Array.isArray(items), "Must fallback to empty array");
        assert.equal(items.length, 0);
    });

    test("getWishlistItems safely handles non-array JSON injection", () => {
        localStorage.setItem("tradeflow_wishlist", "42");
        const items = getWishlistItems();
        assert.ok(Array.isArray(items), "Must fallback to empty array");
        assert.equal(items.length, 0);
    });
});
