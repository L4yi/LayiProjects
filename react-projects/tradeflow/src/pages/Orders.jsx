import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";

export default function Orders() {
    const [ordersList, setOrdersList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Order");
    const [statusFilter, setStatusFilter] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

    const handleOpenEdit = (order) => {
        setSelectedOrder({ ...order });
        setDrawerTitle(`Edit Order - ${order.code || order.id}`);
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedOrder({
            id: `ORD-${Date.now()}`,
            code: `#ORD-00${ordersList.length + 1}`,
            customerName: "",
            email: "",
            productName: "",
            price: 0,
            amount: 0,
            paymentMethod: "Bank Transfer",
            status: "Pending",
            notes: ""
        });
        setDrawerTitle("Create New Order Request");
        setDrawerOpen(true);
    };

    const handleSaveOrder = (orderData) => {
        const isUpdate = ordersList.some(o => o.id === orderData.id || (orderData.code && o.code === orderData.code));
        setOrdersList(prev => {
            if (isUpdate) {
                return prev.map(o => (o.id === orderData.id || (orderData.code && o.code === orderData.code)) ? { ...o, ...orderData } : o);
            } else {
                return [
                    {
                        ...orderData,
                        id: orderData.id || `ORD-${Date.now()}`,
                        code: orderData.code || `#ORD-00${prev.length + 1}`
                    },
                    ...prev
                ];
            }
        });
        setDrawerOpen(false);
        setModalData({
            type: "success",
            title: isUpdate ? "ORDER UPDATED SUCCESSFULLY!" : "ORDER CREATED SUCCESSFULLY!",
            message: `Order for "${orderData.customerName || orderData.name || "Customer"}" has been recorded.`
        });
        setShowSuccessModal(true);
    };

    const filteredOrders = ordersList.filter(o =>
        !statusFilter || String(o.status || "").toLowerCase() === statusFilter.toLowerCase()
    );

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-cart-check"
                    badgeTitle="Orders"
                    breadcrumb="Sales → Track order fulfillment, customer requests, and items."
                    title="All Orders"
                    countSubtitle={`${filteredOrders.length} customer orders`}
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
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="progress">In Progress</option>
                                    <option value="done">Done</option>
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
                    <LoadingSpinner />
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
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order, idx) => (
                                    <tr key={order.id || idx}>
                                        <td className="col-sn">{idx + 1}</td>
                                        <td className="col-order-id">{order.code}</td>
                                        <td><strong>{order.customerName || order.name || "Customer"}</strong></td>
                                        <td>
                                            <div className="order-product-cell">
                                                <span className="prod-name">{order.productName || "Product"}</span>
                                                {order.productId && <span className="prod-id">ID: {order.productId}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge-pill ${(order.status || "pending").toLowerCase()}`}>
                                                {order.status || "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="action-pill-btn"
                                                onClick={() => handleOpenEdit(order)}
                                            >
                                                View / Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableCard>
                )}
            </div>

            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below to update order status and fulfillment details."
                icon="bi bi-cart-check-fill"
                entityType="Customer Order"
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
