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
                const normalizedList = resData.data.map((s) => {
                    const photo = s.profile_image || s.profileImage || s.imageUrl || s.image || "";
                    return {
                        ...s,
                        profileImage: photo,
                        avatar: photo,
                        avatarUrl: photo,
                        imageUrl: photo
                    };
                });
                return { ...resData, data: normalizedList };
            }
            const msg = String(resData?.message || "").toUpperCase();
            if (msg.includes("NO") && msg.includes("STAFF")) {
                return {
                    success: true,
                    data: [],
                    message: resData?.message || "No staff members registered."
                };
            }
            return {
                success: false,
                data: [],
                message: resData?.message || "Failed to load staff directory."
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: getErrorMessage(error, "Failed to connect to staff database")
            };
        }
    },

    // Fetches a single staff member's complete profile by their unique ID
    async fetchStaffById(staffId) {
        try {
            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());
            const response = await api.post("admin/staff/fetch-each-staff.php", formData);
            const norm = normalizeResponse(response.data, "Staff details retrieved successfully.");
            if (norm.success && norm.data) {
                const photo = norm.data.profile_image || norm.data.profileImage || norm.data.imageUrl || norm.data.image || "";
                norm.data.profileImage = photo;
                norm.data.avatar = photo;
                norm.data.avatarUrl = photo;
                norm.data.imageUrl = photo;
            }
            return norm;
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to fetch staff member profile")
            };
        }
    },

    // Search staff members by name, email, or role
    async searchStaff(keyword) {
        try {
            const formData = new FormData();
            formData.append("search", String(keyword).trim());
            const response = await api.post("admin/staff/search-staff.php", formData);
            return normalizeResponse(response.data, "Search query completed.");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Staff search request failed")
            };
        }
    },

    // Deletes a staff member from the system
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

    // Way 1: Uploads an image file to admin/upload/upload-image.php with folder: 'profiles'
    async uploadProfileImage(file) {
        try {
            const formData = new FormData();
            formData.append("folder", "profiles");
            formData.append("image", file);
            formData.append("file", file);

            const response = await api.post("admin/upload/upload-image.php", formData);
            const resData = response.data;

            const imageUrl = resData?.imageUrl || resData?.data?.imageUrl || resData?.data?.url || resData?.url || resData?.path;
            if (imageUrl) {
                return {
                    success: true,
                    imageUrl,
                    data: { imageUrl },
                    message: resData?.message || "Image uploaded successfully!"
                };
            }

            if (resData?.success === true) {
                return {
                    success: true,
                    imageUrl: resData.imageUrl || "",
                    data: resData.data,
                    message: resData.message || "Upload successful"
                };
            }

            return {
                success: false,
                message: resData?.message || "Failed to upload image file."
            };
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Upload failed.")
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
            const fullName = (staffData.fullName || staffData.name || `${firstName} ${lastName}`).trim();
            const email = (staffData.emailAddress || staffData.email || "").trim();
            const phone = (staffData.phoneNumber || staffData.phone || "").trim();
            const address = (staffData.address || "Abeokuta, Ogun State").trim();

            // converts all fields into FormData as expected by PHP backend
            const formData = new FormData();
            formData.append("staffId", String(staffId).trim());
            formData.append("titleId", titleId);
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("fullName", fullName);
            formData.append("emailAddress", email);
            formData.append("phoneNumber", phone);
            formData.append("address", address);
            formData.append("roleId", roleId);
            formData.append("statusId", statusId);

            // Support profile image payload (Way 1 string URL or Way 2 File/Blob)
            if (staffData.profileImage) {
                formData.append("profileImage", staffData.profileImage);
                formData.append("image", staffData.profileImage);
            }
            if (staffData.image && !staffData.profileImage) {
                formData.append("image", staffData.image);
                formData.append("profileImage", staffData.image);
            }
            if (staffData.file) {
                formData.append("file", staffData.file);
            }

            const response = await api.post("admin/staff/update-staff.php", formData);
            return normalizeResponse(response.data, "Staff member updated successfully!");
        } catch (error) {
            return {
                success: false,
                message: getErrorMessage(error, "Failed to update staff member")
            };
        }
    },

    // Dual-strategy profile photo update pipeline:
    // Way 1 (Recommended): Upload to upload-image.php (folder: 'profiles'), forward returned imageUrl to update-staff.php.
    // Way 2 (Fallback): Direct multipart image submission into update-staff.php.
    async updateProfilePhoto(staffId, file, staffDetails = {}) {
        if (!file) {
            return { success: false, message: "No image file provided." };
        }

        // Try Way 1 first
        try {
            const uploadRes = await this.uploadProfileImage(file);
            if (uploadRes.success && uploadRes.imageUrl) {
                const updateRes = await this.updateStaff({
                    ...staffDetails,
                    staffId,
                    profileImage: uploadRes.imageUrl,
                    image: uploadRes.imageUrl
                });

                if (updateRes.success) {
                    return {
                        success: true,
                        imageUrl: uploadRes.imageUrl,
                        message: "Profile photo updated successfully!"
                    };
                }
            }
        } catch (err) {
            console.warn("Way 1 upload failed, falling back to Way 2 direct multipart:", err);
        }

        // Way 2: Direct multipart file upload to update-staff.php
        try {
            const directRes = await this.updateStaff({
                ...staffDetails,
                staffId,
                image: file,
                file: file
            });

            if (directRes.success) {
                return {
                    success: true,
                    imageUrl: directRes.data?.imageUrl || directRes.data?.profileImage || null,
                    message: "Profile photo updated successfully!"
                };
            }
            return directRes;
        } catch (err) {
            return {
                success: false,
                message: getErrorMessage(err, "Failed to upload and update profile photo.")
            };
        }
    },

    // Creates a new staff account in the database 
    async createStaff(staffData) {
        const titleId = staffData.titleId || getTitleId(staffData.title);
        const statusId = staffData.statusId || getStatusId(staffData.status);
        const roleId = staffData.roleId || getRoleId(staffData.role);

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
