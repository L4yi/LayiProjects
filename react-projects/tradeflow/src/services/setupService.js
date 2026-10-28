import api from "../api/axios";

// Helper to keep response format consistent
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

// In-memory cache so we only call the backend when needed
let cachedStatuses = null;
let cachedTitles = null;
let cachedRoles = null;
let cachedPaymentMethods = null;

export const setupService = {
    // Fetch all account and order statuses from backend (Active, Inactive, Pending, etc.)
    async fetchAllStatus() {
        if (cachedStatuses) {
            return { success: true, data: cachedStatuses, message: "Statuses loaded from cache" };
        }
        try {
            const response = await api.post("setup/fetch-all-status.php", new FormData());
            const normalized = normalizeResponse(response.data, "STATUSES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedStatuses = normalized.data;
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

    // Fetch all staff and customer titles from backend   
    async fetchAllTitles() {
        if (cachedTitles) {
            return { success: true, data: cachedTitles, message: "Titles loaded from cache" };
        }
        try {
            const response = await api.post("setup/fetch-all-title.php", new FormData());
            const normalized = normalizeResponse(response.data, "TITLES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedTitles = normalized.data;
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

    // Fetch all user roles from backend (Store Manager, Admin, Super Admin, etc.)
    async fetchAllRoles() {
        if (cachedRoles) {
            return { success: true, data: cachedRoles, message: "Roles loaded from cache" };
        }
        try {
            const response = await api.post("setup/fetch-all-role.php", new FormData());
            const normalized = normalizeResponse(response.data, "ROLES FETCHED SUCCESSFULLY");
            if (normalized.success && Array.isArray(normalized.data)) {
                cachedRoles = normalized.data;
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

    // Fetch all payment methods from backend (Wallet, Bank Transfer, Cash)
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
                data: []
            };
        }
    },

    // Find role id from backend roles
    getRoleId(roleName, fallback = "1") {
        if (!roleName) return fallback;
        if (!isNaN(roleName)) return String(roleName);
        if (cachedRoles && cachedRoles.length > 0) {
            const found = cachedRoles.find(
                (r) => (r.role_name || "").toLowerCase() === String(roleName).toLowerCase()
            );
            if (found?.role_id) return String(found.role_id);
        }
        const rUpper = String(roleName).toUpperCase();
        if (rUpper.includes("MANAGER")) return "5";
        if (rUpper.includes("SUPER ADMIN")) return "3";
        if (rUpper.includes("ADMIN")) return "2";
        if (rUpper.includes("SYSTEM")) return "4";
        return fallback;
    },

    // Find title id from backend titles
    getTitleId(titleName, fallback = "1") {
        if (!titleName) return fallback;
        if (!isNaN(titleName)) return String(titleName);
        if (cachedTitles && cachedTitles.length > 0) {
            const found = cachedTitles.find(
                (t) => (t.title_name || "").toLowerCase() === String(titleName).toLowerCase()
            );
            if (found?.title_id) return String(found.title_id);
        }
        const tLower = String(titleName).toLowerCase();
        if (tLower === "mrs") return "2";
        if (tLower === "dr") return "3";
        if (tLower === "prof") return "4";
        if (tLower === "engr") return "5";
        return fallback;
    },

    // Find status id from backend statuses
    getStatusId(statusName, fallback = "1") {
        if (!statusName) return fallback;
        if (!isNaN(statusName)) return String(statusName);
        if (cachedStatuses && cachedStatuses.length > 0) {
            const found = cachedStatuses.find(
                (s) => (s.status_name || "").toLowerCase() === String(statusName).toLowerCase()
            );
            if (found?.status_id) return String(found.status_id);
        }
        const sUpper = String(statusName).toUpperCase();
        if (sUpper === "INACTIVE" || sUpper === "2") return "2";
        if (sUpper === "PENDING" || sUpper === "3") return "3";
        if (sUpper === "PROCESSING" || sUpper === "4") return "4";
        if (sUpper === "SUCCESSFUL" || sUpper === "5") return "5";
        if (sUpper === "PAID" || sUpper === "8") return "8";
        if (sUpper === "FAILED" || sUpper === "9") return "9";
        return fallback;
    },

    // find payment method id from the backend list
    getPaymentMethodId(name, fallback = "2") {
        if (!name) return fallback;
        if (!isNaN(name)) return String(name);
        if (cachedPaymentMethods && cachedPaymentMethods.length > 0) {
            const found = cachedPaymentMethods.find(
                (p) => (p.payment_method_name || "").toLowerCase() === String(name).toLowerCase()
            );
            if (found?.payment_method_id) return String(found.payment_method_id);
        }
        return fallback;
    }
};

export default setupService;
