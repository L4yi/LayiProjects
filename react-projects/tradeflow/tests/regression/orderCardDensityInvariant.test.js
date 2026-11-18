import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Regression Invariant: Order Card Density & Profile Redundancy Removal", () => {
    test("CustomerOrders.jsx eliminates empty 3rd row footer and bulky summary col", () => {
        const ordersCode = fs.readFileSync(path.resolve("src/pages/customer/CustomerOrders.jsx"), "utf-8");
        
        // Assert that separate order-card-footer does not exist on the order card
        assert.equal(ordersCode.includes("className=\"order-card-footer\""), false, "Must eliminate separate order-card-footer");
        assert.equal(ordersCode.includes("className=\"order-meta-summary-col\""), false, "Must eliminate clunky order-meta-summary-col box");
        assert.equal(ordersCode.includes("Delivery Method:"), false, "Must remove redundant Delivery Method text from card summary");
    });

    test("CustomerOrders.jsx integrates concise destination chip and inline action block", () => {
        const ordersCode = fs.readFileSync(path.resolve("src/pages/customer/CustomerOrders.jsx"), "utf-8");
        
        assert.ok(ordersCode.includes("order-dest-chip"), "Must render destination chip in top bar");
        assert.ok(ordersCode.includes("order-card-right-col"), "Must render right action and total block");
        assert.ok(ordersCode.includes("btn-view-order-receipt"), "Must retain compact receipt action button");
    });

    test("Profile.jsx removes both Storefront Shortcuts and redundant Log-Out button ('remove two of dem')", () => {
        const profileCode = fs.readFileSync(path.resolve("src/pages/Profile.jsx"), "utf-8");
        
        assert.equal(profileCode.includes("STOREFRONT SHORTCUTS"), false, "Must eliminate STOREFRONT SHORTCUTS block");
        assert.equal(profileCode.includes("btn-profile-logout"), false, "Must eliminate redundant btn-profile-logout button");
        assert.ok(profileCode.includes("btn-profile-dash-link"), "Must keep Go to Dashboard link");
    });
});
