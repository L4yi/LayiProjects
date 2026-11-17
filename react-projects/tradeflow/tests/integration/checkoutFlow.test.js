import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

const { addToCart, clearCart, getCartSubtotal, getCartCount } = await import("../../src/utils/cart.js");
const { getDefaultPaymentMethod, setDefaultPaymentMethod, getWalletBalance } = await import("../../src/utils/payment.js");

describe("Integration: End-to-End Checkout Calculation Flow", () => {
    beforeEach(() => {
        env.clear();
        clearCart();
    });

    test("complete checkout computation with subtotal, shipping, and discount", () => {
        // 1. Add items to cart
        addToCart({ id: "ITM-01", name: "Solar Panel 400W", price: "₦55,000" }, 2); // 110,000
        addToCart({ id: "ITM-02", name: "Charge Controller", price: "25,000" }, 1); // 25,000

        const subtotal = getCartSubtotal();
        assert.equal(subtotal, 135000);
        assert.equal(getCartCount(), 3);

        // 2. Shipping calculation rules
        const shippingFee = subtotal > 100000 ? 0 : 3500; // Free delivery over ₦100k
        assert.equal(shippingFee, 0);

        // 3. Discount voucher simulation (5% promotional coupon)
        const discountRate = 0.05;
        const discountAmount = Math.round(subtotal * discountRate);
        assert.equal(discountAmount, 6750);

        // 4. Final payable total
        const finalTotal = subtotal + shippingFee - discountAmount;
        assert.equal(finalTotal, 128250);

        // 5. Payment method verification
        setDefaultPaymentMethod("bank_transfer");
        assert.equal(getDefaultPaymentMethod(), "bank_transfer");
    });

    test("wallet checkout balances sufficiency check", () => {
        const walletBalance = getWalletBalance(); // 25,000
        assert.equal(walletBalance, 25000);

        const smallOrderTotal = 15000;
        const canPayWithWallet = walletBalance >= smallOrderTotal;
        assert.equal(canPayWithWallet, true);

        const largeOrderTotal = 50000;
        const canPayLargeWithWallet = walletBalance >= largeOrderTotal;
        assert.equal(canPayLargeWithWallet, false);
    });
});
