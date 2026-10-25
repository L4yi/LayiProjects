import api from "../api/axios";
import { setSessionUser } from "../utils/session";

function normalizeCustomer(item) {
    if (!item) return null;
    const firstName = item.first_name || item.firstName || "";
    const lastName = item.last_name || item.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || item.email_address || item.emailAddress || "Customer";

    return {
        id: item.customer_id || item.customerId || "",
        customerId: item.customer_id || item.customerId || "",
        titleId: item.title_id || item.titleId || "1",
        titleName: item.title_name || item.titleName || "Mr",
        firstName,
        lastName,
        name: fullName,
        email: item.email_address || item.emailAddress || "",
        emailAddress: item.email_address || item.emailAddress || "",
        phone: item.phone_number || item.phoneNumber || "",
        phoneNumber: item.phone_number || item.phoneNumber || "",
        address: item.address || "",
        statusId: item.status_id || item.statusId || "1",
        status: item.status_name || item.statusName || (item.status_id === "2" ? "INACTIVE" : "ACTIVE"),
        statusName: item.status_name || item.statusName || (item.status_id === "2" ? "INACTIVE" : "ACTIVE"),
        roleId: item.role_id || item.roleId || "19",
        role: item.role_name || item.roleName || "Customer",
        roleName: item.role_name || item.roleName || "Customer",
        createdAt: item.created_at || item.createdAt || "",
        updatedAt: item.updated_at || item.updatedAt || ""
    };
}

export const customerService = {
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
            const params = new URLSearchParams();
            params.append("customerId", customerId);
            const response = await api.post("admin/customer/fetch-each-customer.php", params);
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
            const params = new URLSearchParams();
            params.append("searchContent", (searchContent || "").trim());
            const response = await api.post("admin/customer/search-customer.php", params);
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

    async createCustomer({ titleId = "1", firstName, lastName, emailAddress, phoneNumber, address, roleId = "19", statusId = "1" }) {
        try {
            const params = new URLSearchParams();
            params.append("titleId", titleId);
            params.append("firstName", (firstName || "").trim());
            params.append("lastName", (lastName || "").trim());
            params.append("emailAddress", (emailAddress || "").trim());
            params.append("phoneNumber", (phoneNumber || "").trim());
            params.append("address", (address || "").trim());
            params.append("roleId", roleId);
            params.append("statusId", statusId);

            const response = await api.post("admin/customer/create-customer.php", params);
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

    async updateCustomer({ customerId, titleId = "1", firstName, lastName, emailAddress, phoneNumber, address, roleId = "19", statusId = "1" }) {
        try {
            const params = new URLSearchParams();
            params.append("customerId", customerId);
            params.append("titleId", titleId);
            params.append("firstName", (firstName || "").trim());
            params.append("lastName", (lastName || "").trim());
            params.append("emailAddress", (emailAddress || "").trim());
            params.append("phoneNumber", (phoneNumber || "").trim());
            params.append("address", (address || "").trim());
            params.append("roleId", roleId);
            params.append("statusId", statusId);

            const response = await api.post("admin/customer/update-customer.php", params);
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
            const params = new URLSearchParams();
            params.append("customerId", customerId);
            const response = await api.post("admin/customer/delete-customer.php", params);
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

    async createOrder({ customerId, productId, statusId = "1" }) {
        try {
            const params = new URLSearchParams();
            params.append("customerId", customerId);
            params.append("productId", productId);
            params.append("statusId", statusId);

            const response = await api.post("admin/order/create-order.php", params);
            const resData = response.data;
            return {
                success: resData?.success === true,
                data: resData?.data,
                message: resData?.message || (resData?.success ? "ORDER CREATED SUCCESSFULLY" : "Failed to create order.")
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to submit order."
            };
        }
    },

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
                roleId: matched.roleId || "19",
                status: matched.status || "ACTIVE",
                statusId: matched.statusId || "1"
            };

            setSessionUser(sessionPayload);
            return {
                success: true,
                message: "CUSTOMER LOGIN SUCCESSFUL",
                user: sessionPayload
            };
        }

        return {
            success: false,
            message: "No registered customer found with this email. Please create an account to continue."
        };
    }
};

export default customerService;
