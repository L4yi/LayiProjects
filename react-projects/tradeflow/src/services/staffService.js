import api from "../api/axios";

// Helper to map title text to titleId
export function getTitleId(title = "") {
    const t = String(title).toLowerCase().trim();
    if (t === "mr") return "1";
    if (t === "mrs") return "2";
    if (t === "miss") return "3";
    if (t === "dr") return "4";
    if (t === "prof") return "5";
    return "1"; // Default to 1
}

// Helper to map status to statusId
export function getStatusId(status = "") {
    const s = String(status).toUpperCase().trim();
    if (s === "INACTIVE") return "2";
    if (s === "PENDING") return "3";
    return "1"; // Default ACTIVE
}

// Helper to map role to roleId
export function getRoleId(role = "") {
    const r = String(role).toUpperCase().trim();
    if (r.includes("SUPER ADMIN") || r.includes("ADMIN")) return "3";
    if (r.includes("MANAGER")) return "3";
    return "3"; // Default role
}

export const staffService = {
    /**
     * Fetch all staff members
     */
    async fetchAllStaff() {
        try {
            const response = await api.post("admin/staff/fetch-all-staff.php", new FormData());
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return { success: true, data: resData.data };
            }
            return { success: false, message: resData?.message || "No staff found", data: [] };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to fetch staff members",
                data: []
            };
        }
    },

    /**
     * Fetch single staff member details by staffId
     */
    async fetchEachStaff(staffId) {
        try {
            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());

            const response = await api.post("admin/staff/fetch-each-staff.php", formData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to fetch staff details"
            };
        }
    },

    /**
     * Create a new staff member
     */
    async createStaff(staffData) {
        try {
            const formData = new FormData();
            const titleId = staffData.titleId || getTitleId(staffData.title);
            const statusId = staffData.statusId || getStatusId(staffData.status);
            const roleId = staffData.roleId || getRoleId(staffData.role);

            formData.append("titleId", titleId);
            formData.append("firstName", (staffData.firstName || staffData.name?.split(" ")[0] || "").trim());
            formData.append("lastName", (staffData.lastName || staffData.name?.split(" ").slice(1).join(" ") || "Staff").trim());
            formData.append("emailAddress", (staffData.emailAddress || staffData.email || "").trim());
            formData.append("phoneNumber", (staffData.phoneNumber || staffData.phone || "").trim());
            formData.append("address", (staffData.address || "Abeokuta, Ogun State").trim());
            formData.append("password", staffData.password || "123456");
            formData.append("roleId", roleId);
            formData.append("statusId", statusId);

            const response = await api.post("admin/staff/create-staff.php", formData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to create staff member"
            };
        }
    },

    /**
     * Update existing staff member
     */
    async updateStaff(staffData) {
        try {
            const formData = new FormData();
            const staffId = staffData.staffId || staffData.id;
            const titleId = staffData.titleId || getTitleId(staffData.title);
            const statusId = staffData.statusId || getStatusId(staffData.status);
            const roleId = staffData.roleId || getRoleId(staffData.role);

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
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to update staff member"
            };
        }
    },

    /**
     * Delete staff member by staffId
     */
    async deleteStaff(staffId) {
        try {
            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());

            const response = await api.post("admin/staff/delete-staff.php", formData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to delete staff member"
            };
        }
    },

    /**
     * Search staff members by search query
     */
    async searchStaff(searchContent) {
        try {
            const formData = new FormData();
            formData.append("searchContent", (searchContent || "").trim());

            const response = await api.post("admin/staff/search-staff.php", formData);
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return { success: true, data: resData.data };
            }
            return { success: false, message: resData?.message || "No staff found", data: [] };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Search failed",
                data: []
            };
        }
    }
};

export default staffService;
