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
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Order");
    const [statusFilter, setStatusFilter] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

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
        // load statuses from backend for filter
        setupService.fetchAllStatus().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(res.data);
            }
        });
    }, []);

    const handleOpenEdit = (order) => {
        setSelectedOrder({ ...order });
        setDrawerTitle(`Order Details - ${order.code || order.id}`);
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
            price: 0,
            amount: 0,
            paymentMethod: "Bank Transfer",
            status: "Processing",
            statusId: setupService.getStatusId("Processing"),
            notes: ""
        });
        setDrawerTitle("Create New Order Request");
        setDrawerOpen(true);
    };

    const handleSaveOrder = async (orderData) => {
        setDrawerOpen(false);
        setIsLoading(true);

        const isUpdate = Boolean(selectedOrder && (selectedOrder.id || selectedOrder.orderId || selectedOrder.code));
        const orderId = selectedOrder?.id || selectedOrder?.orderId || selectedOrder?.code || orderData.id || orderData.orderId || orderData.code;
        const customerId = orderData.customerId || orderData.customer_id || selectedOrder?.customerId || selectedOrder?.customer_id;
        const productId = orderData.productId || orderData.product_id || selectedOrder?.productId || selectedOrder?.product_id;
        // Look up status ID from backend setup data or use what the drawer passed
        const statusId = orderData.statusId || setupService.getStatusId(orderData.status);

        if (!customerId || !productId) {
            setModalData({
                type: "warning",
                title: "REQUIRED FIELDS MISSING",
                message: "Both Customer ID and Product ID are required to record an order."
            });
            setShowSuccessModal(true);
            setIsLoading(false);
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

            if (res.success) {
                await loadOrders();
                setModalData({
                    type: "success",
                    title: isUpdate ? "ORDER UPDATED SUCCESSFULLY!" : "ORDER CREATED SUCCESSFULLY!",
                    message: res.message || (isUpdate ? `Order "${orderId}" status updated successfully.` : `Order for "${orderData.customerName || "Customer"}" has been recorded in database.`)
                });
                setShowSuccessModal(true);
            } else {
                setModalData({
                    type: "error",
                    title: isUpdate ? "ORDER UPDATE FAILED" : "ORDER CREATION FAILED",
                    message: res.message || "Failed to submit order."
                });
                setShowSuccessModal(true);
            }
        } catch (err) {
            setModalData({
                type: "error",
                title: "NETWORK ERROR",
                message: "Unable to reach server. Please check your network connection."
            });
            setShowSuccessModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOrder = async (order) => {
        const orderId = order.id || order.orderId || order.code;
        if (!orderId) return;
        if (!window.confirm(`Are you sure you want to delete order "${orderId}"?`)) return;

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
            setShowSuccessModal(true);
            setIsLoading(false);
        }
    };

    const filteredOrders = ordersList.filter(o => {
        if (!statusFilter) return true;
        const s = (o.status || "").toLowerCase();
        return s === statusFilter.toLowerCase();
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
                            <div className="filter-select-wrap">
                                <i className="bi bi-funnel"></i>
                                <select
                                    className="filter-dropdown-select"
                                    title="Filter by Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    {statusesList.filter(s => ["4", "5", "8", "9"].includes(String(s.status_id))).length > 0 ? (
                                        statusesList.filter(s => ["4", "5", "8", "9"].includes(String(s.status_id))).map(s => (
                                            <option key={s.status_id} value={s.status_name.toLowerCase()}>{s.status_name}</option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="successful">Successful</option>
                                            <option value="processing">Processing</option>
                                            <option value="paid">Paid</option>
                                            <option value="failed">Failed</option>
                                        </>
                                    )}
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
                    <LoadingSpinner message="Fetching orders from database..." />
                ) : hasNetworkError ? (
                    <div
                        style={{
                            margin: "24px 0",
                            padding: "24px",
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            borderRadius: "12px",
                            textAlign: "center"
                        }}
                    >
                        <i className="bi bi-wifi-off" style={{ fontSize: "2rem", color: "#e11d48", display: "block", marginBottom: "8px" }}></i>
                        <h3 style={{ margin: "0 0 6px", color: "#9f1239" }}>Connection Error</h3>
                        <p style={{ margin: "0 0 16px", color: "#881337", fontSize: "0.9rem" }}>
                            Unable to connect to orders endpoint. Please check your network.
                        </p>
                        <button
                            type="button"
                            onClick={loadOrders}
                            style={{
                                padding: "8px 18px",
                                background: "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <TableCard
                        title="Order Processing"
                        subtitle="Customer fulfillment pipelines and delivery logs"
                        isEmpty={filteredOrders.length === 0}
                        emptyMessage="No customer orders recorded yet in database."
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
                                            {order.phone && <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{order.phone}</div>}
                                        </td>
                                        <td>
                                            <div className="order-product-cell">
                                                <span className="prod-name">{order.productName || "Product"}</span>
                                                {order.productId && <span className="prod-id">ID: {order.productId}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600, color: "#0f172a" }}>
                                                ₦ {Number(order.price || order.amount || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge-pill ${(order.status || "processing").toLowerCase()}`}>
                                                {order.status || "Processing"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btn-group">
                                                <button
                                                    type="button"
                                                    className="action-pill-btn"
                                                    onClick={() => handleOpenEdit(order)}
                                                    title="View Details"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-edit"
                                                    style={{ color: "#e53e3e", borderColor: "#feb2b2", background: "#fff5f5" }}
                                                    onClick={() => handleDeleteOrder(order)}
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
                onSave={handleSaveOrder}
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
