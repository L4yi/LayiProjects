import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

initTestEnv();

const { parsePrice } = await import("../../src/utils/cart.js");
const { getInitials } = await import("../../src/utils/session.js");

describe("Security: Input Injection & XSS Defense", () => {
    test("parsePrice safely neutralizes script tags and inline handlers", () => {
        const payload1 = "<script>alert('xss')</script>15000";
        assert.equal(parsePrice(payload1), 15000);

        const payload2 = "<img src=x onerror=alert(1)>";
        assert.equal(parsePrice(payload2), 0);

        const payload3 = "javascript:void(0)";
        assert.equal(parsePrice(payload3), 0);
    });

    test("getInitials safely neutralizes malicious script payloads in names", () => {
        const maliciousName = "<script>alert(1)</script> Admin";
        const initials = getInitials(maliciousName);
        
        // Assert initials extraction produces safe plain alphabetic letters
        assert.ok(/^[A-Z0-9]{1,2}$/.test(initials), `Expected safe uppercase initials, received ${initials}`);
        assert.equal(initials.includes("<"), false);
        assert.equal(initials.includes(">"), false);
    });
});
