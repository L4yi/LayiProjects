import React, { useState, useEffect } from "react";
import { OrderSlideDrawer } from "../components/drawers";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import orderService from "../services/orderService";
import customerService from "../services/customerService";
import productService from "../services/productService";
import setupService from "../services/setupService";

export default function Orders() {
    const [ordersList, setOrdersList] = useState([]);
    const [statusesList, setStatusesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerError, setDrawerError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Order");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const loadOrders = async () => {
        setIsLoading(true);
        setHasNetworkError(false);
        try {
            const res = await orderService.fetchAllOrders();
            if (res.success && Array.isArray(res.data)) {
                setOrdersList(res.data);
            } else {
                setOrdersList([]);
                if (res.message?.includes("Failed to connect") || res.message?.includes("network")) {
                    setHasNetworkError(true);
                }
            }
        } catch (_) {
            setHasNetworkError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // Load order fulfillment & payment statuses from backend setup
        setupService.fetchAllStatus().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getOrderStatuses(res.data));
            }
        });
    }, []);

    const handleOpenEdit = (order) => {
        setSelectedOrder({ ...order });
        setDrawerTitle(`Order Details - ${order.code || order.id}`);
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedOrder({
            id: "",
            code: "",
            customerId: "",
            customerName: "",
            productId: "",
            productName: "",
            price: "",
            amount: "",
            paymentMethod: "Bank Transfer",
            status: "Processing",
            statusId: "4",
            notes: ""
        });
        setDrawerTitle("Create New Order Request");
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleSaveOrder = async (orderData) => {
        setIsSaving(true);
        setDrawerError("");

        const isUpdate = Boolean(selectedOrder && (selectedOrder.id || selectedOrder.orderId || selectedOrder.code));
        const orderId = selectedOrder?.id || selectedOrder?.orderId || selectedOrder?.code || orderData.id || orderData.orderId || orderData.code;
        const customerId = orderData.customerId || orderData.customer_id || selectedOrder?.customerId || selectedOrder?.customer_id;
        const productId = orderData.productId || orderData.product_id || selectedOrder?.productId || selectedOrder?.product_id;
        // Default to status ID 4 (PROCESSING)
        const statusId = orderData.statusId || setupService.getStatusId(orderData.status) || "4";

        if (!customerId || !productId) {
            setIsSaving(false);
            setDrawerError("Both Customer and Product are required to record an order.");
            return;
        }

        try {
            let res;
            if (isUpdate) {
                res = await orderService.updateOrder({
                    orderId,
                    customerId,
                    productId,
                    statusId
                });
            } else {
                res = await orderService.createOrder({
                    customerId,
                    productId,
                    statusId
                });
            }

            setIsSaving(false);

            if (res.success) {
                setDrawerOpen(false);
                await loadOrders();
                setModalData({
                    type: "success",
                    title: isUpdate ? "ORDER UPDATED SUCCESSFULLY!" : "ORDER CREATED SUCCESSFULLY!",
                    message: res.message || (isUpdate ? `Order "${orderId}" status updated successfully.` : `Order for "${orderData.customerName || "Customer"}" has been recorded in database.`)
                });
                setShowSuccessModal(true);
            } else {
                setDrawerError(res.message || "Failed to submit order.");
            }
        } catch (err) {
            setIsSaving(false);
            setDrawerError("Unable to reach server. Please check your network connection.");
        }
    };

    const handleMarkDelivered = async (order) => {
        const orderId = order.id || order.orderId || order.code;
        const customerId = order.customerId || order.customer_id;
        const productId = order.productId || order.product_id;
        // Status ID 10 = Done / Delivered (Fulfillment completed in database setup)
        const statusId = "10";

        setIsLoading(true);
        try {
            const res = await orderService.updateOrder({
                orderId,
                customerId,
                productId,
                statusId
            });

            if (res.success) {
                // Also update local storage if tradeflow_orders has it
                try {
                    const local = JSON.parse(localStorage.getItem("tradeflow_orders") || "[]");
                    const updated = local.map(o => {
                        if (o.orderId === orderId || o.backendOrderId === orderId) {
                            return { ...o, status: "Delivered", rawStatus: "Done" };
                        }
                        return o;
                    });
                    localStorage.setItem("tradeflow_orders", JSON.stringify(updated));
                } catch (_) {}

                await loadOrders();
                setModalData({
                    type: "success",
                    title: "ORDER MARKED AS DELIVERED!",
                    message: `Order #${orderId} is now marked as Delivered and has been moved to Transactions.`
                });
            } else {
                setModalData({
                    type: "warning",
                    title: "UPDATE FAILED",
                    message: res.message || "Failed to update order status on server."
                });
            }
        } catch (err) {
            setModalData({
                type: "error",
                title: "NETWORK ERROR",
                message: "Unable to reach server to update order status."
            });
        } finally {
            setShowSuccessModal(true);
            setIsLoading(false);
        }
    };

    const handleMarkRefunded = async (order) => {
        const orderId = order.id || order.orderId || order.code;
        const customerId = order.customerId || order.customer_id;
        const productId = order.productId || order.product_id;
        // Status ID 13 = Reverse / Refunded in database setup
        const statusId = "13";

        setIsLoading(true);
        try {
            const res = await orderService.updateOrder({
                orderId,
                customerId,
                productId,
                statusId
            });

            if (res.success) {
                try {
                    const local = JSON.parse(localStorage.getItem("tradeflow_orders") || "[]");
                    const updated = local.map(o => {
                        if (o.orderId === orderId || o.backendOrderId === orderId) {
                            return { ...o, status: "Refunded", rawStatus: "Reverse" };
                        }
                        return o;
                    });
                    localStorage.setItem("tradeflow_orders", JSON.stringify(updated));
                } catch (_) {}

                await loadOrders();
                setModalData({
                    type: "success",
                    title: "ORDER MARKED AS REFUNDED!",
                    message: `Order #${orderId} has been marked as Refunded / Reversed in the system.`
                });
            } else {
                setModalData({
                    type: "warning",
                    title: "REFUND UPDATE FAILED",
                    message: res.message || "Failed to record refund on server."
                });
            }
        } catch (err) {
            setModalData({
                type: "error",
                title: "NETWORK ERROR",
                message: "Unable to reach server to process refund."
            });
        } finally {
            setShowSuccessModal(true);
            setIsLoading(false);
        }
    };

    const handleRequestDelete = (order) => {
        setOrderToDelete(order);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;
        const orderId = orderToDelete.id || orderToDelete.orderId || orderToDelete.code;

        setShowDeleteConfirm(false);
        setIsLoading(true);
        try {
            const res = await orderService.deleteOrder(orderId);
            if (res.success) {
                await loadOrders();
                setModalData({
                    type: "success",
                    title: "ORDER DELETED SUCCESSFULLY",
                    message: `Order #${orderId} has been permanently removed.`
                });
            } else {
                setModalData({
                    type: "warning",
                    title: "DELETE FAILED",
                    message: res.message || "Failed to delete order from database."
                });
            }
        } catch (e) {
            setModalData({
                type: "error",
                title: "NETWORK ERROR",
                message: e.message || "An error occurred while deleting the order."
            });
        } finally {
            setOrderToDelete(null);
            setShowSuccessModal(true);
            setIsLoading(false);
        }
    };

    const filteredOrders = ordersList.filter((o) => {
        const matchesStatus = !statusFilter || String(o.statusId) === String(statusFilter);
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch = !q ||
            (o.customer && o.customer.toLowerCase().includes(q)) ||
            (o.customerName && o.customerName.toLowerCase().includes(q)) ||
            (o.product && o.product.toLowerCase().includes(q)) ||
            (o.productName && o.productName.toLowerCase().includes(q)) ||
            (o.code && o.code.toLowerCase().includes(q)) ||
            (o.id && String(o.id).toLowerCase().includes(q));
        return matchesStatus && matchesSearch;
    });

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-cart-check"
                    badgeTitle="Orders"
                    breadcrumb="Sales → Track order fulfillment, customer requests, and items."
                    title="All Orders"
                    countSubtitle={`${filteredOrders.length} customer order${filteredOrders.length === 1 ? "" : "s"}`}
                    actions={
                        <>
                            <div className="filter-select-wrap table-filter-search-wrap">
                                <i className="bi bi-search table-filter-search-icon"></i>
                                <input
                                    type="text"
                                    className="table-filter-search-input"
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="table-filter-clear-btn"
                                        title="Clear search"
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                )}
                            </div>

                            <div className="filter-select-wrap">
                                <i className="bi bi-funnel"></i>
                                <select
                                    className="filter-dropdown-select"
                                    title="Filter by Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    {statusesList.map(s => (
                                        <option key={s.status_id} value={s.status_id}>{s.status_name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                className="btn-add-entity"
                                onClick={handleOpenAdd}
                            >
                                <i className="bi bi-plus-lg"></i> New Order
                            </button>
                        </>
                    }
                />

                {isLoading ? (
                    <LoadingSpinner variant="table" columns={["SN", "Order ID", "Customer Name", "Items / Product", "Price / Amount", "Payment Method", "Status", "Action"]} />
                ) : hasNetworkError ? (
                    <div className="connection-error-box">
                        <i className="bi bi-wifi-off connection-error-icon"></i>
                        <h3 className="connection-error-title">Connection Error</h3>
                        <p className="connection-error-text">
                            Unable to connect to orders endpoint. Please check your network.
                        </p>
                        <button
                            type="button"
                            onClick={loadOrders}
                            className="btn-retry-network"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <TableCard
                        title="Order Processing"
                        subtitle="Customer fulfillment pipelines and delivery logs"
                        isEmpty={filteredOrders.length === 0}
                        emptyMessage="No customer orders recorded yet."
                    >
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Order ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Customer Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Product Details <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Price <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, idx) => (
                                    <tr key={order.id || idx}>
                                        <td className="col-sn">{idx + 1}</td>
                                        <td className="col-order-id">{order.code || order.id}</td>
                                        <td>
                                            <strong>{order.customerName || "Customer"}</strong>
                                            {order.phone && <div className="table-cell-ellipsis-sub">{order.phone}</div>}
                                        </td>
                                        <td>
                                            <div className="order-product-cell">
                                                <span className="prod-name">{order.productName || "Product"}</span>
                                                {order.productId && <span className="prod-id">ID: {order.productId}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="order-amount-text">
                                                ₦ {Number(order.price || order.amount || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td>
                                            {(() => {
                                                const sId = String(order.statusId || "");
                                                const sLower = (order.status || "").toLowerCase();
                                                let label = order.status || "Processing";
                                                let pillClass = "processing";

                                                if (sId === "10" || sLower === "done" || sLower.includes("deliver")) {
                                                    label = "Delivered";
                                                    pillClass = "successful";
                                                } else if (sId === "5" || sLower.includes("success")) {
                                                    label = "Delivered";
                                                    pillClass = "successful";
                                                } else if (sId === "13" || sLower === "reverse" || sLower.includes("refund")) {
                                                    label = "Refunded";
                                                    pillClass = "failed";
                                                } else if (sId === "12" || sLower.includes("cancel")) {
                                                    label = "Cancelled";
                                                    pillClass = "failed";
                                                }

                                                return (
                                                    <span className={`status-badge-pill ${pillClass}`}>
                                                        {label}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td>
                                            <div className="action-btn-group">
                                                {!["10", "5", "13", "12"].includes(String(order.statusId)) && !["successful", "done", "delivered", "confirmed", "refunded", "reverse", "canceled"].includes((order.status || "").toLowerCase()) && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn-order-action-delivered"
                                                            onClick={() => handleMarkDelivered(order)}
                                                            title="Mark as Delivered & Move to Transactions"
                                                        >
                                                            <i className="bi bi-truck"></i>
                                                            <span>Delivered</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn-order-action-refunded"
                                                            onClick={() => handleMarkRefunded(order)}
                                                            title="Mark as Refunded"
                                                        >
                                                            <i className="bi bi-arrow-counterclockwise"></i>
                                                            <span>Refund</span>
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    type="button"
                                                    className="btn-edit btn-table-action-delete"
                                                    onClick={() => handleRequestDelete(order)}
                                                    title="Delete Order"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableCard>
                )}
            </div>

            <OrderSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below to update order status and fulfillment details."
                icon="bi bi-cart-check-fill"
                entityType="Order"
                initialData={selectedOrder || {}}
                isSaving={isSaving}
                errorMessage={drawerError}
                onSave={handleSaveOrder}
            />

            {/* Custom Delete Confirmation Modal */}
            <StatusModal
                isOpen={showDeleteConfirm}
                type="delete"
                title="Delete Order?"
                message={`Are you sure you want to permanently delete order #${orderToDelete?.id || orderToDelete?.orderId || 'this order'}? This action cannot be undone.`}
                showCancel={true}
                cancelButtonText="Cancel"
                confirmButtonText="Yes, Delete"
                confirmVariant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setOrderToDelete(null);
                }}
            />

            <StatusModal
                isOpen={showSuccessModal}
                type={modalData.type || "success"}
                title={modalData.title}
                message={modalData.message}
                buttonText="Okay, Continue"
                onConfirm={() => setShowSuccessModal(false)}
            />
        </>
    );
}
