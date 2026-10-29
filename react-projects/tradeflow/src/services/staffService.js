import api from "../api/axios";
import setupService from "./setupService";

// Helper function to extract a readable error message from Axios errors.
// It checks response message, response error field, or general network message.
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

// Find title id from setup data loaded from backend setup/fetch-all-title.php
export function getTitleId(title = "") {
    return setupService.getTitleId(title);
}

// Find status id from setup data loaded from backend setup/fetch-all-status.php
export function getStatusId(status = "") {
    return setupService.getStatusId(status);
}

// Find role id from setup data loaded from backend setup/fetch-all-role.php
export function getRoleId(role = "") {
    return setupService.getRoleId(role);
}

// Helper to keep our service responses in a standard structure: { success, message, data }
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
    // Fetches all staff members from the database (admin/staff/fetch-all-staff.php)
    async fetchAllStaff() {
        try {
            // Send empty FormData because the PHP script expects a POST request
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

   
    async fetchEachStaff(staffId) {
        try {
            // convert staffId into FormData for the PHP backend
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

    // Searches staff by keyword like name, email, or role (admin/staff/search-staff.php)
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

    // Updates an existing staff member in the database (admin/staff/update-staff.php)
    async updateStaff(staffData) {
        try {
            const staffId = staffData.staffId || staffData.id;

            // Resolve IDs from setup service or use IDs already provided by the form drawer
            const titleId = staffData.titleId || getTitleId(staffData.title);
            const statusId = staffData.statusId || getStatusId(staffData.status);
            const roleId = staffData.roleId || getRoleId(staffData.role);

             const firstName = (staffData.firstName || staffData.name?.split(" ")[0] || "").trim();
            const lastName = (staffData.lastName || staffData.name?.split(" ").slice(1).join(" ") || "Staff").trim();
            const email = (staffData.emailAddress || staffData.email || "").trim();
            const phone = (staffData.phoneNumber || staffData.phone || "").trim();
            const address = (staffData.address || "Abeokuta, Ogun State").trim();

            // converts all fields into FormData as expected by PHP backend
            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());
            formData.append("titleId", titleId);
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("emailAddress", email);
            formData.append("phoneNumber", phone);
            formData.append("address", address);
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

    // Creates a new staff account in the database 
    async createStaff(staffData) {
        // Resolve title, status, and role IDs from backend setup data
        const titleId = staffData.titleId || getTitleId(staffData.title);
        const statusId = staffData.statusId || getStatusId(staffData.status);
        const roleId = staffData.roleId || getRoleId(staffData.role);

        // Prepare clean user data
        const firstName = (staffData.firstName || staffData.name?.split(" ")[0] || "").trim();
        const lastName = (staffData.lastName || staffData.name?.split(" ").slice(1).join(" ") || "").trim();
        const email = (staffData.emailAddress || staffData.email || "").trim();
        const phone = (staffData.phoneNumber || staffData.phone || "").trim();
        const address = (staffData.address || "").trim();
        const password = staffData.password || "Tradeflow123!";

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