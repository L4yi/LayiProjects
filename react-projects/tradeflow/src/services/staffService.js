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
     * 1. Fetch all staff members (admin/staff/fetch-all-staff.php)
     * With automatic search fallback to ensure all existing staff are retrieved
     */
    async fetchAllStaff() {
        try {
            const response = await api.post("admin/staff/fetch-all-staff.php", new FormData());
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data) && resData.data.length > 0) {
                return { success: true, data: resData.data };
            }

            // Fallback to search-staff with "STAFF" query if fetch-all returned no records
            const searchFallback = await this.searchStaff("STAFF");
            if (searchFallback.success && Array.isArray(searchFallback.data) && searchFallback.data.length > 0) {
                return { success: true, data: searchFallback.data };
            }

            return { success: false, message: resData?.message || "No staff found", data: [] };
        } catch (error) {
            try {
                const searchFallback = await this.searchStaff("STAFF");
                if (searchFallback.success && Array.isArray(searchFallback.data)) {
                    return { success: true, data: searchFallback.data };
                }
            } catch (e) {
                // Ignore fallback error
            }

            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to fetch staff members",
                data: []
            };
        }
    },

    /**
     * 2. Fetch single staff member details by staffId (admin/staff/fetch-each-staff.php)
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
     * 3. Search staff members by search query (admin/staff/search-staff.php)
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
    },

    /**
     * 4. Update existing staff member (admin/staff/update-staff.php)
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
     * 5. Delete staff member by staffId (admin/staff/delete-staff.php)
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
     * 6. Create a new staff member (admin/staff/create-staff.php)
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
            let msg = error.response?.data?.message || error.message;
            if (error.response?.status === 500) {
                msg = "Remote server error (HTTP 500): The server's create-staff script encountered an internal PHP exception (mailer / database constraint). Edit, Delete, Fetch, and Search endpoints are working normally.";
            }
            return {
                success: false,
                message: msg || "Failed to create staff member"
            };
        }
    }
};

export default staffService;
