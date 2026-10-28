import api from "../api/axios";
import setupService from "./setupService";

// Helper to pull clean error messages from server responses
export function getErrorMessage(error, defaultMsg = "An unexpected error occurred") {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return defaultMsg;
}

// Find title id from setup data
export function getTitleId(title = "") {
    return setupService.getTitleId(title, "1");
}

// Find status id from setup data
export function getStatusId(status = "") {
    return setupService.getStatusId(status, "1");
}

// Find role id from setup data
export function getRoleId(role = "") {
    return setupService.getRoleId(role, "5");
}

// Helper to keep response format consistent across requests
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

export const staffService = {
    // Fetch all staff members from the database
    async fetchAllStaff() {
        try {
            // PHP backend expects POST with FormData
            const response = await api.post("admin/staff/fetch-all-staff.php", new FormData());
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return resData;
            }
            return normalizeResponse(resData, "Staff fetched successfully");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to fetch staff members"),
                data: []
            };
        }
    },

    // Fetch details for a single staff member using their staffId
    async fetchEachStaff(staffId) {
        try {
            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());

            const response = await api.post("admin/staff/fetch-each-staff.php", formData);
            return normalizeResponse(response.data, "Staff fetched successfully");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to fetch staff details")
            };
        }
    },

    // Search staff by keyword (name, email, or role)
    async searchStaff(searchContent) {
        try {
            const formData = new FormData();
            formData.append("searchContent", (searchContent || "").trim());

            const response = await api.post("admin/staff/search-staff.php", formData);
            return normalizeResponse(response.data, "Staff search completed");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to search staff"),
                data: []
            };
        }
    },

    // Update an existing staff member in the database
    async updateStaff(staffData) {
        try {
            const staffId = staffData.staffId || staffData.id;
            // Resolve IDs from setup service or data passed from drawer
            const titleId = staffData.titleId || getTitleId(staffData.title);
            const statusId = staffData.statusId || getStatusId(staffData.status);
            const roleId = staffData.roleId || getRoleId(staffData.role);

            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());
            formData.append("titleId", titleId);
            formData.append("firstName", (staffData.firstName || staffData.name?.split(" ")[0] || "").trim());
            formData.append("lastName", (staffData.lastName || staffData.name?.split(" ").slice(1).join(" ") || "Staff").trim());
            formData.append("emailAddress", (staffData.emailAddress || staffData.email || "").trim());
            formData.append("phoneNumber", (staffData.phoneNumber || staffData.phone || "").trim());
            formData.append("address", (staffData.address || "Abeokuta, Ogun State").trim());
            formData.append("roleId", roleId);
            formData.append("statusId", statusId);

            const response = await api.post("admin/staff/update-staff.php", formData);
            return normalizeResponse(response.data, "Staff member updated successfully!");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to update staff member")
            };
        }
    },

    // Create a new staff account
    async createStaff(staffData) {
        const titleId = staffData.titleId || getTitleId(staffData.title);
        const statusId = staffData.statusId || getStatusId(staffData.status);
        const roleId = staffData.roleId || getRoleId(staffData.role);
        const firstName = (staffData.firstName || staffData.name?.split(" ")[0] || "").trim();
        const lastName = (staffData.lastName || staffData.name?.split(" ").slice(1).join(" ") || "").trim();
        const email = (staffData.emailAddress || staffData.email || "").trim();
        const phone = (staffData.phoneNumber || staffData.phone || "").trim();
        const address = (staffData.address || "").trim();
        const password = staffData.password || "Password123!";

        try {
            const formData = new FormData();
            formData.append("titleId", titleId);
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("emailAddress", email);
            formData.append("phoneNumber", phone);
            formData.append("address", address);
            formData.append("password", password);
            formData.append("roleId", roleId);
            formData.append("statusId", statusId);

            const response = await api.post("admin/staff/create-staff.php", formData);
            return normalizeResponse(response.data, "Staff member created successfully!");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to create staff member")
            };
        }
    }
};

export default staffService;
