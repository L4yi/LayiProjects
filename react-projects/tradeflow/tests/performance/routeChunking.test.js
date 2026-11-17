import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Performance: Route-Level Dynamic Lazy Chunking", () => {
    test("App.jsx dynamically code-splits customer and admin views via React.lazy", () => {
        const appCode = fs.readFileSync(path.resolve("src/pages/App.jsx"), "utf-8");

        // Count occurrences of lazy(() => import(...))
        const lazyMatches = appCode.match(/lazy\(\(\)\s*=>\s*import\(/g) || [];
        
        // App has over 20 code-split pages
        assert.ok(
            lazyMatches.length >= 20, 
            `Expected at least 20 code-split routes via React.lazy(), found ${lazyMatches.length}`
        );

        // Verify key customer modules are lazy-loaded
        assert.ok(appCode.includes('lazy(() => import("./customer/CustomerDashboard"))'));
        assert.ok(appCode.includes('lazy(() => import("./customer/CustomerCart"))'));
        assert.ok(appCode.includes('lazy(() => import("./customer/CustomerOrders"))'));
        assert.ok(appCode.includes('lazy(() => import("./customer/CustomerTrackOrder"))'));
    });
});
