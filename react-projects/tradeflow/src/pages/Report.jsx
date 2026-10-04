import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";

export default function Report() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Generate Report");

    const handleOpenEdit = (reportName, repCode) => {
        setSelectedReport({
            name: reportName,
            code: repCode,
            role: "Financial Audit",
            status: "ACTIVE",
            notes: `Automated data export for ${reportName}`
        });
        setDrawerTitle(`Edit Report Configuration - ${repCode}`);
        setDrawerOpen(true);
    };

    const handleOpenGenerate = () => {
        setSelectedReport({
            name: "Comprehensive Store Audit",
            code: "#REP-2026-Q3",
            role: "Operational Audit",
            status: "ACTIVE",
            notes: "Generate full store metrics, inventory turnaround, and profit margin analysis."
        });
        setDrawerTitle("Generate New Analytics Report");
        setDrawerOpen(true);
    };

    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-bar-chart-line"></i>
                        <span>Report</span>
                    </div>
                    <div className="module-breadcrumb">
                        Analytics &rarr; Generate financial, operational, and customer audit reports.
                    </div>
                </div>

                <div className="report-stats-grid">
                    <div className="report-stat-box">
                        <span className="report-label">Total Generated</span>
                        <span className="report-val">15</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">Scheduled Audits</span>
                        <span className="report-val">4</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">Storage Consumed</span>
                        <span className="report-val">32.2 MB</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">System Health</span>
                        <span className="report-val" style={{ color: "#10b981" }}>99.9%</span>
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Generated Reports</h2>
                        <span className="module-count-subtitle">15 reports generated</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select className="filter-dropdown-select" title="Filter by Type" defaultValue="">
                                <option value="">All Types</option>
                                <option value="financial">Financial</option>
                                <option value="inventory">Inventory</option>
                                <option value="operations">Operations</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={handleOpenGenerate}
                        >
                            <i className="bi bi-plus-lg"></i> Generate Report
                        </button>
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Report Title <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Generated Date <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="col-sn">1</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Monthly Revenue &amp; Sales Summary</span>
                                                <span className="report-ref">#REP-2026-09</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-09-01 08:00 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 1.8 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">2</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Customer Acquisition &amp; Retention</span>
                                                <span className="report-ref">#REP-2026-08</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-08-31 09:30 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 2.4 MB</button>
                                            <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit("Report Summary", "#REP-DOC")}>View / Edit</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">3</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Inventory Valuation &amp; Reorder Audit</span>
                                                <span className="report-ref">#REP-2026-07</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-08-25 02:15 PM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 3.1 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">4</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Payment Gateways &amp; Settlement Report</span>
                                                <span className="report-ref">#REP-2026-06</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-08-20 11:45 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 950 KB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">5</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Tax &amp; VAT Quarterly Filing Breakdown</span>
                                                <span className="report-ref">#REP-2026-05</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-08-15 04:20 PM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 4.2 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">6</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Staff Performance &amp; Activity Metrics</span>
                                                <span className="report-ref">#REP-2026-04</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-08-10 10:00 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 1.2 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">7</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Order Fulfillment &amp; Delivery Times</span>
                                                <span className="report-ref">#REP-2026-03</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-08-05 01:10 PM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 1.5 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">8</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Discount Codes &amp; Promotion ROI</span>
                                                <span className="report-ref">#REP-2026-02</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-08-01 03:40 PM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 820 KB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">9</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Customer Support Tickets &amp; Resolution</span>
                                                <span className="report-ref">#REP-2026-01</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-07-28 09:15 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 1.1 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">10</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Category Sales Share &amp; Popularity</span>
                                                <span className="report-ref">#REP-2025-12</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-07-20 04:55 PM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 2.8 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">11</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Cart Abandonment &amp; Conversion Rates</span>
                                                <span className="report-ref">#REP-2025-11</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-07-15 11:30 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 1.9 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">12</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Refunds &amp; Returns Analysis Report</span>
                                                <span className="report-ref">#REP-2025-10</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-07-10 02:25 PM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 1.4 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">13</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Annual Gross Margin &amp; Profit Audit</span>
                                                <span className="report-ref">#REP-2025-09</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-07-05 08:45 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 5.6 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">14</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Regional Orders &amp; Geographic Heatmap</span>
                                                <span className="report-ref">#REP-2025-08</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-06-30 01:20 PM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 3.7 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">15</td>
                                    <td>
                                        <div className="report-name-cell">
                                            <div className="report-icon-box"><i className="bi bi-file-earmark-bar-graph"></i></div>
                                            <div className="report-text-group">
                                                <span className="report-title">Supplier Cost &amp; Purchase Log Analysis</span>
                                                <span className="report-ref">#REP-2025-07</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-gen-date">2026-06-25 10:10 AM</td>
                                    <td><span className="status-badge-pill active">Generated</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-download"><i className="bi bi-download"></i> 2.2 MB</button>
                                            <button type="button" className="action-pill-btn">View</button>
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
                subtitle="Please configure parameters for analytics calculation and export format."
                icon="bi bi-file-earmark-bar-graph-fill"
                entityType="Analytics Report"
                initialData={selectedReport || {}}
            />
        </>
    );
}
