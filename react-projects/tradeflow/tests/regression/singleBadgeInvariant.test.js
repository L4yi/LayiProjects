import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Regression Invariant: Single Verified Customer Badge Policy", () => {
    test("Profile.jsx does not render duplicate checkmark beside user name", () => {
        const profileCode = fs.readFileSync(path.resolve("src/pages/Profile.jsx"), "utf-8");
        
        // Assert that verified-name-check beside user.name does not exist
        const hasDuplicateNameCheck = profileCode.includes("verified-name-check");
        assert.equal(hasDuplicateNameCheck, false, "Profile.jsx must not reintroduce duplicate checkmark beside user name");
    });

    test("Profile.jsx uses standard verified-badge-pill for customer accounts", () => {
        const profileCode = fs.readFileSync(path.resolve("src/pages/Profile.jsx"), "utf-8");
        const hasVerifiedPill = profileCode.includes("verified-badge-pill");
        assert.equal(hasVerifiedPill, true, "Profile.jsx must use unified verified-badge-pill");
    });

    test("CustomerUserBanner.jsx enforces single verified badge pill", () => {
        const bannerCode = fs.readFileSync(path.resolve("src/components/CustomerUserBanner.jsx"), "utf-8");
        assert.ok(bannerCode.includes("verified-badge-pill"));
    });
});
