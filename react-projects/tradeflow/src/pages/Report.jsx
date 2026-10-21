import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { PageHeader, TableCard } from "../components/common";

export default function Report() {
    const [reportsList, setReportsList] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Generate Report");
    const [typeFilter, setTypeFilter] = useState("");

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
        setReportsList(prev => {
            const exists = prev.some(r => r.id === repData.id || (repData.code && r.code === repData.code));
            if (exists) {
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
                        <span className="report-label">Scheduled Audits</span>
                        <span className="report-val">0</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">Storage Consumed</span>
                        <span className="report-val">0.0 MB</span>
                    </div>
                    <div className="report-stat-box">
                        <span className="report-label">System Health</span>
                        <span className="report-val" style={{ color: "#10b981" }}>100%</span>
                    </div>
                </div>

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
            </div>

            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please configure parameters for analytics calculation and export format."
                icon="bi bi-file-earmark-bar-graph-fill"
                entityType="Analytics Report"
                initialData={selectedReport || {}}
                onSave={handleSaveReport}
            />
        </>
    );
}
