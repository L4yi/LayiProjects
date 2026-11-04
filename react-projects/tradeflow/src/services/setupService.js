import api from "../api/axios";

// Helper function to format responses cleanly.
// This makes sure our app always gets { success: true/false, message: "...", data: [...] }
// even if the backend returns raw text or an error.
function normalizeResponse(resData, defaultSuccessMsg = "Success") {
    if (typeof resData === "object" && resData !== null) {
        const isSuccess = resData.success === true || resData.success === "true";
        return {
            ...resData,
            success: isSuccess,
            message: resData.message || (isSuccess ? defaultSuccessMsg : "Request could not be completed.")
        };
    }
    return {
        success: false,
        message: String(resData || "Empty response from server.")
    };
}

// In-memory cache stores.
// Caches full lists of setup data in memory so the app only hits the server once per session.
let cachedStatuses = null;
let cachedTitles = null;
let cachedRoles = null;
let cachedPaymentMethods = null;

export const setupService = {
    // Synchronous cache getters for instant drawer rendering without flicker
    getCachedTitles() {
        return cachedTitles || [];
    },
    getCachedRoles() {
        return cachedRoles || [];
    },
    getCachedStatuses() {
        return cachedStatuses || [];
    },
    getCachedPaymentMethods() {
        return cachedPaymentMethods || [];
    },

    // Fetches all account and order statuses from backend (setup/fetch-all-status.php)
    async fetchAllStatus(statusIds) {
        if (!statusIds && cachedStatuses) {
            return { success: true, data: cachedStatuses, message: "Statuses loaded from cache" };
        }
        try {
            const formData = new FormData();
            if (statusIds) {
                formData.append("statusIds", statusIds);
            }
            const response = await api.post("setup/fetch-all-status.php", formData);
            const normalized = normalizeResponse(response.data, response.data?.message || "STATUSES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                if (!statusIds) {
                    cachedStatuses = normalized.data;
                } else if (!cachedStatuses) {
                    cachedStatuses = normalized.data;
                }
            }
            return normalized;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load statuses.",
                data: cachedStatuses || []
            };
        }
    },

    // Fetches titles from backend (setup/fetch-all-title.php)
    // Supports optional titleIds filter (e.g. "1, 2") or fetches all: Mr, Mrs, Dr, Prof, Engr
    async fetchAllTitles(titleIds) {
        if (!titleIds && cachedTitles) {
            return { success: true, data: cachedTitles, message: "Titles loaded from cache" };
        }
        try {
            const formData = new FormData();
            if (titleIds) {
                formData.append("titleIds", titleIds);
            }
            const response = await api.post("setup/fetch-all-title.php", formData);
            const normalized = normalizeResponse(response.data, "TITLES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                if (!titleIds) {
                    cachedTitles = normalized.data;
                } else if (!cachedTitles) {
                    cachedTitles = normalized.data;
                }
            }
            return normalized;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load titles.",
                data: cachedTitles || []
            };
        }
    },

    // Fetches all 19 user roles from backend (setup/fetch-all-role.php)
    async fetchAllRoles(roleIds) {
        if (!roleIds && cachedRoles) {
            return { success: true, data: cachedRoles, message: "Roles loaded from cache" };
        }
        try {
            const formData = new FormData();
            if (roleIds) {
                formData.append("roleIds", roleIds);
            }
            const response = await api.post("setup/fetch-all-role.php", formData);
            const normalized = normalizeResponse(response.data, response.data?.message || "ROLES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                if (!roleIds) {
                    cachedRoles = normalized.data;
                } else if (!cachedRoles) {
                    cachedRoles = normalized.data;
                }
            }
            return normalized; 
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load roles.",
                data: cachedRoles || []
            };
        }
    },

    // Fetches all payment methods from backend (setup/fetch-all-payment-method.php)
    async fetchAllPaymentMethods() {
        if (cachedPaymentMethods) {
            return { success: true, data: cachedPaymentMethods, message: "Payment methods loaded from cache" };
        }
        try {
            const response = await api.post("setup/fetch-all-payment-method.php", new FormData());
            const normalized = normalizeResponse(response.data, "PAYMENT METHODS FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedPaymentMethods = normalized.data;
            }
            return normalized;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load payment methods.",
                data: cachedPaymentMethods || []
            };
        }
    },

    // --- Domain-Specific Filters for Roles & Statuses ---

    // Order fulfillment & payment statuses (Processing, Successful, Paid, Failed, Done, Canceled, Reverse, Pending)
    getOrderStatuses(list) {
        const statuses = list || cachedStatuses || [];
        const orderIds = ["3", "4", "5", "8", "9", "10", "12", "13"];
        return statuses.filter(s => orderIds.includes(String(s.status_id)));
    },

    // Product inventory & stock statuses (In Stock, Out of stock, Active, Inactive) - Pending (3) removed
    getProductStatuses(list) {
        const statuses = list || cachedStatuses || [];
        const prodIds = ["11", "6", "1", "2"];
        return statuses.filter(s => prodIds.includes(String(s.status_id)));
    },

    // General Active / Inactive statuses (ACTIVE #1, INACTIVE #2)
    getActiveInactiveStatuses(list) {
        const statuses = list || cachedStatuses || [];
        return statuses.filter(s =>
            ["1", "2"].includes(String(s.status_id)) ||
            ["active", "inactive"].includes(String(s.status_name || "").toLowerCase())
        );
    },

    // Category taxonomy statuses (Active, Inactive) - Pending (3) removed
    getCategoryStatuses(list) {
        const statuses = list || cachedStatuses || [];
        const catIds = ["1", "2"];
        return statuses.filter(s => catIds.includes(String(s.status_id)));
    },

    // User account statuses (Active, Inactive) - strictly restricted to active and inactive
    getAccountStatuses(list) {
        const statuses = list || cachedStatuses || [];
        const accIds = ["1", "2"];
        return statuses.filter(s => accIds.includes(String(s.status_id)));
    },

    // Transaction & payment statuses (Successful, Paid, Processing, Failed, Reverse, Active, Inactive, Pending)
    getTransactionStatuses(list) {
        const statuses = list || cachedStatuses || [];
        const txnIds = ["5", "8", "4", "9", "13", "1", "2", "3"];
        return statuses.filter(s => txnIds.includes(String(s.status_id)));
    },

    // Staff organizational roles (all roles 1-18, excluding customer #19)
    getStaffRoles(list) {
        const roles = list || cachedRoles || [];
        return roles.filter(r => String(r.role_id) !== "19" && !r.role_name?.toLowerCase().includes("customer"));
    },

    // Customer tier roles strictly restricted to Customer role only
    getCustomerRoles(list) {
        const roles = list || cachedRoles || [];
        const found = roles.filter(r =>
            String(r.role_id) === "19" ||
            String(r.role_name || "").toLowerCase() === "customer"
        );
        if (found.length > 0) return found;
        // Fallback: If backend role setup table does not include a dedicated Customer role, supply the canonical Customer role #19
        return [{ role_id: "19", role_name: "Customer" }];
    },

    // Look up a role id by its name from the backend roles list.
    // If the input is already a number/id, it returns it directly.
    // Otherwise it searches cached roles for a matching name.
    getRoleId(roleName, fallback = "") {
        if (!roleName) return fallback || cachedRoles?.[0]?.role_id || "";
        // If it's already an ID like "2" or 2, just return it as a string
        if (!isNaN(roleName)) return String(roleName);
        if (String(roleName).toLowerCase() === "customer") return "19";
        if (cachedRoles && cachedRoles.length > 0) {
            const found = cachedRoles.find(
                (r) => (r.role_name || "").toLowerCase() === String(roleName).toLowerCase()
            );
            if (found?.role_id) return String(found.role_id);
        }
        return fallback || cachedRoles?.[0]?.role_id || "";
    },

    // Look up a role name using its id from the backend roles list
    getRoleName(roleId, fallback = "") {
        if (!roleId) return fallback;
        if (String(roleId) === "19") return "Customer";
        if (cachedRoles && cachedRoles.length > 0) {
            const found = cachedRoles.find(
                (r) => String(r.role_id) === String(roleId)
            );
            if (found?.role_name) return found.role_name;
        }
        return fallback;
    },

    // Look up a title id by its name (e.g. "Mr" -> "1") from the backend titles list
    getTitleId(titleName, fallback = "") {
        if (!titleName) return fallback || cachedTitles?.[0]?.title_id || "";
        if (!isNaN(titleName)) return String(titleName);
        if (cachedTitles && cachedTitles.length > 0) {
            const found = cachedTitles.find(
                (t) => (t.title_name || "").toLowerCase() === String(titleName).toLowerCase()
            );
            if (found?.title_id) return String(found.title_id);
        }
        return fallback || cachedTitles?.[0]?.title_id || "";
    },

    // Look up a title name using its id from the backend titles list
    getTitleName(titleId, fallback = "") {
        if (!titleId) return fallback;
        if (cachedTitles && cachedTitles.length > 0) {
            const found = cachedTitles.find(
                (t) => String(t.title_id) === String(titleId)
            );
            if (found?.title_name) return found.title_name;
        }
        return fallback;
    },

    // Look up a status id by name (e.g. "Active" -> "1") from the backend statuses list
    getStatusId(statusName, fallback = "") {
        if (!statusName) return fallback || cachedStatuses?.[0]?.status_id || "";
        if (!isNaN(statusName)) return String(statusName);
        if (cachedStatuses && cachedStatuses.length > 0) {
            const found = cachedStatuses.find(
                (s) => (s.status_name || "").toLowerCase() === String(statusName).toLowerCase()
            );
            if (found?.status_id) return String(found.status_id);
        }
        return fallback || cachedStatuses?.[0]?.status_id || "";
    },

    // Look up a status name using its id from the backend statuses list
    getStatusName(statusId, fallback = "") {
        if (!statusId) return fallback;
        if (cachedStatuses && cachedStatuses.length > 0) {
            const found = cachedStatuses.find(
                (s) => String(s.status_id) === String(statusId)
            );
            if (found?.status_name) return found.status_name;
        }
        return fallback;
    },

    // Look up a payment method id by name (e.g. "Wallet" -> "1") from backend list
    getPaymentMethodId(name, fallback = "") {
        if (!name) return fallback || cachedPaymentMethods?.[0]?.payment_method_id || "";
        if (!isNaN(name)) return String(name);
        if (cachedPaymentMethods && cachedPaymentMethods.length > 0) {
            const found = cachedPaymentMethods.find(
                (p) => (p.payment_method_name || "").toLowerCase() === String(name).toLowerCase()
            );
            if (found?.payment_method_id) return String(found.payment_method_id);
        }
        return fallback || cachedPaymentMethods?.[0]?.payment_method_id || "";
    },

    // Look up a payment method name using its id from the backend list
    getPaymentMethodName(id, fallback = "") {
        if (!id) return fallback;
        if (cachedPaymentMethods && cachedPaymentMethods.length > 0) {
            const found = cachedPaymentMethods.find(
                (p) => String(p.payment_method_id) === String(id)
            );
            if (found?.payment_method_name) return found.payment_method_name;
        }
        return fallback;
    }
};

// Eagerly prime the setup cache in memory on module import
if (typeof window !== "undefined") {
    setupService.fetchAllTitles().catch(() => {});
    setupService.fetchAllRoles().catch(() => {});
    setupService.fetchAllStatus().catch(() => {});
    setupService.fetchAllPaymentMethods().catch(() => {});
}

export default setupService;