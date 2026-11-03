import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";

// Slide drawer specifically for adding or editing a product category.
export default function CategorySlideDrawer({
    isOpen,
    onClose,
    title = "Category Details",
    subtitle = "Please complete the form below with accurate category details.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [statusesList, setStatusesList] = useState(() => setupService.getCategoryStatuses(setupService.getCachedStatuses()));

    // Load category taxonomy statuses from backend setup
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getCategoryStatuses(res.data));
            }
        });
    }, []);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            const statusId = initialData.statusId ? String(initialData.statusId) : (initialData.status ? setupService.getStatusId(initialData.status) : "");
            setFormData({
                ...initialData,
                statusId: statusId || ""
            });
        } else {
            setFormData({
                statusId: ""
            });
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
            icon="bi bi-tags"
            entityType="Category"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            <div className="drawer-flat-form">
                {/* Category Name */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Category Name</label>
                    <input
                        type="text"
                        className="drawer-input"
                        placeholder="e.g. Mobile Devices & Phones"
                        value={formData.name || formData.categoryName || ""}
                        onChange={(e) => {
                            handleChange("name", e.target.value);
                            handleChange("categoryName", e.target.value);
                        }}
                    />
                </div>

                {/* Status */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Status</label>
                    <select
                        className="drawer-input"
                        value={String(formData.statusId || "")}
                        onChange={(e) => {
                            const val = e.target.value;
                            const matched = statusesList.find((s) => String(s.status_id) === String(val));
                            setFormData((prev) => ({
                                ...prev,
                                statusId: val,
                                status: matched?.status_name || prev.status || ""
                            }));
                        }}
                    >
                        <option value="">Select Here</option>
                        {statusesList.map((s) => (
                            <option key={s.status_id} value={s.status_id}>
                                {s.status_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Description & Details</label>
                    <textarea
                        className="drawer-textarea"
                        rows="4"
                        placeholder="Briefly describe products belonging to this category..."
                        value={formData.description || formData.notes || ""}
                        onChange={(e) => {
                            handleChange("description", e.target.value);
                            handleChange("notes", e.target.value);
                        }}
                    ></textarea>
                </div>
            </div>
        </BaseDrawerShell>
    );
}
