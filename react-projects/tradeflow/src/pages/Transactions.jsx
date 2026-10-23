import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";

export default function Transactions() {
    const [transactionsList, setTransactionsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Transaction Receipt");
    const [statusFilter, setStatusFilter] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

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

    const filteredTxns = transactionsList.filter(t =>
        !statusFilter || String(t.status || "").toLowerCase() === statusFilter.toLowerCase()
    );

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
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
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
                    <LoadingSpinner />
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
