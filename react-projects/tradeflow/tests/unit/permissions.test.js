import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

initTestEnv();

const {
    getNormalizedRole,
    canAccessStaffs,
    canAccessCustomers,
    canAccessTransactions,
    canAccessReports,
    canEditCustomer,
    canDeleteCustomer,
    canConfirmOrders
} = await import("../../src/utils/permissions.js");

describe("Unit: Role-Based Access Control (RBAC) Predicates", () => {
    const superAdminUser = { roleId: "3", role: "SUPER ADMIN" };
    const adminUser = { roleId: "2", role: "ADMIN" };
    const staffUser = { roleId: "1", role: "STAFF" };
    const customerUser = { roleId: "19", role: "Customer", isCustomer: true };

    test("getNormalizedRole correctly identifies all four system roles", () => {
        assert.equal(getNormalizedRole(superAdminUser), "SUPER_ADMIN");
        assert.equal(getNormalizedRole(adminUser), "ADMIN");
        assert.equal(getNormalizedRole(staffUser), "STAFF");
        assert.equal(getNormalizedRole(customerUser), "CUSTOMER");
    });

    test("canAccessStaffs permits Super Admin and Admin, blocks Staff and Customer", () => {
        assert.equal(canAccessStaffs(superAdminUser), true);
        assert.equal(canAccessStaffs(adminUser), true);
        assert.equal(canAccessStaffs(staffUser), false);
        assert.equal(canAccessStaffs(customerUser), false);
    });

    test("canAccessCustomers and Transactions block Staff and Customer", () => {
        assert.equal(canAccessCustomers(adminUser), true);
        assert.equal(canAccessCustomers(staffUser), false);
        assert.equal(canAccessCustomers(customerUser), false);

        assert.equal(canAccessTransactions(adminUser), true);
        assert.equal(canAccessTransactions(staffUser), false);
        assert.equal(canAccessTransactions(customerUser), false);
    });

    test("canEditCustomer is globally disabled for all users to protect audit trail", () => {
        assert.equal(canEditCustomer(superAdminUser), false);
        assert.equal(canEditCustomer(adminUser), false);
        assert.equal(canEditCustomer(staffUser), false);
        assert.equal(canEditCustomer(customerUser), false);
    });

    test("canConfirmOrders allows Super Admin, Admin, and Staff, blocks Customer", () => {
        assert.equal(canConfirmOrders(superAdminUser), true);
        assert.equal(canConfirmOrders(adminUser), true);
        assert.equal(canConfirmOrders(staffUser), true);
        assert.equal(canConfirmOrders(customerUser), false);
    });
});
