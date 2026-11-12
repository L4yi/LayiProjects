import orderService from "./orderService";

/**
 * Normalizes a fulfilled or refunded backend order into a verified Transaction log.
 * The transaction ID is directly derived from the official MySQL order_id by replacing "ORD" with "TXN".
 */
function mapOrderToTransaction(order) {
    if (!order) return null;

    const rawOrderId = String(order.orderId || order.code || order.id || "").trim();
    const txnCode = rawOrderId.startsWith("ORD")
        ? rawOrderId.replace(/^ORD/, "TXN")
        : (rawOrderId ? `TXN${rawOrderId}` : `TXN${Date.now()}`);

    const sId = String(order.statusId || "");
    const sLower = (order.status || order.statusName || "").toLowerCase();

    const isRefund = sId === "13" || sLower === "reverse" || sLower.includes("refund");
    const isDelivered = sId === "10" || sId === "5" || sLower === "done" || sLower.includes("deliver") || sLower.includes("success");

    let statusLabel = "Paid";
    let statusClass = "paid";

    if (isRefund) {
        statusLabel = "Refunded";
        statusClass = "failed";
    } else if (isDelivered) {
        statusLabel = "Paid";
        statusClass = "paid";
    }

    const priceNum = Number(order.price || order.amount || 0);

    return {
        id: txnCode,
        code: txnCode,
        txnId: txnCode,
        orderId: rawOrderId,
        customerId: order.customerId || "",
        customer: order.customerName || order.name || "Customer",
        customerName: order.customerName || order.name || "Customer",
        email: order.email || order.emailAddress || "",
        phone: order.phone || order.phoneNumber || "",
        address: order.address || "",
        productName: order.productName || "Store Purchase",
        amount: priceNum,
        price: priceNum,
        paymentMethod: order.paymentMethod || "Bank Transfer",
        paymentMethodId: "1",
        date: order.createdAt || "Recent",
        createdAt: order.createdAt || "",
        statusId: sId,
        status: statusLabel,
        statusClass,
        notes: `Settlement for Order #${rawOrderId} (${order.productName || "item"})`
    };
}

export const transactionService = {
    /**
     * Fetches all delivered and refunded orders from the database,
     * converting them into verified, official financial transaction logs.
     */
    async fetchAllTransactions() {
        try {
            const res = await orderService.fetchAllOrders();
            if (res.success && Array.isArray(res.data)) {
                // Filter for finalized financial events: Delivered/Done (10, 5) or Refunded/Reverse (13, 12)
                const settledOrders = res.data.filter(o => {
                    const sId = String(o.statusId || "");
                    const sLower = (o.status || o.statusName || "").toLowerCase();
                    return ["10", "5", "13", "12"].includes(sId) ||
                        ["done", "delivered", "successful", "reverse", "refunded"].some(k => sLower.includes(k));
                });

                const transactions = settledOrders.map(mapOrderToTransaction);

                return {
                    success: true,
                    data: transactions,
                    message: "TRANSACTIONS FETCHED SUCCESSFULLY"
                };
            }

            return {
                success: true,
                data: [],
                message: "No settled transactions recorded yet."
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: error.message || "Failed to load transactions."
            };
        }
    },

    /**
     * Find a single transaction by ID or code.
     */
    async fetchEachTransaction(txnId) {
        try {
            const listRes = await this.fetchAllTransactions();
            if (listRes.success) {
                const found = listRes.data.find(t =>
                    t.id === txnId ||
                    t.code === txnId ||
                    t.orderId === txnId
                );
                if (found) {
                    return { success: true, data: found };
                }
            }
            return { success: false, message: "Transaction record not found." };
        } catch (error) {
            return { success: false, message: error.message || "Error finding transaction." };
        }
    }
};

export default transactionService;
