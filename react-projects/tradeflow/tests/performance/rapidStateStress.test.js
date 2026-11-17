import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

initTestEnv();

const { addToCart, updateCartQuantity, clearCart, getCartSubtotal, getCartCount } = await import("../../src/utils/cart.js");

describe("Performance & Load: Rapid High-Frequency State Stress", () => {
    test("1,000 rapid cart item additions and mutations execute in under 250ms with zero NaN drift", () => {
        clearCart();
        const start = performance.now();

        // Simulate 500 product additions
        for (let i = 0; i < 500; i++) {
            addToCart({
                id: `STRESS-${i % 20}`, // 20 unique items
                name: `Item ${i}`,
                price: "₦2,500.50"
            }, 1);
        }

        // Simulate 500 rapid quantity adjustments
        for (let i = 0; i < 500; i++) {
            updateCartQuantity(`STRESS-${i % 20}`, 1);
        }

        const elapsed = performance.now() - start;

        const subtotal = getCartSubtotal();
        const totalItems = getCartCount();

        // Performance Assertions
        assert.ok(elapsed < 250, `1,000 state mutations took ${elapsed.toFixed(1)}ms (target: < 250ms)`);
        assert.ok(!Number.isNaN(subtotal), "Subtotal must never degenerate to NaN under load");
        assert.ok(subtotal > 0, "Subtotal must be positive and non-zero");
        assert.equal(totalItems, 1000, "Item count must accurately reflect 1,000 total quantities");
    });
});
