import api from "../api/axios";

function normalizeOrder(item) {
    if (!item) return null;
    const firstName = item.first_name || item.firstName || "";
    const lastName = item.last_name || item.lastName || "";
    const customerName = `${firstName} ${lastName}`.trim() || item.email_address || item.emailAddress || "Customer";
    const orderId = item.order_id || item.orderId || "";
    const priceNum = Number(item.product_price || item.productPrice || item.price || 0);

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
        statusId: item.status_id || item.statusId || "1",
        status: item.status_name || item.statusName || (item.status_id === "1" ? "ACTIVE" : "PENDING"),
        statusName: item.status_name || item.statusName || (item.status_id === "1" ? "ACTIVE" : "PENDING"),
        createdAt: item.created_at || item.createdAt || "",
        updatedAt: item.updated_at || item.updatedAt || ""
    };
}

export const orderService = {
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

    async createOrder({ customerId, productId, statusId = "1" }) {
        try {
            const formData = new FormData();
            formData.append("customerId", customerId);
            formData.append("productId", productId);
            formData.append("statusId", statusId);

            const response = await api.post("admin/order/create-order.php", formData);
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
