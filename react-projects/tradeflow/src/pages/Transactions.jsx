import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";

export default function Transactions() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Transaction Receipt");

    const handleOpenEdit = (txnId, custName) => {
        setSelectedTxn({
            name: custName,
            code: txnId,
            role: "Payment Receipt",
            status: "ACTIVE",
            notes: `Verified payment log for ${txnId}`
        });
        setDrawerTitle(`Transaction Details - ${txnId}`);
        setDrawerOpen(true);
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

    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-credit-card-2-front"></i>
                        <span>Transactions</span>
                    </div>
                    <div className="module-breadcrumb">
                        Finance &rarr; Monitor payment flows, methods, and transaction receipts.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Transactions</h2>
                        <span className="module-count-subtitle">18 recorded payment logs</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select className="filter-dropdown-select" title="Filter by Status" defaultValue="">
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
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Transaction ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Customer Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Amount <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Payment Method <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="col-sn">1</td>
                                    <td className="col-txn-id">#TXN-88101</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Alexander Wright</span>
                                            <span className="cust-email">alexander.w@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$420.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">2</td>
                                    <td className="col-txn-id">#TXN-88102</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Sophia Martinez</span>
                                            <span className="cust-email">sophia.m@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$150.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill pending">PENDING</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">3</td>
                                    <td className="col-txn-id">#TXN-88103</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Daniel Sterling</span>
                                            <span className="cust-email">daniel.s@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$24.50</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">4</td>
                                    <td className="col-txn-id">#TXN-88104</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Olivia Chen</span>
                                            <span className="cust-email">olivia.c@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$85.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">5</td>
                                    <td className="col-txn-id">#TXN-88105</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Marcus Johnson</span>
                                            <span className="cust-email">marcus.j@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$99.99</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill pending">PENDING</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">6</td>
                                    <td className="col-txn-id">#TXN-88106</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Emma Richardson</span>
                                            <span className="cust-email">emma.r@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$210.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">7</td>
                                    <td className="col-txn-id">#TXN-88107</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Lucas Taylor</span>
                                            <span className="cust-email">lucas.t@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$850.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">8</td>
                                    <td className="col-txn-id">#TXN-88108</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Amelia Brown</span>
                                            <span className="cust-email">amelia.b@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$320.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill pending">PENDING</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">9</td>
                                    <td className="col-txn-id">#TXN-88109</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Noah Henderson</span>
                                            <span className="cust-email">noah.h@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$125.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">10</td>
                                    <td className="col-txn-id">#TXN-88110</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Isabella Garcia</span>
                                            <span className="cust-email">isabella.g@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$65.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">11</td>
                                    <td className="col-txn-id">#TXN-88111</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Ethan Walker</span>
                                            <span className="cust-email">ethan.w@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$19.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">12</td>
                                    <td className="col-txn-id">#TXN-88112</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Mia Adams</span>
                                            <span className="cust-email">mia.a@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$140.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill pending">PENDING</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">13</td>
                                    <td className="col-txn-id">#TXN-88113</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Benjamin Scott</span>
                                            <span className="cust-email">benjamin.s@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$490.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">14</td>
                                    <td className="col-txn-id">#TXN-88114</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Charlotte Evans</span>
                                            <span className="cust-email">charlotte.e@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$1,200.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">15</td>
                                    <td className="col-txn-id">#TXN-88115</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Henry Collins</span>
                                            <span className="cust-email">henry.c@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$45.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">16</td>
                                    <td className="col-txn-id">#TXN-88116</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Ava Morgan</span>
                                            <span className="cust-email">ava.m@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$380.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill pending">PENDING</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">17</td>
                                    <td className="col-txn-id">#TXN-88117</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Jack Campbell</span>
                                            <span className="cust-email">jack.c@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$175.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-wallet2"></i> Wallet
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">18</td>
                                    <td className="col-txn-id">#TXN-88118</td>
                                    <td>
                                        <div className="customer-info-cell">
                                            <span className="cust-name">Chloe Mitchell</span>
                                            <span className="cust-email">chloe.m@example.com</span>
                                        </div>
                                    </td>
                                    <td className="col-amount">$60.00</td>
                                    <td>
                                        <span className="payment-method-tag">
                                            <i className="bi bi-bank"></i> Bank Transfer
                                        </span>
                                    </td>
                                    <td><span className="status-badge-pill active">PAID</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>Edit</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("#TXN-Receipt", "Customer")}>View</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-Over Edit Drawer */}
            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please review financial details, payment gateway reference, and status."
                icon="bi bi-credit-card-2-front-fill"
                entityType="Transaction Log"
                initialData={selectedTxn || {}}
            />
        </>
    );
}
