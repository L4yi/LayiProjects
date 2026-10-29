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
    const [statusesList, setStatusesList] = useState([]);

    // Load category statuses from backend setup endpoint
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(res.data);
            }
        });
    }, []);

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
            icon="bi bi-tags"
            entityType="Category"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            {/* Card 1: Category Identification */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-tags text-primary-icon"></i>
                    <span>Category Identification</span>
                </div>
                <div className="card-form-grid">
                    {/* Category Name */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Category Name *</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. Mobile Devices & Phones"
                            value={formData.name || formData.categoryName || ""}
                            onChange={(e) => {
                                handleChange("name", e.target.value);
                                handleChange("categoryName", e.target.value);
                            }}
                            required
                        />
                    </div>

                    {/* Category Code */}
                    <div className="form-group-item">
                        <label className="drawer-label">Category Code / ID</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="Auto-generated on save"
                            value={formData.code || formData.categoryId || formData.categories_id || ""}
                            onChange={(e) => handleChange("code", e.target.value)}
                            readOnly={Boolean(formData.categoryId || formData.categories_id)}
                        />
                    </div>

                    {/* Status */}
                    <div className="form-group-item">
                        <label className="drawer-label">Status</label>
                        <select
                            className="drawer-input"
                            value={String(formData.status || "ACTIVE").toUpperCase()}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = statusesList.find((s) => s.status_name.toUpperCase() === val.toUpperCase());
                                setFormData((prev) => ({
                                    ...prev,
                                    status: val,
                                    statusId: matched?.status_id || statusesList[0]?.status_id || ""
                                }));
                            }}
                        >
                            {statusesList.filter((s) => ["ACTIVE", "INACTIVE", "PENDING"].includes(s.status_name.toUpperCase())).map((s) => (
                                <option key={s.status_id} value={s.status_name}>
                                    {s.status_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Icon Picker */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Icon</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "8px",
                                    background: "#f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.2rem",
                                    color: "#143526"
                                }}
                            >
                                <i className={formData.icon || "bi bi-tag"}></i>
                            </div>
                            <select
                                className="drawer-input"
                                value={formData.icon || "bi bi-tag"}
                                onChange={(e) => handleChange("icon", e.target.value)}
                                style={{ flex: 1 }}
                            >
                                <option value="bi bi-phone">Mobile Phones (bi-phone)</option>
                                <option value="bi bi-boot">Footwear & Shoes (bi-boot)</option>
                                <option value="bi bi-person-standing">Apparel & Clothing (bi-person-standing)</option>
                                <option value="bi bi-bag">Bags & Accessories (bi-bag)</option>
                                <option value="bi bi-headphones">Audio & Sound (bi-headphones)</option>
                                <option value="bi bi-smartwatch">Wearable Tech (bi-smartwatch)</option>
                                <option value="bi bi-laptop">Laptops & Computers (bi-laptop)</option>
                                <option value="bi bi-tv">TV & Entertainment (bi-tv)</option>
                                <option value="bi bi-controller">Gaming & Consoles (bi-controller)</option>
                                <option value="bi bi-camera">Cameras & Optics (bi-camera)</option>
                                <option value="bi bi-watch">Luxury Watches (bi-watch)</option>
                                <option value="bi bi-tag">General Category (bi-tag)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Description & Meta */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-card-text text-primary-icon"></i>
                    <span>Description & Details</span>
                </div>
                <div className="card-form-grid">
                    {/* Description */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Description *</label>
                        <textarea
                            className="drawer-textarea"
                            rows="3"
                            placeholder="Briefly describe products belonging to this category..."
                            value={formData.description || formData.notes || ""}
                            onChange={(e) => {
                                handleChange("description", e.target.value);
                                handleChange("notes", e.target.value);
                            }}
                            required
                        ></textarea>
                    </div>

                    {/* Model Estimate / Badge */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Model Estimate / Badge</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. 15 Models or Official Store"
                            value={formData.itemCount || formData.badge || ""}
                            onChange={(e) => handleChange("itemCount", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </BaseDrawerShell>
    );
}
