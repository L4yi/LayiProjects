import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

initTestEnv();

const { 
    canAccessStaffs, 
    canAccessCustomers, 
    canAccessTransactions, 
    canAccessReports, 
    canManageCatalog,
    canEditCustomer,
    canDeleteCustomer
} = await import("../../src/utils/permissions.js");

describe("Security: Privilege Escalation & Role Protection", () => {
    test("customer role (roleId: 19) is strictly blocked from all admin endpoints", () => {
        const customerUser = {
            id: "CUST-007",
            customerId: "CUST-007",
            role: "Customer",
            roleId: "19",
            isCustomer: true
        };

        assert.equal(canAccessStaffs(customerUser), false, "Customer must NOT access staff management");
        assert.equal(canAccessCustomers(customerUser), false, "Customer must NOT access customer registry");
        assert.equal(canAccessTransactions(customerUser), false, "Customer must NOT access transactions");
        assert.equal(canAccessReports(customerUser), false, "Customer must NOT access financial reports");
        assert.equal(canManageCatalog(customerUser), false, "Customer must NOT create or edit catalog products");
        assert.equal(canDeleteCustomer(customerUser), false, "Customer must NOT delete customers");
        assert.equal(canEditCustomer(customerUser), false, "Customer must NOT edit customer profiles");
    });

    test("tampered role strings (e.g. 'Customer Admin') do not allow privilege escalation", () => {
        const spoofedUser = {
            id: "ATTACKER-01",
            roleId: "19",
            role: "Customer Admin", // Attempting to trick string checks
            roleName: "Customer Admin"
        };

        // When roleId is 19, authoritative numeric check must treat as Customer
        assert.equal(canAccessStaffs(spoofedUser), false);
        assert.equal(canAccessTransactions(spoofedUser), false);
    });

    test("unauthenticated / null sessions are denied all admin permissions", () => {
        assert.equal(canAccessStaffs(null), false);
        assert.equal(canAccessCustomers(null), false);
        assert.equal(canAccessTransactions(null), false);
        assert.equal(canAccessReports(null), false);
    });
});
