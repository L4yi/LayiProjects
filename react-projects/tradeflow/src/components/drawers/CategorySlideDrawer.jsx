import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";
import { getStoredCategoryImage } from "../../services/categoryService";

const DEFAULT_CATEGORY_STATUSES = [
    { status_id: "1", status_name: "ACTIVE" },
    { status_id: "2", status_name: "INACTIVE" }
];

const SUGGESTED_CATEGORY_IMAGES = [
    { label: "Phones & Gadgets", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" },
    { label: "Electronics", url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80" },
    { label: "Office Supplies", url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80" },
    { label: "Groceries", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" },
    { label: "Health & Beauty", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80" }
];

// Slide drawer specifically for adding or editing a product category.
export default function CategorySlideDrawer({
    isOpen,
    onClose,
    title = "Category Details",
    subtitle = "Please complete the form below with accurate category details.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave,
    readOnly = false
}) {
    const [formData, setFormData] = useState({});
    const [statusesList, setStatusesList] = useState(() => {
        const cached = setupService.getActiveInactiveStatuses(setupService.getCachedStatuses());
        return (cached && cached.length > 0) ? cached : DEFAULT_CATEGORY_STATUSES;
    });
    const [errors, setErrors] = useState({});
    const [localError, setLocalError] = useState("");

    // Load category taxonomy statuses (strictly active/inactive) from backend setup
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                const filtered = setupService.getActiveInactiveStatuses(res.data);
                if (filtered && filtered.length > 0) {
                    setStatusesList(filtered);
                }
            }
        });
    }, []);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            const isEdit = Boolean(initialData.id || initialData.categoryId || initialData.categories_id || initialData.code);
            const rawId = initialData.id || initialData.categoryId || initialData.categories_id || initialData.code || "";
            const catName = initialData.name || initialData.categoryName || "";
            const statusId = initialData.statusId
                ? String(initialData.statusId)
                : (isEdit && initialData.status ? (setupService.getStatusId(initialData.status) || "1") : "1");
            const storedImg = getStoredCategoryImage(rawId, catName);
            const imgVal = initialData.image || initialData.imageUrl || initialData.categoryImage || initialData.category_image || storedImg || "";
            setFormData({
                ...initialData,
                id: rawId,
                categoryId: rawId,
                name: catName,
                categoryName: catName,
                statusId: statusId || "1",
                image: imgVal,
                imageUrl: imgVal
            });
        } else {
            setFormData({
                id: "",
                categoryId: "",
                name: "",
                categoryName: "",
                statusId: "1",
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

        const imgUrl = (formData.image || formData.imageUrl || "").trim();
        if (!imgUrl) newErrors.imageUrl = true;

        const effectiveDesc = (formData.description || formData.notes || "").trim() || `${catName} verified catalog items and products.`;
        const effectiveStatusId = formData.statusId ? String(formData.statusId) : "1";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (!catName) setLocalError("Please enter a category name.");
            else if (!imgUrl) setLocalError("Category Image URL is required by the server to create or update.");
            return;
        }

        setErrors({});
        setLocalError("");
        if (onSave) {
            onSave({
                ...formData,
                name: catName,
                categoryName: catName,
                description: effectiveDesc,
                notes: effectiveDesc,
                imageUrl: imgUrl,
                image: imgUrl,
                statusId: effectiveStatusId
            });
        }
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
            readOnly={readOnly}
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
                    <label className="drawer-label">
                        Category Image URL <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                        type="url"
                        className={`drawer-input ${errors.imageUrl ? "is-invalid" : ""}`}
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={formData.image || formData.imageUrl || ""}
                        onChange={(e) => {
                            handleChange("image", e.target.value);
                            handleChange("imageUrl", e.target.value);
                        }}
                    />
                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-xs text-slate-400 self-center mr-1">Presets:</span>
                        {SUGGESTED_CATEGORY_IMAGES.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                onClick={() => {
                                    handleChange("image", preset.url);
                                    handleChange("imageUrl", preset.url);
                                }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                    {Boolean(formData.image || formData.imageUrl) && (
                        <div className="drawer-media-preview-wrap mt-2">
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
