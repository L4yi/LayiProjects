import { getSessionUser } from "./session";

/**
 * Normalizes user role string or roleId from session.
 * Roles in database:
 * - 1: Super Admin / Admin
 * - 2: Manager
 * - 3-18: Operational Staff roles (Sales, Inventory, Cashier, etc.)
 * - 19: Customer
 */
export function getNormalizedRole(user = null) {
    const sessionUser = user || getSessionUser();
    if (!sessionUser) return "GUEST";

    const roleName = String(sessionUser.role || sessionUser.roleName || "").toLowerCase().trim();
    const roleId = String(sessionUser.roleId || sessionUser.role_id || "").trim();

    if (roleId === "1" || roleName.includes("super admin") || roleName === "admin") {
        return "SUPER_ADMIN";
    }
    if (roleId === "2" || roleName.includes("manager")) {
        return "MANAGER";
    }
    if (roleId === "19" || roleName.includes("customer")) {
        return "CUSTOMER";
    }

    // Default to STAFF for all other employee roles (roles 3 through 18)
    return "STAFF";
}

export function isSuperAdmin(user = null) {
    return getNormalizedRole(user) === "SUPER_ADMIN";
}

export function isManager(user = null) {
    return getNormalizedRole(user) === "MANAGER";
}

export function isStaff(user = null) {
    return getNormalizedRole(user) === "STAFF";
}

export function isCustomer(user = null) {
    return getNormalizedRole(user) === "CUSTOMER";
}

/**
 * Staff Module Permission Checks:
 * - Staffs Management: Super Admin / Admin only
 * - Customers: Super Admin, Admin & Manager only (Staffs cannot see customer info)
 * - Transactions: Super Admin, Admin & Manager only (Staffs cannot see transactions)
 * - Reports: Super Admin, Admin & Manager only (Staffs cannot see reports)
 * - Products & Categories CRUD: Only Super Admin and Manager can Add, Edit, Delete (Staffs are view-only)
 * - Customer Edit: Disabled for all (Admin can view, add, delete, but NO edit)
 */

export function canAccessStaffs(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN";
}

export function canAccessCustomers(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "MANAGER";
}

export function canAccessTransactions(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "MANAGER";
}

export function canAccessReports(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "MANAGER";
}

export function canManageCatalog(user = null) {
    const role = getNormalizedRole(user);
    // Only Super Admin and Manager can create, edit, or delete products and categories
    return role === "SUPER_ADMIN" || role === "MANAGER";
}

export function canEditCustomer() {
    // Admin and all roles can only view / add / delete customers, NO edit
    return false;
}

export function canDeleteCustomer(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN";
}

export function canConfirmOrders(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "MANAGER" || role === "STAFF";
}

export default {
    getNormalizedRole,
    isSuperAdmin,
    isManager,
    isStaff,
    isCustomer,
    canAccessStaffs,
    canAccessCustomers,
    canAccessTransactions,
    canAccessReports,
    canManageCatalog,
    canEditCustomer,
    canDeleteCustomer,
    canConfirmOrders
};
