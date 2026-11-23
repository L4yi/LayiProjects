import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

initTestEnv();

const { customerService } = await import("../../src/services/customerService.js");

describe("Integration: Customer Module Fallbacks & API Contract", () => {
    test("trackOrder returns resilient tracking payload", async () => {
        const res = await customerService.trackOrder("10492");
        assert.equal(res.success, true);
        assert.ok(res.data);
        assert.equal(res.data.orderId, "10492");
        assert.ok(res.data.carrier);
        assert.ok(res.data.trackingNumber);
    });

    test("fetchWishlist returns array structure", async () => {
        const res = await customerService.fetchWishlist("19");
        assert.equal(res.success, true);
        assert.ok(Array.isArray(res.data));
    });

    test("addToWishlist and removeWishlist complete full add-delete DB lifecycle without re-adding", async () => {
        const custId = "CUST20261116225756";
        const prodId = "PROD20261112124614";
        const addRes = await customerService.addToWishlist(custId, prodId);
        assert.equal(addRes.success, true);

        const remRes = await customerService.removeWishlist(custId, prodId);
        assert.equal(remRes.success, true);

        const listRes = await customerService.fetchWishlist(custId);
        assert.equal(listRes.success, true);
        const stillThere = listRes.data.some(w => String(w.productId || w.id) === prodId);
        assert.equal(stillThere, false);
    });

    test("fetchNotifications returns list shape", async () => {
        const res = await customerService.fetchNotifications("19");
        assert.equal(res.success, true);
        assert.ok(Array.isArray(res.data));
    });

    test("fetchAddresses returns address collection shape", async () => {
        const res = await customerService.fetchAddresses("19");
        assert.equal(res.success, true);
        assert.ok(Array.isArray(res.data));
    });

    test("submitSupportTicket generates compliant ticket reference", async () => {
        const res = await customerService.submitSupportTicket({
            customerId: "19",
            subject: "Delivery Delay Inquiry",
            category: "Shipping",
            message: "Where is my package?",
            priority: "High"
        });
        assert.equal(res.success, true);
        assert.ok(res.ticketId);
        assert.ok(res.ticketId.startsWith("TCK"));
    });
});
