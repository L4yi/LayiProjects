import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

const { getSessionUser, setSessionUser, clearSessionUser } = await import("../../src/utils/session.js");
const { getNormalizedRole, canAccessStaffs, isCustomer } = await import("../../src/utils/permissions.js");

describe("Integration: Authentication Lifecycle & RBAC State Transition", () => {
    beforeEach(() => {
        env.clear();
    });

    test("customer auth lifecycle: login -> normalized state -> role verification -> logout", () => {
        // Step 1: Initial unauthenticated state
        let session = getSessionUser();
        assert.equal(session.id, undefined);

        // Step 2: Customer logs in
        setSessionUser({
            customerId: "CUST-104",
            firstName: "Quadri",
            lastName: "Lasisi",
            email: "quadri@tradeflow.com",
            roleId: "19",
            role: "Customer"
        });

        session = getSessionUser();
        assert.equal(session.customerId, "CUST-104");
        assert.equal(session.id, "CUST-104");
        assert.equal(isCustomer(session), true);
        assert.equal(canAccessStaffs(session), false); // Cannot access staff portal

        // Step 3: Logout
        clearSessionUser();
        const postLogout = getSessionUser();
        assert.equal(postLogout.id, undefined);
        assert.equal(postLogout.name, "Staff User");
    });

    test("admin auth lifecycle: login -> permissions granted -> logout", () => {
        setSessionUser({
            staffId: "STF-99",
            name: "Chief Admin",
            roleId: "2",
            role: "ADMIN"
        });

        const adminSession = getSessionUser();
        assert.equal(getNormalizedRole(adminSession), "ADMIN");
        assert.equal(canAccessStaffs(adminSession), true);

        clearSessionUser();
        assert.equal(getSessionUser().id, undefined);
    });
});
