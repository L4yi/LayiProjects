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

    // Fetches orders for a specific customer with strict ownership enforcement
    async fetchCustomerOrders(customerId, statusId = null) {
        const cleanId = String(customerId || "").trim();
        if (!cleanId) {
            return {
                success: true,
                data: [],
                message: "No customer identified."
            };
        }

        try {
            const formData = new FormData();
            formData.append("customerId", cleanId);
            if (statusId) formData.append("statusId", String(statusId).trim());

            const response = await api.post("customer/order/fetch-customer-orders.php", formData);
            if (response.data?.success && Array.isArray(response.data?.data)) {
                return {
                    success: true,
                    data: response.data.data.map(normalizeOrder),
                    message: response.data.message || "CUSTOMER ORDERS FETCHED"
                };
            }
        } catch (err) {
            console.warn("Customer orders endpoint error:", err?.message || err);
        }

        // Safe scoped fallback: strictly filter by cleanId and NEVER leak other customers' orders
        try {
            const allRes = await this.fetchAllOrders();
            if (allRes.success && Array.isArray(allRes.data)) {
                const filtered = allRes.data.filter(o => {
                    const matchId = String(o.customerId || "").trim() === cleanId;
                    const matchStatus = !statusId || String(o.statusId || "") === String(statusId);
                    return matchId && matchStatus;
                });
                return {
                    success: true,
                    data: filtered,
                    message: "CUSTOMER ORDERS FETCHED"
                };
            }
        } catch (_) {}

        return {
            success: true,
            data: [],
            message: "No orders found."
        };
    },

    // Fetches single order details and receipt via customer/order/fetch-each-order.php
    async fetchEachOrder(orderId, customerId = null) {
        if (!orderId) return { success: false, message: "Order ID is required." };
        try {
            const formData = new FormData();
            formData.append("orderId", String(orderId).trim());
            if (customerId) formData.append("customerId", String(customerId).trim());

            const response = await api.post("customer/order/fetch-each-order.php", formData);
            if (response.data?.success && response.data?.data) {
                const norm = normalizeOrder(response.data.data);
                if (customerId && norm.customerId && String(norm.customerId).trim() !== String(customerId).trim()) {
                    return { success: false, message: "Access denied: You do not own this order record." };
                }
                return {
                    success: true,
                    data: norm,
                    message: response.data.message || "ORDER DETAILS RETRIEVED"
                };
            }
        } catch (err) {
            console.warn("fetchEachOrder error:", err?.message || err);
        }

        return { success: false, message: "Order record not found." };
    },

    // Cancels an active or pending order via customer/order/cancel-order.php
    async cancelOrder(orderId, customerId = null) {
        if (!orderId) return { success: false, message: "Order ID is required." };
        try {
            const formData = new FormData();
            formData.append("orderId", String(orderId).trim());
            if (customerId) formData.append("customerId", String(customerId).trim());

            const response = await api.post("customer/order/cancel-order.php", formData);
            if (response.data?.success) {
                return {
                    success: true,
                    message: response.data.message || "ORDER CANCELLED SUCCESSFULLY"
                };
            }
            return {
                success: false,
                message: response.data?.message || "Failed to cancel order."
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || err.message || "Failed to cancel order."
            };
        }
    },

    // Places a new order in the database for a customer and product / cart items
    async createOrder({ customerId, paymentMethodId = 3, deliveryAddress = "", deliveryPhone = "", productId = null, statusId = null }) {
        statusId = statusId || setupService.getStatusId("Processing");
        try {
            const formData = new FormData();
            formData.append("customerId", String(customerId).trim());
            if (paymentMethodId) formData.append("paymentMethodId", String(paymentMethodId));
            if (deliveryAddress) formData.append("deliveryAddress", String(deliveryAddress).trim());
            if (deliveryPhone) formData.append("deliveryPhone", String(deliveryPhone).trim());
            if (productId) formData.append("productId", String(productId).trim());
            if (statusId) formData.append("statusId", String(statusId).trim());

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
                    data: normalizeOrder(resData.data || resData),
                    raw: resData,
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
