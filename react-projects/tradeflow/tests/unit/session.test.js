import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

// Dynamic import after env setup to bind mock window & storage
const { getSessionUser, setSessionUser, clearSessionUser, getInitials } = await import("../../src/utils/session.js");

describe("Unit: Session & User Identity Normalization", () => {
    beforeEach(() => {
        env.clear();
    });

    test("getInitials extracts two-letter uppercase acronyms correctly", () => {
        assert.equal(getInitials("Quadri Lasisi"), "QL");
        assert.equal(getInitials("Admin"), "AD");
        assert.equal(getInitials("Super Admin User"), "SU");
        assert.equal(getInitials(""), "SU");
    });

    test("getSessionUser normalizes customerId and id for customer role", () => {
        setSessionUser({
            customer_id: "CUST-992",
            name: "Test Customer",
            roleId: "19",
            email: "cust@tradeflow.com"
        });

        const user = getSessionUser();
        assert.equal(user.customerId, "CUST-992");
        assert.equal(user.id, "CUST-992");
        assert.equal(user.role, "Customer");
        assert.equal(user.roleId, "19");
        assert.equal(user.isCustomer, true);
    });

    test("getSessionUser authoritative role mapping for admin and super admin", () => {
        setSessionUser({ staffId: "STF-01", roleId: "3", name: "Super Boss" });
        assert.equal(getSessionUser().role, "SUPER ADMIN");

        setSessionUser({ staffId: "STF-02", roleId: "2", name: "Manager Admin" });
        assert.equal(getSessionUser().role, "ADMIN");

        setSessionUser({ staffId: "STF-03", roleId: "1", name: "Staff Clerk" });
        assert.equal(getSessionUser().role, "STAFF");
    });

    test("clearSessionUser wipes active session storage completely", () => {
        setSessionUser({ id: "USR-01", name: "Logged In User" });
        assert.ok(getSessionUser());

        clearSessionUser();
        const cleared = getSessionUser();
        assert.equal(cleared.id, undefined);
        assert.equal(cleared.name, "Guest");
        assert.equal(cleared.isAuthenticated, false);
        assert.equal(cleared.role, "GUEST");
    });
});
