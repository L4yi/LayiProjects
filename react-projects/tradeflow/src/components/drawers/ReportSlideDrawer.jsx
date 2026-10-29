import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";

// Slide drawer specifically for generating or configuring an audit report.
export default function ReportSlideDrawer({
    isOpen,
    onClose,
    title = "Report Configuration",
    subtitle = "Configure parameters to export store analytics and logs.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave
}) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
    }, [initialData, isOpen]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) onSave(formData);
    };

    return (
        <BaseDrawerShell
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            subtitle={subtitle}
            icon="bi bi-bar-chart-line"
            entityType="Report"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            saveButtonText="Generate Report"
        >
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-bar-chart-line text-primary-icon"></i>
                    <span>Report Configuration</span>
                </div>
                <div className="card-form-grid">
                    {/* Report Title */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Report Title *</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. Comprehensive Store Audit"
                            value={formData.name || ""}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>

                    {/* Report Code */}
                    <div className="form-group-item">
                        <label className="drawer-label">Report Code</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. #REP-2026-Q3"
                            value={formData.code || ""}
                            onChange={(e) => handleChange("code", e.target.value)}
                        />
                    </div>

                    {/* Audit Category */}
                    <div className="form-group-item">
                        <label className="drawer-label">Audit Category</label>
                        <select
                            className="drawer-input"
                            value={formData.role || "Financial Audit"}
                            onChange={(e) => handleChange("role", e.target.value)}
                        >
                            <option value="Financial Audit">Financial Audit</option>
                            <option value="Inventory Valuation">Inventory Valuation</option>
                            <option value="Operational Audit">Operational Audit</option>
                            <option value="Tax & Compliance">Tax & Compliance</option>
                        </select>
                    </div>

                    {/* Export Format */}
                    <div className="form-group-item">
                        <label className="drawer-label">Export Format</label>
                        <select
                            className="drawer-input"
                            value={formData.format || "PDF Document (.pdf)"}
                            onChange={(e) => handleChange("format", e.target.value)}
                        >
                            <option value="PDF Document (.pdf)">PDF Document (.pdf)</option>
                            <option value="Excel Spreadsheet (.xlsx)">Excel Spreadsheet (.xlsx)</option>
                            <option value="CSV Spreadsheet (.csv)">CSV Spreadsheet (.csv)</option>
                        </select>
                    </div>

                    {/* Status */}
                    <div className="form-group-item">
                        <label className="drawer-label">Status</label>
                        <select
                            className="drawer-input"
                            value={formData.status || "ACTIVE"}
                            onChange={(e) => handleChange("status", e.target.value)}
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                    </div>

                    {/* Scope Notes */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Audit Notes & Scope</label>
                        <textarea
                            className="drawer-textarea"
                            rows="3"
                            placeholder="Summarize the scope and parameters of this report..."
                            value={formData.notes || ""}
                            onChange={(e) => handleChange("notes", e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        </BaseDrawerShell>
    );
}
