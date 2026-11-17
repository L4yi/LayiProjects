import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

const {
    getWishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
} = await import("../../src/utils/wishlist.js");

describe("Unit: Wishlist State & Deduplication", () => {
    beforeEach(() => {
        env.clear();
        clearWishlist();
    });

    test("addToWishlist prevents duplicate product IDs", () => {
        addToWishlist({ id: "W-01", name: "Solar Inverter", price: "₦120,000" });
        assert.equal(getWishlistItems().length, 1);

        // Attempting to add same product ID must not duplicate
        addToWishlist({ id: "W-01", name: "Solar Inverter", price: "₦120,000" });
        assert.equal(getWishlistItems().length, 1);
    });

    test("isInWishlist correctly checks membership", () => {
        addToWishlist({ id: "W-02", name: "Lithium Battery", price: 350000 });
        assert.equal(isInWishlist("W-02"), true);
        assert.equal(isInWishlist("W-99"), false);
        assert.equal(isInWishlist(null), false);
    });

    test("removeFromWishlist and clearWishlist remove items accurately", () => {
        addToWishlist({ id: "W-10", name: "Panel A", price: 45000 });
        addToWishlist({ id: "W-11", name: "Panel B", price: 55000 });
        assert.equal(getWishlistItems().length, 2);

        removeFromWishlist("W-10");
        assert.equal(getWishlistItems().length, 1);
        assert.equal(isInWishlist("W-10"), false);
        assert.equal(isInWishlist("W-11"), true);

        clearWishlist();
        assert.equal(getWishlistItems().length, 0);
    });
});
