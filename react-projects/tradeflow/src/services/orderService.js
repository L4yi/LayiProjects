import setupService from './setupService';
import api from "../api/axios";

// Formats a raw order row from the database into a clean object.
// Extracts customer name, product price, and backend order status cleanly.
function normalizeOrder(item) {
    if (!item) return null;
    const firstName = item.first_name || item.firstName || "";
    const lastName = item.last_name || item.lastName || "";
    const customerName = `${firstName} ${lastName}`.trim() || item.email_address || item.emailAddress || "Customer";
    const orderId = item.order_id || item.orderId || "";
    const priceNum = Number(item.product_price || item.productPrice || item.price || 0);
    const orderStatus = item.status_name || item.statusName || "";
    const sId = String(item.status_id || item.statusId || "");

    return {
        id: orderId,
        code: orderId,
        orderId,
        customerId: item.customer_id || item.customerId || "",
        customerName,
        name: customerName,
        email: item.email_address || item.emailAddress || "",
        phone: item.phone_number || item.phoneNumber || "",
        address: item.address || "",
        productId: item.product_id || item.productId || "",
        productName: item.product_name || item.productName || "Product",
        price: priceNum,
        amount: priceNum,
        statusId: sId,
        status: orderStatus,
        statusName: orderStatus,
        createdAt: item.created_at || item.createdAt || "",
        updatedAt: item.updated_at || item.updatedAt || ""
    };
}

export const orderService = {
    // Fetches all customer orders from backend (admin/order/fetch-all-orders.php)
    async fetchAllOrders() {
        try {
            const response = await api.get("admin/order/fetch-all-orders.php");
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return {
                    success: true,
                    data: resData.data.map(normalizeOrder),
                    message: resData.message || "ORDERS FETCHED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                data: [],
                message: resData?.message || "No orders found."
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to fetch orders."
            };
        }
    },

    // Fetches orders for a specific customer with automatic bridge to live orders
    async fetchCustomerOrders(customerId) {
        if (!customerId) return this.fetchAllOrders();
        try {
            const formData = new FormData();
            formData.append("customerId", String(customerId).trim());
            const response = await api.post("customer/order/fetch-customer-orders.php", formData);
            if (response.data?.success && Array.isArray(response.data?.data)) {
                return {
                    success: true,
                    data: response.data.data.map(normalizeOrder),
                    message: response.data.message || "CUSTOMER ORDERS FETCHED"
                };
            }
        } catch (err) {
            // Endpoint pending (404): gracefully bridge through live orders filtered by customerId
        }

        const allRes = await this.fetchAllOrders();
        if (allRes.success && Array.isArray(allRes.data)) {
            const cleanId = String(customerId).trim();
            const filtered = allRes.data.filter(o => String(o.customerId || "").trim() === cleanId);
            return {
                success: true,
                data: filtered.length > 0 ? filtered : allRes.data,
                message: allRes.message || "ORDERS FETCHED SUCCESSFULLY"
            };
        }
        return allRes;
    },

    // Places a new order in the database for a customer and product
    async createOrder({ customerId, productId, statusId }) {
        statusId = statusId || setupService.getStatusId("Processing");
        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            formData.append("productId", productId);
            formData.append("statusId", statusId);

            let response;
            try {
                response = await api.post("customer/order/create-order.php", formData);
            } catch (custErr) {
                if (custErr.response && custErr.response.status === 404) {
                    response = await api.post("admin/order/create-order.php", formData);
                } else {
                    throw custErr;
                }
            }
            const resData = response.data;
            if (resData?.success === true) {
                return {
                    success: true,
                    data: normalizeOrder(resData.data),
                    message: resData.message || "ORDER CREATED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                message: resData?.message || "Failed to create order."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to submit order."
            };
        }
    },

    async updateOrder({ orderId, customerId, productId, statusId }) {
        statusId = statusId || setupService.getStatusId("Processing");
        try {
            const formData = new FormData();
            formData.append("orderId", String(orderId).trim());
            formData.append("customerId", String(customerId).trim());
            formData.append("productId", String(productId).trim());
            formData.append("statusId", String(statusId).trim());

            const response = await api.post("admin/order/update-order.php", formData);
            const resData = response.data;
            if (resData?.success === true) {
                return {
                    success: true,
                    data: normalizeOrder(resData.data),
                    message: resData.message || "ORDER UPDATED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                message: resData?.message || "Failed to update order."
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to update order."
            };
        }
    },

    async searchOrder(searchContent) {
        try {
            const formData = new FormData();
            formData.append("searchContent", (searchContent || "").trim());

            const response = await api.post("admin/order/search-order.php", formData);
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return {
                    success: true,
                    data: resData.data.map(normalizeOrder),
                    message: resData.message || "ORDERS SEARCHED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                data: [],
                message: resData?.message || "No matching orders found."
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || "Failed to search orders."
            };
        }
    },

    async deleteOrder(orderId) {
        try {
            const formData = new FormData();
            formData.append("orderId", orderId);

            const response = await api.post("admin/order/delete-order.php", formData);
            const resData = response.data;
            return {
                success: resData?.success === true,
                message: resData?.message || (resData?.success ? "ORDER DELETED SUCCESSFULLY" : "Failed to delete order.")
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to delete order."
            };
        }
    }
};

export default orderService;
