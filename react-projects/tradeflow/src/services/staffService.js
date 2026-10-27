import api from "../api/axios";

try {
    localStorage.removeItem("tradeflow_created_staffs");
} catch {
}

export function getErrorMessage(error, defaultMsg = "An unexpected error occurred") {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (typeof error.response?.data === "string" && error.response.data.trim()) {
        const text = error.response.data.trim();
        if (text.startsWith("<")) {
            const titleMatch = text.match(/<title>(.*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
                return titleMatch[1].trim();
            }
            const stripped = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
            if (stripped && stripped.length < 200) {
                return stripped;
            }
        } else {
            return text;
        }
    }
    if (error.response?.status) {
        const status = error.response.status;
        const statusText = error.response.statusText || "";
        return `Server Error (${status})${statusText ? ": " + statusText : ""}`;
    }
    if (error.message) {
        return error.message;
    }
    return defaultMsg;
}

export function getTitleId(title = "") {
    const t = String(title).toLowerCase().trim();
    if (t === "mr") return "1";
    if (t === "mrs") return "2";
    if (t === "miss") return "3";
    if (t === "dr") return "4";
    if (t === "prof") return "5";
    return "1";
}

export function getStatusId(status = "") {
    const s = String(status).toUpperCase().trim();
    if (s === "2" || s === "INACTIVE") return "2";
    return "1";
}

export function getRoleId(role = "") {
    const r = String(role).toUpperCase().trim();
    if (r === "5" || r.includes("MANAGER")) return "5";
    if (r === "3" || r.includes("SUPER ADMIN")) return "3";
    if (r === "2" || r.includes("ADMIN")) return "2";
    if (r === "4" || r.includes("SYSTEM")) return "4";
    if (r === "1" || r.includes("STAFF")) return "1";
    return "5";
}

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
    async fetchAllStaff() {
        try {
            const response = await api.post("admin/staff/fetch-all-staff.php", new FormData());
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return resData;
            }
            const searchFallback = await this.searchStaff("STAFF");
            if (searchFallback?.success && Array.isArray(searchFallback?.data) && searchFallback.data.length > 0) {
                return searchFallback;
            }
            return normalizeResponse(resData, "Staff fetched successfully");
        } catch (error) {
            try {
                const searchFallback = await this.searchStaff("STAFF");
                if (searchFallback?.success && Array.isArray(searchFallback?.data) && searchFallback.data.length > 0) {
                    return searchFallback;
                }
            } catch {
            }
            return {
                success: false,
                message: getErrorMessage(error, "Failed to fetch staff members"),
                data: []
            };
        }
    },

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

    async updateStaff(staffData) {
        try {
            const staffId = staffData.staffId || staffData.id;
            const titleId = staffData.title ? getTitleId(staffData.title) : (staffData.titleId || "1");
            const statusId = staffData.status ? getStatusId(staffData.status) : (staffData.statusId || "1");
            const roleId = staffData.role ? getRoleId(staffData.role) : (staffData.roleId || "5");

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

    async deleteStaff(staffId) {
        try {
            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());

            const response = await api.post("admin/staff/delete-staff.php", formData);
            return normalizeResponse(response.data, "Staff member deleted successfully!");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to delete staff member")
            };
        }
    },

    async createStaff(staffData) {
        const titleId = staffData.title ? getTitleId(staffData.title) : (staffData.titleId || "1");
        const statusId = staffData.status ? getStatusId(staffData.status) : (staffData.statusId || "1");
        const roleId = staffData.role ? getRoleId(staffData.role) : (staffData.roleId || "5");
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
