import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Regression Invariant: Mobile Layout Zero Bottom Navigation", () => {
    test("CustomerLayout.jsx does not render any fixed mobile bottom navigation bar", () => {
        const layoutCode = fs.readFileSync(path.resolve("src/components/CustomerLayout.jsx"), "utf-8");
        
        assert.equal(layoutCode.includes("mobile-bottom-nav"), false, "Must not render mobile-bottom-nav");
        assert.equal(layoutCode.includes("customer-bottom-bar"), false, "Must not render customer-bottom-bar");
    });

    test("MainStyle.css does not define fixed bottom navigation rules for mobile customer views", () => {
        const cssCode = fs.readFileSync(path.resolve("src/assets/styles/MainStyle.css"), "utf-8");
        
        assert.equal(cssCode.includes(".mobile-bottom-nav"), false);
        assert.equal(cssCode.includes(".customer-bottom-nav"), false);
    });
});
