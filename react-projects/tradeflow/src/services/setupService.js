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

// In-memory cache variables.
// Once we fetch roles, statuses, or titles from the backend, we save them here.
// This avoids hitting the server repeatedly on every single dropdown click.
let cachedStatuses = null;
let cachedTitles = null;
let cachedRoles = null;
let cachedPaymentMethods = null;

export const setupService = {
    // Fetches all account and order statuses from backend (setup/fetch-all-status.php)
    // Returns list of statuses like Active, Inactive, Processing, Successful, etc.
    async fetchAllStatus() {
        // If we already have the list saved in memory, return it directly
        if (cachedStatuses) {
            return { success: true, data: cachedStatuses, message: "Statuses loaded from cache" };
        }
        try {
            // PHP backend requires POST with FormData
            const response = await api.post("setup/fetch-all-status.php", new FormData());
            const normalized = normalizeResponse(response.data, "STATUSES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedStatuses = normalized.data; // save to cache
            }
            return normalized;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load statuses.",
                data: []
            };
        }
    },

    // Fetches all titles from backend (setup/fetch-all-title.php)
    // Returns list of titles like Mr, Mrs, Dr, Prof, Engr
    async fetchAllTitles() {
        if (cachedTitles) {
            return { success: true, data: cachedTitles, message: "Titles loaded from cache" };
        }
        try {
            const response = await api.post("setup/fetch-all-title.php", new FormData());
            const normalized = normalizeResponse(response.data, "TITLES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedTitles = normalized.data; // save to cache
            }
            return normalized;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load titles.",
                data: []
            };
        }
    },

    // Fetches all user roles from backend (setup/fetch-all-role.php)
    // Returns list of roles like Staff, Admin, Super Admin, Store Manager, Customer, etc.
    async fetchAllRoles() {
        if (cachedRoles) {
            return { success: true, data: cachedRoles, message: "Roles loaded from cache" };
        }
        try {
            const response = await api.post("setup/fetch-all-role.php", new FormData());
            const normalized = normalizeResponse(response.data, "ROLES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedRoles = normalized.data; // save to cache
            }
            return normalized;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load roles.",
                data: []
            };
        }
    },

    // Fetches all payment methods from backend (setup/fetch-all-payment-method.php)
    // Returns list of methods like Wallet, Bank Transfer, Cash
    async fetchAllPaymentMethods() {
        if (cachedPaymentMethods) {
            return { success: true, data: cachedPaymentMethods, message: "Payment methods loaded from cache" };
        }
        try {
            const response = await api.post("setup/fetch-all-payment-method.php", new FormData());
            const normalized = normalizeResponse(response.data, "PAYMENT METHODS FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedPaymentMethods = normalized.data; // save to cache
            }
            return normalized;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load payment methods.",
                data: []
            };
        }
    },

    // Look up a role id by its name from the backend roles list.
    // If the input is already a number/id, it returns it directly.
    // Otherwise it searches cached roles for a matching name.
    getRoleId(roleName, fallback = "") {
        if (!roleName) return fallback || cachedRoles?.[0]?.role_id || "";
        // If it's already an ID like "2" or 2, just return it as a string
        if (!isNaN(roleName)) return String(roleName);
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

export default setupService;