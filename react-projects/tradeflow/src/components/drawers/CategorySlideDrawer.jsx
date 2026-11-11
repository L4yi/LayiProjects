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
    const [statusesList, setStatusesList] = useState(() => setupService.getActiveInactiveStatuses(setupService.getCachedStatuses()));
    const [errors, setErrors] = useState({});
    const [localError, setLocalError] = useState("");

    // Load category taxonomy statuses (strictly active/inactive) from backend setup
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getActiveInactiveStatuses(res.data));
            }
        });
    }, []);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            const isEdit = Boolean(initialData.id || initialData.categoryId || initialData.categories_id);
            const statusId = initialData.statusId ? String(initialData.statusId) : (isEdit && initialData.status ? setupService.getStatusId(initialData.status) : "");
            const imgVal = initialData.image || initialData.imageUrl || initialData.categoryImage || initialData.category_image || "";
            setFormData({
                ...initialData,
                statusId: statusId || "",
                image: imgVal,
                imageUrl: imgVal
            });
        } else {
            setFormData({
                statusId: "",
                image: "",
                imageUrl: ""
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
        if (localError) setLocalError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        const catName = (formData.name || formData.categoryName || "").trim();
        if (!catName) newErrors.name = true;
        if (!formData.statusId) newErrors.statusId = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLocalError("Please select a status and enter a category name marked in red.");
            return;
        }

        setErrors({});
        setLocalError("");
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
            errorMessage={errorMessage || localError}
            onSubmit={handleSubmit}
        >
            <div className="drawer-flat-form">
                {/* Category Name */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Category Name</label>
                    <input
                        type="text"
                        className={`drawer-input ${errors.name ? "is-invalid" : ""}`}
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
                        className={`drawer-input ${errors.statusId ? "is-invalid" : ""}`}
                        value={String(formData.statusId || "")}
                        onChange={(e) => {
                            const val = e.target.value;
                            const matched = statusesList.find((s) => String(s.status_id) === String(val));
                            setFormData((prev) => ({
                                ...prev,
                                statusId: val,
                                status: matched?.status_name || prev.status || ""
                            }));
                            if (errors.statusId) setErrors((prev) => ({ ...prev, statusId: false }));
                            if (localError) setLocalError("");
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

                {/* Category Image URL */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Category Image URL</label>
                    <input
                        type="url"
                        className="drawer-input"
                        placeholder="e.g. https://example.com/images/category.jpg"
                        value={formData.image || formData.imageUrl || ""}
                        onChange={(e) => {
                            handleChange("image", e.target.value);
                            handleChange("imageUrl", e.target.value);
                        }}
                    />
                    {Boolean(formData.image || formData.imageUrl) && (
                        <div className="drawer-media-preview-wrap">
                            <img
                                src={formData.image || formData.imageUrl}
                                alt="Category Preview"
                                className="drawer-img-preview-box"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                                onLoad={(e) => {
                                    e.target.style.display = "block";
                                }}
                            />
                            <span className="drawer-preview-text">Live Image Preview</span>
                        </div>
                    )}
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
