import React, { useState, useEffect } from "react";
import { ReportSlideDrawer } from "../components/drawers";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import orderService from "../services/orderService";
import productService from "../services/productService";
import customerService from "../services/customerService";
import staffService from "../services/staffService";
import categoryService from "../services/categoryService";

export default function Report() {
    const [reportsList, setReportsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [stats, setStats] = useState({
        totalGenerated: 0,
        ordersCount: 0,
        totalRevenue: 0,
        systemHealth: "100%"
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Generate Report");
    const [typeFilter, setTypeFilter] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

    const loadReportsData = async () => {
        setIsLoading(true);
        setHasNetworkError(false);
        try {
            const [ordersRes, prodsRes, custsRes, staffsRes, catsRes] = await Promise.allSettled([
                orderService.fetchAllOrders(),
                productService.fetchAllProducts(),
                customerService.fetchAllCustomers(),
                staffService.fetchAllStaff(),
                categoryService.fetchAllCategories()
            ]);

            const orders = ordersRes.status === "fulfilled" && ordersRes.value?.success && Array.isArray(ordersRes.value?.data) ? ordersRes.value.data : [];
            const prods = prodsRes.status === "fulfilled" && prodsRes.value?.success && Array.isArray(prodsRes.value?.data) ? prodsRes.value.data : [];
            const custs = custsRes.status === "fulfilled" && custsRes.value?.success && Array.isArray(custsRes.value?.data) ? custsRes.value.data : [];
            const staffs = staffsRes.status === "fulfilled" && staffsRes.value?.success && Array.isArray(staffsRes.value?.data) ? staffsRes.value.data : [];
            const cats = catsRes.status === "fulfilled" && catsRes.value?.success && Array.isArray(catsRes.value?.data) ? catsRes.value.data : [];

            const totalRev = orders.reduce((acc, curr) => acc + (Number(curr.price || curr.amount || 0)), 0);

            const initialReports = [
                {
                    id: "REP-1",
                    code: "#REP-001",
                    name: "Store Orders & Financial Audit",
                    role: "Financial Audit",
                    format: "PDF Document (.pdf)",
                    generatedDate: new Date().toISOString().substring(0, 10),
                    status: "ACTIVE",
                    notes: `${orders.length} order(s) processed. Total revenue: ₦ ${totalRev.toLocaleString()}`
                },
                {
                    id: "REP-2",
                    code: "#REP-002",
                    name: "Catalog Inventory & Valuation Log",
                    role: "Inventory",
                    format: "Excel Spreadsheet (.xlsx)",
                    generatedDate: new Date().toISOString().substring(0, 10),
                    status: "ACTIVE",
                    notes: `${prods.length} product(s) across ${cats.length} category(ies)`
                },
                {
                    id: "REP-3",
                    code: "#REP-003",
                    name: "Customer Registry & Accounts Audit",
                    role: "Operational Audit",
                    format: "CSV Dataset (.csv)",
                    generatedDate: new Date().toISOString().substring(0, 10),
                    status: "ACTIVE",
                    notes: `${custs.length} verified customer profile(s)`
                },
                {
                    id: "REP-4",
                    code: "#REP-004",
                    name: "Staff Permissions & Access Control Report",
                    role: "Security Audit",
                    format: "PDF Document (.pdf)",
                    generatedDate: new Date().toISOString().substring(0, 10),
                    status: "ACTIVE",
                    notes: `${staffs.length} active administrative account(s)`
                }
            ];

            setReportsList(initialReports);
            setStats({
                totalGenerated: initialReports.length,
                ordersCount: orders.length,
                totalRevenue: totalRev,
                systemHealth: "100%"
            });
        } catch (_) {
            setHasNetworkError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReportsData();
    }, []);

    const handleOpenEdit = (report) => {
        setSelectedReport({ ...report });
        setDrawerTitle(`Edit Report - ${report.code || report.name}`);
        setDrawerOpen(true);
    };

    const handleOpenGenerate = () => {
        setSelectedReport({
            id: `REP-${Date.now()}`,
            name: "",
            code: `#REP-00${reportsList.length + 1}`,
            role: "Financial Audit",
            status: "ACTIVE",
            format: "PDF Document (.pdf)",
            notes: ""
        });
        setDrawerTitle("Generate New Analytics Report");
        setDrawerOpen(true);
    };

    const handleSaveReport = (repData) => {
        const isUpdate = reportsList.some(r => r.id === repData.id || (repData.code && r.code === repData.code));
        setReportsList(prev => {
            if (isUpdate) {
                return prev.map(r => (r.id === repData.id || (repData.code && r.code === repData.code)) ? { ...r, ...repData } : r);
            } else {
                return [
                    {
                        ...repData,
                        id: repData.id || `REP-${Date.now()}`,
                        code: repData.code || `#REP-00${prev.length + 1}`,
                        generatedDate: new Date().toISOString().replace("T", " ").substring(0, 19),
                        fileSize: "1.2 MB"
                    },
                    ...prev
                ];
            }
        });
        setDrawerOpen(false);
        setModalData({
            type: "success",
            title: isUpdate ? "REPORT UPDATED SUCCESSFULLY!" : "REPORT GENERATED SUCCESSFULLY!",
            message: `Report "${repData.name || "Analytics Report"}" has been generated.`
        });
        setShowSuccessModal(true);
    };

    const filteredReports = reportsList.filter(r =>
        !typeFilter || String(r.role || "").toLowerCase().includes(typeFilter.toLowerCase())
    );

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-bar-chart-line"
                    badgeTitle="Report"
                    breadcrumb="Analytics → Generate financial, operational, and customer audit reports."
                    title="All Generated Reports"
                    countSubtitle={`${filteredReports.length} reports generated`}
                    actions={
                        <>
                            <div className="filter-select-wrap">
                                <i className="bi bi-funnel"></i>
                                <select
                                    className="filter-dropdown-select"
                                    title="Filter by Type"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="financial">Financial</option>
                                    <option value="inventory">Inventory</option>
                                    <option value="operational">Operations</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                className="btn-add-entity"
                                onClick={handleOpenGenerate}
                            >
                                <i className="bi bi-plus-lg"></i> Generate Report
                            </button>
                        </>
                    }
                />

                <div className="report-stats-grid">
                    <div className="report-stat-box">
                        <span className="report-label">Total Generated</span>
                        <span className="report-val">{reportsList.length}</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">Live Orders</span>
                        <span className="report-val">{stats.ordersCount}</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">Total Revenue</span>
                        <span className="report-val">₦ {Number(stats.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">System Health</span>
                        <span className="report-val" style={{ color: "#10b981" }}>{stats.systemHealth}</span>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingSpinner message="Aggregating store analytics from database..." />
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
                            Unable to aggregate analytics reports. Please check your network.
                        </p>
                        <button
                            type="button"
                            onClick={loadReportsData}
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
                        title="Generated Audit Logs"
                        subtitle="Structured export artifacts and performance telemetry"
                        isEmpty={filteredReports.length === 0}
                        emptyMessage="No analytics reports generated yet."
                    >
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
                                {filteredReports.map((report, idx) => (
                                    <tr key={report.id || idx}>
                                        <td className="col-sn">{idx + 1}</td>
                                        <td>
                                            <div className="report-name-cell">
                                                <div className="report-icon-box">
                                                    <i className="bi bi-file-earmark-bar-graph"></i>
                                                </div>
                                                <div className="report-text-group">
                                                    <span className="report-title">{report.name || "Audit Report"}</span>
                                                    <span className="report-ref">{report.code}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-gen-date">{report.generatedDate || "Just now"}</td>
                                        <td>
                                            <span className={`status-badge-pill ${(report.status || "active").toLowerCase()}`}>
                                                {report.status || "ACTIVE"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btn-group">
                                                <button type="button" className="action-pill-btn" onClick={() => handleOpenEdit(report)}>
                                                    View
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

            <ReportSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please configure parameters for analytics calculation and export format."
                icon="bi bi-file-earmark-bar-graph-fill"
                entityType="Analytics Report"
                initialData={selectedReport || {}}
                onSave={handleSaveReport}
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
