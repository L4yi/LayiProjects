import api from "../api/axios";

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

export const setupService = {
    async fetchAllStatus() {
        try {
            const response = await api.post("setup/fetch-all-status.php", new FormData());
            return normalizeResponse(response.data, "STATUSES FETCHED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load statuses.",
                data: []
            };
        }
    },

    async fetchAllTitles() {
        try {
            const response = await api.post("setup/fetch-all-title.php", new FormData());
            return normalizeResponse(response.data, "TITLES FETCHED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load titles.",
                data: []
            };
        }
    },

    async fetchAllRoles() {
        try {
            const response = await api.post("setup/fetch-all-role.php", new FormData());
            return normalizeResponse(response.data, "ROLES FETCHED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load roles.",
                data: []
            };
        }
    },

    async fetchAllPaymentMethods() {
        try {
            const response = await api.post("setup/fetch-all-payment-method.php", new FormData());
            return normalizeResponse(response.data, "PAYMENT METHODS FETCHED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load payment methods.",
                data: []
            };
        }
    }
};

export default setupService;
