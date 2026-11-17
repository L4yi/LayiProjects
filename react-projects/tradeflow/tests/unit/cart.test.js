import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

const { 
    parsePrice, 
    getCartItems, 
    setCartItems, 
    addToCart, 
    updateCartQuantity, 
    removeCartItem, 
    clearCart, 
    getCartCount, 
    getCartSubtotal 
} = await import("../../src/utils/cart.js");

describe("Unit: Shopping Cart Calculations & Bounds", () => {
    beforeEach(() => {
        env.clear();
        clearCart();
    });

    test("parsePrice normalizes string prices, currencies, and nulls safely", () => {
        assert.equal(parsePrice(15000), 15000);
        assert.equal(parsePrice("15000"), 15000);
        assert.equal(parsePrice("₦14,500"), 14500);
        assert.equal(parsePrice("$29.99"), 29.99);
        assert.equal(parsePrice("12,000.50"), 12000.5);
        assert.equal(parsePrice(null), 0);
        assert.equal(parsePrice(undefined), 0);
        assert.equal(parsePrice("invalid"), 0);
    });

    test("addToCart inserts new product and increments existing product quantity", () => {
        addToCart({ id: "P-101", name: "Steel Valve", price: 5000 }, 1);
        let items = getCartItems();
        assert.equal(items.length, 1);
        assert.equal(items[0].quantity, 1);
        assert.equal(items[0].price, 5000);

        addToCart({ id: "P-101", name: "Steel Valve", price: 5000 }, 2);
        items = getCartItems();
        assert.equal(items.length, 1);
        assert.equal(items[0].quantity, 3);
    });

    test("updateCartQuantity enforces minimum bound of 1", () => {
        addToCart({ id: "P-102", name: "Safety Helmet", price: 2500 }, 2);
        
        updateCartQuantity("P-102", -1);
        assert.equal(getCartItems()[0].quantity, 1);

        // Attempting to decrement below 1 must stay bounded at 1
        updateCartQuantity("P-102", -5);
        assert.equal(getCartItems()[0].quantity, 1);
    });

    test("removeCartItem and clearCart remove items cleanly", () => {
        addToCart({ id: "P-103", name: "Gloves", price: 1000 });
        addToCart({ id: "P-104", name: "Boots", price: 8000 });
        assert.equal(getCartItems().length, 2);

        removeCartItem("P-103");
        assert.equal(getCartItems().length, 1);
        assert.equal(getCartItems()[0].id, "P-104");

        clearCart();
        assert.equal(getCartItems().length, 0);
    });

    test("getCartCount and getCartSubtotal calculate multi-item totals accurately", () => {
        addToCart({ id: "P-1", name: "Item A", price: "₦10,500" }, 2); // 21,000
        addToCart({ id: "P-2", name: "Item B", price: 4250.75 }, 1);    // 4,250.75

        assert.equal(getCartCount(), 3);
        assert.equal(getCartSubtotal(), 25250.75);
    });
});
