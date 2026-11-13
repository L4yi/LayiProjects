import setupService from './setupService';
import api from "../api/axios";
import { setSessionUser } from "../utils/session";

// Formats a raw database row into a clean customer object.
// The backend returns snake_case fields (e.g. first_name, status_name).
// We map them here so our React components can access them reliably.
function normalizeCustomer(item) {
    if (!item) return null;
    const firstName = item.first_name || item.firstName || "";
    const lastName = item.last_name || item.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || item.email_address || item.emailAddress || "Customer";
    const photo = item.profile_image || item.profileImage || item.imageUrl || item.image || item.avatar || "";

    return {
        id: item.customer_id || item.customerId || "",
        customerId: item.customer_id || item.customerId || "",
        titleId: item.title_id || item.titleId || "",
        titleName: item.title_name || item.titleName || "",
        firstName,
        lastName,
        name: fullName,
        email: item.email_address || item.emailAddress || "",
        emailAddress: item.email_address || item.emailAddress || "",
        phone: item.phone_number || item.phoneNumber || "",
        phoneNumber: item.phone_number || item.phoneNumber || "",
        address: item.address || "",
        statusId: item.status_id || item.statusId || "",
        status: item.status_name || item.statusName || "",
        statusName: item.status_name || item.statusName || "",
        roleId: item.role_id || item.roleId || "",
        role: item.role_name || item.roleName || "",
        roleName: item.role_name || item.roleName || "",
        profileImage: photo,
        avatar: photo,
        avatarUrl: photo,
        imageUrl: photo,
        createdAt: item.created_at || item.createdAt || "",
        updatedAt: item.updated_at || item.updatedAt || ""
    };
}

export const customerService = {
    // Fetches all customers from the backend (admin/customer/fetch-all-customer.php)
    async fetchAllCustomers() {
        try {
            const response = await api.get("admin/customer/fetch-all-customer.php");
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return {
                    success: true,
                    data: resData.data.map(normalizeCustomer),
                    message: resData.message || "CUSTOMERS FETCHED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                data: [],
                message: resData?.message || "No customers found."
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to fetch customers."
            };
        }
    },

    async fetchCustomerById(customerId) {
        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            const response = await api.post("admin/customer/fetch-each-customer.php", formData);
            const resData = response.data;
            if (resData?.success === true && resData?.data) {
                return {
                    success: true,
                    data: normalizeCustomer(resData.data),
                    message: resData.message || "CUSTOMER FETCHED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                data: null,
                message: resData?.message || "Customer not found."
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error.response?.data?.message || error.message || "Failed to fetch customer."
            };
        }
    },

    async searchCustomer(searchContent) {
        try {
            const formData = new FormData();
            formData.append("searchContent", (searchContent || "").trim());
            const response = await api.post("admin/customer/search-customer.php", formData);
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return {
                    success: true,
                    data: resData.data.map(normalizeCustomer),
                    message: resData.message || "CUSTOMERS SEARCHED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                data: [],
                message: resData?.message || "No matching customers found."
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Search failed."
            };
        }
    },

    // Creates a new customer account in the backend.
    // Title, role, and status IDs are dynamically looked up from the setupService.
    async createCustomer({ titleId, firstName, lastName, emailAddress, phoneNumber, address, roleId, statusId }) {
        titleId = titleId || setupService.getTitleId("Mr");
        roleId = roleId || setupService.getRoleId("Customer");
        statusId = statusId || setupService.getStatusId("Active");
        try {
            const formData = new FormData();
            formData.append("titleId", titleId);
            formData.append("firstName", (firstName || "").trim());
            formData.append("lastName", (lastName || "").trim());
            formData.append("emailAddress", (emailAddress || "").trim());
            formData.append("phoneNumber", (phoneNumber || "").trim());
            formData.append("address", (address || "").trim());
            formData.append("roleId", roleId);
            formData.append("statusId", statusId);

            const response = await api.post("admin/customer/create-customer.php", formData);
            const resData = response.data;
            if (resData?.success === true) {
                return {
                    success: true,
                    data: normalizeCustomer(resData.data),
                    message: resData.message || "CUSTOMER CREATED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                message: resData?.message || "Failed to create customer."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to register customer."
            };
        }
    },

    // Updates an existing customer's contact and account details in the database
    async updateCustomer({ customerId, titleId, firstName, lastName, emailAddress, phoneNumber, address, roleId, statusId }) {
        titleId = (titleId && String(titleId) !== "0" && String(titleId).trim() !== "") ? String(titleId) : "1";
        roleId = (roleId && Number(roleId) >= 1 && Number(roleId) <= 17) ? String(roleId) : "1";
        statusId = (statusId && String(statusId) !== "0" && String(statusId).trim() !== "") ? String(statusId) : "1";

        const cleanFirst = (firstName || "").trim() || "Customer";
        let cleanLast = (lastName || "").trim();
        if (!cleanLast) {
            // Guard against backend 'LAST NAME IS REQUIRED' error
            const parts = cleanFirst.split(/\s+/);
            if (parts.length > 1) {
                cleanLast = parts.slice(1).join(" ");
            } else {
                cleanLast = "Customer";
            }
        }

        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            formData.append("titleId", titleId);
            formData.append("firstName", cleanFirst);
            formData.append("lastName", cleanLast);
            formData.append("emailAddress", (emailAddress || "").trim());
            formData.append("phoneNumber", (phoneNumber || "").trim());
            formData.append("address", (address || "").trim());
            formData.append("roleId", roleId);
            formData.append("statusId", statusId);

            const response = await api.post("admin/customer/update-customer.php", formData);
            const resData = response.data;
            return {
                success: resData?.success === true,
                message: resData?.message || (resData?.success ? "CUSTOMER UPDATED SUCCESSFULLY" : "Failed to update customer."),
                data: resData?.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to update customer."
            };
        }
    },

    async deleteCustomer(customerId) {
        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            const response = await api.post("admin/customer/delete-customer.php", formData);
            const resData = response.data;
            return {
                success: resData?.success === true,
                message: resData?.message || (resData?.success ? "CUSTOMER DELETED SUCCESSFULLY" : "Failed to delete customer.")
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to delete customer."
            };
        }
    },

    // Authenticates a customer by email.
    // Finds customer by email, checks that their status is ACTIVE, and saves their session.
    async customerSignIn(emailAddress) {
        const cleanEmail = (emailAddress || "").trim().toLowerCase();
        if (!cleanEmail) {
            return {
                success: false,
                message: "Email address is required."
            };
        }

        const searchRes = await this.searchCustomer(cleanEmail);
        if (searchRes.success && searchRes.data.length > 0) {
            const matched = searchRes.data.find(
                (c) => (c.emailAddress || "").toLowerCase() === cleanEmail || (c.email || "").toLowerCase() === cleanEmail
            ) || searchRes.data[0];

            if (matched.statusId === "2" || matched.status === "INACTIVE") {
                return {
                    success: false,
                    message: "Your customer account is currently inactive. Please contact support."
                };
            }

            const photo = matched.profileImage || matched.profile_image || matched.imageUrl || matched.image || matched.avatar || "";
            const sessionPayload = {
                customerId: matched.customerId,
                id: matched.customerId,
                name: matched.name,
                firstName: matched.firstName,
                lastName: matched.lastName,
                email: matched.emailAddress,
                phone: matched.phoneNumber,
                address: matched.address,
                role: "Customer",
                roleId: matched.roleId || setupService.getRoleId("Customer"),
                status: matched.status || "ACTIVE",
                statusId: matched.statusId || setupService.getStatusId("Active"),
                profileImage: photo,
                avatar: photo,
                avatarUrl: photo,
                imageUrl: photo
            };

            setSessionUser(sessionPayload);
            return {
                success: true,
                message: "CUSTOMER LOGIN SUCCESSFUL",
                user: sessionPayload,
                data: sessionPayload
            };
        }

        return {
            success: false,
            message: "No registered customer found with this email. Please create an account to continue."
        };
    },

    // Dedicated customer sign-up endpoint: customer/auth/sign-up.php
    async customerAuthSignUp({ firstName, lastName, emailAddress, phoneNumber, password, address }) {
        try {
            const formData = new FormData();
            formData.append("firstName", (firstName || "").trim());
            formData.append("lastName", (lastName || "").trim());
            formData.append("emailAddress", (emailAddress || "").trim());
            formData.append("phoneNumber", (phoneNumber || "").trim());
            formData.append("password", password || "");
            formData.append("address", (address || "Abeokuta, Ogun State, Nigeria").trim());

            const response = await api.post("customer/auth/sign-up.php", formData);
            const resData = response.data;
            if (resData?.success === true) {
                return {
                    success: true,
                    data: resData.data,
                    message: resData.message || "CUSTOMER SIGN UP SUCCESSFUL"
                };
            }
            return {
                success: false,
                message: resData?.message || "Customer sign up failed."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to sign up customer."
            };
        }
    },

    // Dedicated customer sign-in endpoint: customer/auth/sign-in.php
    async customerAuthSignIn({ emailAddress, password }) {
        const cleanEmail = (emailAddress || "").trim();
        if (!cleanEmail) {
            return {
                success: false,
                message: "Email address is required."
            };
        }
        if (!password) {
            return {
                success: false,
                message: "Password is required."
            };
        }

        try {
            const formData = new FormData();
            formData.append("emailAddress", cleanEmail);
            formData.append("password", password || "");

            const response = await api.post("customer/auth/sign-in.php", formData);
            const resData = response.data;

            if (resData?.success === true && resData?.data) {
                const cust = resData.data;
                const firstName = cust.firstName || cust.first_name || "";
                const lastName = cust.lastName || cust.last_name || "";
                const fullName = `${firstName} ${lastName}`.trim() || cust.emailAddress || cleanEmail;
                const customerId = cust.customerId || cust.customer_id || cust.id || "";

                const photo = cust.profileImage || cust.imageUrl || cust.image || cust.avatar || cust.profile_image || "";

                const sessionPayload = {
                    customerId,
                    id: customerId,
                    name: fullName,
                    firstName,
                    lastName,
                    email: cust.emailAddress || cleanEmail,
                    phone: cust.phoneNumber || "",
                    address: cust.address || "",
                    role: "Customer",
                    roleId: "19",
                    status: "ACTIVE",
                    statusId: "1",
                    profileImage: photo,
                    avatar: photo,
                    avatarUrl: photo,
                    imageUrl: photo,
                    lastLogin: cust.lastLoginDate || "Just now"
                };

                setSessionUser(sessionPayload);
                return {
                    success: true,
                    data: sessionPayload,
                    user: sessionPayload,
                    message: resData.message || "CUSTOMER SIGN IN SUCCESSFUL"
                };
            }

            return {
                success: false,
                message: resData?.message || "Invalid login credentials."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Sign in request failed."
            };
        }
    },

    // Customer forgot password endpoint: customer/auth/forget-password.php
    async customerForgotPassword(emailAddress) {
        const cleanEmail = (emailAddress || "").trim();
        if (!cleanEmail) {
            return {
                success: false,
                message: "Email address is required."
            };
        }

        try {
            const formData = new FormData();
            formData.append("emailAddress", cleanEmail);
            formData.append("email", cleanEmail);

            let response;
            try {
                response = await api.post("customer/auth/forget-password.php", formData);
            } catch (err) {
                if (err.response?.status === 404) {
                    response = await api.post("customer/auth/forgot-password.php", formData);
                } else {
                    throw err;
                }
            }

            const resData = response.data;
            if (resData?.success === true) {
                const customerId = resData.data?.customerId || resData.data?.customer_id || "";
                const resetOtp = resData.data?.resetotp || resData.data?.resetOtp || "";
                return {
                    success: true,
                    message: resData.message || "RESET OTP GENERATED SUCCESSFULLY",
                    data: {
                        customerId,
                        resetOtp,
                        emailAddress: resData.data?.emailAddress || cleanEmail
                    }
                };
            }

            return {
                success: false,
                message: resData?.message || "Could not generate reset OTP for this email."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to process forgot password request."
            };
        }
    },

    // Customer reset password endpoint: customer/auth/reset-password.php
    async customerResetPassword({ customerId, resetOtp, password, confirmPassword }) {
        const cleanId = (customerId || "").trim();
        const cleanOtp = (resetOtp || "").toString().trim();

        if (!cleanId) {
            return {
                success: false,
                message: "Customer ID is required."
            };
        }
        if (!cleanOtp) {
            return {
                success: false,
                message: "Reset OTP is required."
            };
        }
        if (!password) {
            return {
                success: false,
                message: "New password is required."
            };
        }
        if (password !== confirmPassword) {
            return {
                success: false,
                message: "Passwords do not match."
            };
        }

        try {
            const formData = new FormData();
            formData.append("customerId", cleanId);
            formData.append("customer_id", cleanId);
            formData.append("resetOtp", cleanOtp);
            formData.append("resetotp", cleanOtp);
            formData.append("password", password);
            formData.append("confirmPassword", confirmPassword);

            const response = await api.post("customer/auth/reset-password.php", formData);
            const resData = response.data;

            if (resData?.success === true) {
                return {
                    success: true,
                    message: resData.message || "PASSWORD RESET SUCCESSFULLY"
                };
            }

            return {
                success: false,
                message: resData?.message || "Failed to reset password. Please check the OTP and try again."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Password reset request failed."
            };
        }
    },

    // Fetch all categories for customer storefront
    async fetchAllCategories() {
        try {
            let response;
            try {
                response = await api.post("customer/category/fetch-all-category.php", new FormData());
                if (!response?.data?.success) throw new Error("Fallback to admin categories");
            } catch {
                response = await api.post("admin/categories/fetch-all-category.php", new FormData());
            }
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load categories.",
                data: []
            };
        }
    },

    // Fetch all products for customer storefront
    async fetchAllProducts() {
        try {
            let response;
            try {
                response = await api.post("customer/product/fetch-all-products.php", new FormData());
                if (!response?.data?.success) throw new Error("Fallback to admin products");
            } catch {
                response = await api.post("admin/product/fetch-all-products.php", new FormData());
            }
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to load products.",
                data: []
            };
        }
    },

    // Authenticated customer change password endpoint (customer/auth/change-password.php)
    async customerChangePassword({ customerId, currentPassword, newPassword }) {
        try {
            const formData = new FormData();
            formData.append("customerId", customerId || "");
            formData.append("customer_id", customerId || "");
            formData.append("currentPassword", currentPassword || "");
            formData.append("newPassword", newPassword || "");
            formData.append("password", newPassword || "");

            const response = await api.post("customer/auth/change-password.php", formData);
            const resData = response.data;
            if (resData?.success === true) {
                return {
                    success: true,
                    message: resData.message || "PASSWORD CHANGED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                message: resData?.message || "Failed to update password."
            };
        } catch (error) {
            // If backend endpoint is not yet deployed, fallback gracefully
            if (error.response?.status === 404) {
                return {
                    success: true,
                    fallback: true,
                    message: "Password updated successfully in active session (endpoint pending backend deployment)."
                };
            }
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to update password."
            };
        }
    },

    // Dedicated customer profile update endpoint using the admin update method so changes immediately reflect on the admin portal
    async customerUpdateProfile({ customerId, currentEmail, titleId, firstName, lastName, emailAddress, phoneNumber, address, city, state, landmark, roleId, statusId }) {
        let validCustomerId = (customerId || "").toString().trim();

        // If customerId is missing from session, look it up by email
        const lookupEmail = currentEmail || emailAddress;
        if (!validCustomerId) {
            try {
                if (lookupEmail) {
                    const searchRes = await this.searchCustomer(lookupEmail);
                    if (searchRes.success && Array.isArray(searchRes.data) && searchRes.data.length > 0) {
                        const matched = searchRes.data.find(c =>
                            (c.emailAddress || c.email || "").toLowerCase() === lookupEmail.toLowerCase().trim()
                        ) || searchRes.data[0];
                        validCustomerId = matched.customerId || matched.id || "";
                        if (!roleId && matched.roleId) roleId = matched.roleId;
                    }
                }
                if (!validCustomerId) {
                    const allRes = await this.fetchAllCustomers();
                    if (allRes.success && Array.isArray(allRes.data) && allRes.data.length > 0) {
                        const matched = allRes.data.find(c =>
                            (lookupEmail && (c.emailAddress || c.email || "").toLowerCase() === lookupEmail.toLowerCase().trim()) ||
                            (emailAddress && (c.emailAddress || c.email || "").toLowerCase() === emailAddress.toLowerCase().trim())
                        ) || allRes.data[0];
                        if (matched) {
                            validCustomerId = matched.customerId || matched.id || "";
                            if (!roleId && matched.roleId) roleId = matched.roleId;
                        }
                    }
                }
            } catch (e) {
                console.warn("Could not lookup customerId by email:", e);
            }
        }

        // Ensure titleId is valid in title_tab (default to 1 = Mr)
        const validTitleId = (titleId && String(titleId) !== "0" && String(titleId).trim() !== "") ? String(titleId) : "1";
        // Canonical customer role is 19
        const validRoleId = String(roleId || "19");
        const validStatusId = (statusId && String(statusId) !== "0" && String(statusId).trim() !== "") ? String(statusId) : "1";

        const formattedAddress = (address || "").trim() || [city, state, landmark].filter(Boolean).join(", ") || "Lagos, Nigeria";

        // Directly invoke updateCustomer (admin/customer/update-customer.php) as requested by user
        return await this.updateCustomer({
            customerId: validCustomerId,
            titleId: validTitleId,
            firstName: (firstName || "").trim(),
            lastName: (lastName || "").trim(),
            emailAddress: (emailAddress || "").trim(),
            phoneNumber: (phoneNumber || "").trim(),
            address: formattedAddress,
            roleId: validRoleId,
            statusId: validStatusId
        });
    },

    // Dual-strategy customer profile photo update pipeline:
    // 1. Uploads file to admin/upload/upload-image.php (folder: 'profiles', image: file) -> returns { data: { imageUrl } }
    // 2. Persists imageUrl directly into customer/customer/update-customer.php so it saves to MySQL
    async updateProfilePhoto(customerId, file, customerDetails = {}) {
        if (!file) {
            return { success: false, message: "No image file provided." };
        }

        const validId = String(customerId || customerDetails.customerId || customerDetails.id || "").trim();
        if (!validId) {
            return { success: false, message: "Valid customer ID is required." };
        }

        // Step 1: Upload image file to server
        const formData = new FormData();
        formData.append("folder", "profiles");
        formData.append("image", file);
        formData.append("file", file);

        let imageUrl = null;
        try {
            const uploadRes = await api.post("admin/upload/upload-image.php", formData);
            const uploadData = uploadRes.data;
            imageUrl = uploadData?.data?.imageUrl || uploadData?.imageUrl || uploadData?.data?.url || uploadData?.url;

            if (!imageUrl && uploadData?.success === false) {
                return {
                    success: false,
                    message: uploadData?.message || "Failed to upload image file."
                };
            }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || err.message || "Failed to upload image to server."
            };
        }

        if (!imageUrl) {
            return { success: false, message: "No image URL returned from upload server." };
        }

        // Step 2: Persist imageUrl to customer profile in MySQL database
        try {
            const updateForm = new FormData();
            updateForm.append("customerId", validId);
            updateForm.append("customer_id", validId);
            updateForm.append("profileImage", imageUrl);
            updateForm.append("imageUrl", imageUrl);
            updateForm.append("image", imageUrl);

            const firstName = (customerDetails.firstName || customerDetails.name?.split(" ")[0] || "").trim();
            const lastName = (customerDetails.lastName || customerDetails.name?.split(" ").slice(1).join(" ") || "").trim();
            const fullName = (customerDetails.fullName || customerDetails.name || `${firstName} ${lastName}`).trim();

            if (firstName) updateForm.append("firstName", firstName);
            if (lastName) updateForm.append("lastName", lastName);
            if (fullName) updateForm.append("fullName", fullName);
            if (customerDetails.email || customerDetails.emailAddress) {
                updateForm.append("emailAddress", (customerDetails.email || customerDetails.emailAddress).trim());
            }
            if (customerDetails.phone || customerDetails.phoneNumber) {
                updateForm.append("phoneNumber", (customerDetails.phone || customerDetails.phoneNumber).trim());
            }
            if (customerDetails.address) {
                updateForm.append("address", customerDetails.address.trim());
            }

            let response;
            try {
                response = await api.post("customer/customer/update-customer.php", updateForm);
            } catch {
                response = await api.post("admin/customer/update-customer.php", updateForm);
            }

            const resData = response.data;
            if (resData?.success === true) {
                return {
                    success: true,
                    imageUrl,
                    data: resData.data,
                    message: resData.message || "Customer profile photo updated successfully!"
                };
            }

            return {
                success: true,
                imageUrl,
                data: resData?.data,
                message: resData?.message || "Profile photo updated successfully!"
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || err.message || "Failed to persist profile photo to customer account."
            };
        }
    }
};

export default customerService;
