import React, { useState, useEffect } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import orderService from "../services/orderService";

export default function Transactions() {
    const [transactionsList, setTransactionsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Transaction Receipt");
    const [statusFilter, setStatusFilter] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

    const loadTransactions = async () => {
        setIsLoading(true);
        setHasNetworkError(false);
        try {
            const res = await orderService.fetchAllOrders();
            if (res.success && Array.isArray(res.data)) {
                const mapped = res.data.map((order, idx) => ({
                    id: order.id || `TXN-${idx + 1}`,
                    code: order.code ? (order.code.startsWith("#") ? order.code : `#${order.code}`) : `#TXN-${order.id || idx + 1}`,
                    name: order.customerName || order.customer_name || "Customer",
                    customerName: order.customerName || order.customer_name || "Customer",
                    email: order.customerEmail || order.email || "—",
                    amount: order.price || order.product_price || order.amount || 0,
                    paymentMethod: "Bank Transfer",
                    status: order.status || "PAID",
                    date: order.date || order.created_at || "—",
                    notes: order.productName || order.product_name || "Store Order"
                }));
                setTransactionsList(mapped);
            } else {
                setTransactionsList([]);
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
        loadTransactions();
    }, []);

    const handleOpenEdit = (txn) => {
        setSelectedTxn({ ...txn });
        setDrawerTitle(`Transaction Details - ${txn.code || txn.id}`);
        setDrawerOpen(true);
    };

    const handleSaveTransaction = (txnData) => {
        const isUpdate = transactionsList.some(t => t.id === txnData.id || (txnData.code && t.code === txnData.code));
        setTransactionsList(prev => {
            if (isUpdate) {
                return prev.map(t => (t.id === txnData.id || (txnData.code && t.code === txnData.code)) ? { ...t, ...txnData } : t);
            } else {
                return [
                    {
                        ...txnData,
                        id: txnData.id || `TXN-${Date.now()}`,
                        code: txnData.code || `#TXN-00${prev.length + 1}`
                    },
                    ...prev
                ];
            }
        });
        setDrawerOpen(false);
        setModalData({
            type: "success",
            title: isUpdate ? "TRANSACTION UPDATED SUCCESSFULLY!" : "TRANSACTION RECORDED SUCCESSFULLY!",
            message: `Transaction record ${txnData.code || txnData.id} has been saved.`
        });
        setShowSuccessModal(true);
    };

    const handleOpenExport = () => {
        setSelectedTxn({
            name: "Audit Export",
            code: "#EXP-2026",
            role: "Financial Report",
            status: "ACTIVE",
            notes: "Exporting all filtered transaction logs..."
        });
        setDrawerTitle("Export Transaction Logs");
        setDrawerOpen(true);
    };

    const filteredTxns = transactionsList.filter(t => {
        if (!statusFilter) return true;
        const s = String(t.status || "").toLowerCase();
        const f = statusFilter.toLowerCase();
        if (f === "paid" && (s === "paid" || s === "active")) return true;
        if (f === "active" && (s === "active" || s === "paid")) return true;
        return s === f;
    });

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-credit-card-2-front"
                    badgeTitle="Transactions"
                    breadcrumb="Finance → Monitor payment flows, methods, and transaction receipts."
                    title="All Transactions"
                    countSubtitle={`${filteredTxns.length} recorded payment logs`}
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
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                className="btn-add-entity"
                                onClick={handleOpenExport}
                            >
                                <i className="bi bi-download"></i> Export Logs
                            </button>
                        </>
                    }
                />

                {isLoading ? (
                    <LoadingSpinner message="Fetching transactions from database..." />
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
                            Unable to connect to transactions endpoint. Please check your network.
                        </p>
                        <button
                            type="button"
                            onClick={loadTransactions}
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
                        title="Transaction History"
                        subtitle="Verified customer checkouts, gateway references, and amounts"
                        isEmpty={filteredTxns.length === 0}
                        emptyMessage="No transactions recorded yet in database."
                    >
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Transaction ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Customer Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Amount (₦) <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Payment Method <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTxns.map((txn, idx) => (
                                    <tr key={txn.id || idx}>
                                        <td className="col-sn">{idx + 1}</td>
                                        <td className="col-txn-id">{txn.code}</td>
                                        <td>
                                            <div className="txn-customer-cell">
                                                <div className="txn-avatar">{String(txn.customerName || txn.name || "TX").substring(0, 2).toUpperCase()}</div>
                                                <div className="txn-cust-info">
                                                    <span className="txn-cust-name">{txn.customerName || txn.name || "Customer"}</span>
                                                    <span className="txn-cust-email">{txn.email || "—"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-amount">₦ {Number(txn.amount || 0).toLocaleString()}</td>
                                        <td>
                                            <div className="payment-method-cell">
                                                <i className="bi bi-bank"></i>
                                                <span>{txn.paymentMethod || "Bank Transfer"}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge-pill ${(txn.status || "paid").toLowerCase()}`}>
                                                {txn.status || "PAID"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="action-pill-btn"
                                                onClick={() => handleOpenEdit(txn)}
                                            >
                                                View
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
                subtitle="Please complete the form below to update payment record."
                icon="bi bi-receipt"
                entityType="Transaction Log"
                initialData={selectedTxn || {}}
                onSave={handleSaveTransaction}
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
