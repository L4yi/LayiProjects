import { getSessionUser } from "./session";

/**
 * Normalizes user role string or roleId from session.
 * Exact backend database roles:
 * - 1: STAFF
 * - 2: ADMIN
 * - 3: SUPER ADMIN
 * - 19: Customer
 */
export function getNormalizedRole(user = null) {
    const sessionUser = user || getSessionUser();
    if (!sessionUser) return "GUEST";

    const roleId = String(sessionUser.roleId || sessionUser.role_id || "").trim();
    const roleName = String(sessionUser.role || sessionUser.roleName || "").toLowerCase().trim();

    // 1. Authoritative check by numeric roleId from MySQL database
    if (roleId === "3") return "SUPER_ADMIN";
    if (roleId === "2") return "ADMIN";
    if (roleId === "1") return "STAFF";
    if (roleId === "19") return "CUSTOMER";

    // 2. Fallback check by role name string
    if (roleName.includes("super admin") || roleName.includes("superadmin")) {
        return "SUPER_ADMIN";
    }
    if (roleName === "admin" || (roleName.includes("admin") && !roleName.includes("super"))) {
        return "ADMIN";
    }
    if (roleName === "staff" || roleName.includes("staff")) {
        return "STAFF";
    }
    if (roleName.includes("customer")) {
        return "CUSTOMER";
    }

    // Default to STAFF
    return "STAFF";
}

export function isSuperAdmin(user = null) {
    return getNormalizedRole(user) === "SUPER_ADMIN";
}

export function isAdmin(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function isStaff(user = null) {
    return getNormalizedRole(user) === "STAFF";
}

export function isCustomer(user = null) {
    return getNormalizedRole(user) === "CUSTOMER";
}

/**
 * Role-Based Access Controls:
 * - Staffs Management: Super Admin & Admin only (Staffs cannot access)
 * - Customers: Super Admin & Admin only (Staffs cannot see customer info)
 * - Transactions: Super Admin & Admin only (Staffs cannot see transactions)
 * - Reports: Super Admin & Admin only (Staffs cannot see reports)
 * - Products & Categories CRUD: Only Super Admin and Admin can Add, Edit, Delete (Staffs are view-only)
 * - Customer Edit: Disabled for all (Admin can view, add, delete, but NO edit)
 * - Orders: Super Admin, Admin, and Staff can view, add, and confirm orders
 */

export function canAccessStaffs(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canAccessCustomers(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canAccessTransactions(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canAccessReports(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canManageCatalog(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canEditCustomer() {
    // Admins and all roles can only view / add / delete customers, NO edit
    return false;
}

export function canDeleteCustomer(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canConfirmOrders(user = null) {
    const role = getNormalizedRole(user);
    return role === "SUPER_ADMIN" || role === "ADMIN" || role === "STAFF";
}

export default {
    getNormalizedRole,
    isSuperAdmin,
    isAdmin,
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
