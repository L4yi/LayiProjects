import React, { useState, useEffect } from "react";
import { TransactionSlideDrawer } from "../components/drawers";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import transactionService from "../services/transactionService";
import setupService from "../services/setupService";

export default function Transactions() {
    const [transactionsList, setTransactionsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Transaction Receipt");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusesList, setStatusesList] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

    // Load fulfilled and refunded transactions synchronized with the backend
    const loadTransactions = async () => {
        setIsLoading(true);
        setHasNetworkError(false);
        try {
            const res = await transactionService.fetchAllTransactions();
            if (res.success && Array.isArray(res.data)) {
                setTransactionsList(res.data);
            } else {
                setTransactionsList([]);
            }
        } catch (_) {
            setHasNetworkError(true);
            setTransactionsList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
        // Fetch transaction and payment statuses from backend setup
        setupService.fetchAllStatus().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getTransactionStatuses(res.data));
            }
        });
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
            status: "",
            statusId: "",
            paymentMethodId: "",
            notes: "Exporting all filtered transaction logs..."
        });
        setDrawerTitle("Export Transaction Logs");
        setDrawerOpen(true);
    };

    const filteredTxns = transactionsList.filter((t) => {
        const matchesStatus = !statusFilter || String(t.statusId || "") === String(statusFilter) || (t.status || "").toLowerCase().includes(statusFilter.toLowerCase());
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch = !q ||
            (t.customer && t.customer.toLowerCase().includes(q)) ||
            (t.customerName && t.customerName.toLowerCase().includes(q)) ||
            (t.code && t.code.toLowerCase().includes(q)) ||
            (t.id && String(t.id).toLowerCase().includes(q)) ||
            (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q));
        return matchesStatus && matchesSearch;
    });

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-credit-card-2-front"
                    badgeTitle="Transactions"
                    breadcrumb="Finance → Monitor payment flows, methods, and transaction receipts."
                    title="All Transactions"
                    countSubtitle={filteredTxns.length > 0 ? `${filteredTxns.length} recorded payment logs` : "Backend API integration pending"}
                    actions={
                        <>
                            <div className="filter-select-wrap table-filter-search-wrap">
                                <i className="bi bi-search table-filter-search-icon"></i>
                                <input
                                    type="text"
                                    className="table-filter-search-input"
                                    placeholder="Search transactions..."
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
                                    {/* Render statuses dynamically from backend setup list by ID */}
                                    {statusesList.map(s => (
                                        <option key={s.status_id} value={s.status_id}>{s.status_name}</option>
                                    ))}
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
                    <LoadingSpinner variant="table" columns={["SN", "Customer Name", "Customer ID", "Order Date", "Payment Method", "Amount (₦)", "Status", "Action"]} />
                ) : hasNetworkError ? (
                    <div className="connection-error-box">
                        <i className="bi bi-wifi-off connection-error-icon"></i>
                        <h3 className="connection-error-title">Connection Error</h3>
                        <p className="connection-error-text">
                            Unable to connect to transactions endpoint. Please check your network.
                        </p>
                        <button
                            type="button"
                            onClick={loadTransactions}
                            className="btn-retry-network"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <TableCard
                        title="Transaction History"
                        subtitle="Verified customer checkouts, gateway references, and amounts"
                        isEmpty={filteredTxns.length === 0}
                        emptyMessage="No settled transactions recorded yet. Delivered and refunded orders will automatically appear here."
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

            <TransactionSlideDrawer
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
