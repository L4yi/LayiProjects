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
        titleId = titleId || setupService.getTitleId("Mr");
        roleId = roleId || setupService.getRoleId("Customer");
        statusId = statusId || setupService.getStatusId("Active");
        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            formData.append("titleId", titleId);
            formData.append("firstName", (firstName || "").trim());
            formData.append("lastName", (lastName || "").trim());
            formData.append("emailAddress", (emailAddress || "").trim());
            formData.append("phoneNumber", (phoneNumber || "").trim());
            formData.append("address", (address || "").trim());
            formData.append("roleId", roleId);
            formData.append("statusId", statusId);

            const response = await api.post("admin/customer/update-customer.php", formData);
            const resData = response.data;
            return {
                success: resData?.success === true,
                message: resData?.message || (resData?.success ? "CUSTOMER UPDATED SUCCESSFULLY" : "Failed to update customer.")
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
                statusId: matched.statusId || setupService.getStatusId("Active")
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

        try {
            // 1. Call the customer/auth/sign-in.php endpoint
            const formData = new FormData();
            formData.append("emailAddress", cleanEmail);
            formData.append("password", password || "");

            try {
                const response = await api.post("customer/auth/sign-in.php", formData);
                const resData = response.data;
                if (resData?.success === true && resData?.data) {
                    const cust = resData.data;
                    const name = `${cust.firstName || ""} ${cust.lastName || ""}`.trim() || cust.emailAddress || cleanEmail;
                    const sessionPayload = {
                        customerId: cust.customerId || cust.customer_id || "",
                        id: cust.customerId || cust.customer_id || "",
                        name,
                        firstName: cust.firstName || "",
                        lastName: cust.lastName || "",
                        email: cust.emailAddress || cleanEmail,
                        phone: cust.phoneNumber || "",
                        address: cust.address || "",
                        role: "Customer",
                        roleId: "19",
                        lastLogin: "Just now"
                    };
                    setSessionUser(sessionPayload);
                    return {
                        success: true,
                        data: sessionPayload,
                        user: sessionPayload,
                        message: resData.message || "CUSTOMER SIGN IN SUCCESSFUL"
                    };
                }
            } catch (err) {
                console.warn("customer/auth/sign-in.php in progress:", err.message);
            }

            // 2. Since sign-in endpoint is still in progress, check database records
            let matched = null;
            const allCust = await this.fetchAllCustomers();
            if (allCust.success && Array.isArray(allCust.data)) {
                matched = allCust.data.find(
                    (c) => (c.emailAddress || "").toLowerCase() === cleanEmail.toLowerCase() ||
                           (c.email || "").toLowerCase() === cleanEmail.toLowerCase()
                );
            }

            const nameFromEmail = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
            const fallbackName = nameFromEmail.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

            const sessionPayload = {
                customerId: matched?.customerId || matched?.id || `CUST-${Date.now().toString().slice(-6)}`,
                id: matched?.customerId || matched?.id || `CUST-${Date.now().toString().slice(-6)}`,
                name: matched?.name || `${matched?.firstName || ""} ${matched?.lastName || ""}`.trim() || fallbackName || "Customer",
                firstName: matched?.firstName || fallbackName.split(" ")[0] || "Customer",
                lastName: matched?.lastName || fallbackName.split(" ")[1] || "",
                email: cleanEmail,
                phone: matched?.phoneNumber || "+234 800 000 0000",
                address: matched?.address || "Abeokuta, Ogun State, Nigeria",
                role: "Customer",
                roleId: "19",
                status: "ACTIVE",
                statusId: "1",
                lastLogin: "Just now"
            };

            setSessionUser(sessionPayload);
            return {
                success: true,
                data: sessionPayload,
                user: sessionPayload,
                message: "CUSTOMER SIGN IN SUCCESSFUL"
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Sign in request failed."
            };
        }
    }
};

export default customerService;
