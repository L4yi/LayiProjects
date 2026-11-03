import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";

// Slide drawer specifically for adding or editing a product in the catalog.
export default function ProductSlideDrawer({
    isOpen,
    onClose,
    title = "Product Details",
    subtitle = "Please complete the form below with accurate product details.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    categoriesList = [],
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [statusesList, setStatusesList] = useState(() => setupService.getProductStatuses(setupService.getCachedStatuses()));

    // Load product catalog and stock statuses from backend setup
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getProductStatuses(res.data));
            }
        });
    }, []);

    useEffect(() => {
        if (initialData) {
            const statusId = initialData.statusId ? String(initialData.statusId) : setupService.getStatusId(initialData.status, "1");
            const categoryId = initialData.categoryId ? String(initialData.categoryId) : (initialData.categories_id ? String(initialData.categories_id) : "");
            setFormData({
                ...initialData,
                statusId: statusId || "1",
                categoryId: categoryId || ""
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
            icon="bi bi-box-seam"
            entityType="Product"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            <div className="drawer-flat-form">
                {/* Product Name */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Product Name</label>
                    <input
                        type="text"
                        className="drawer-input"
                        placeholder="e.g. Apple iPhone 15 Pro Max"
                        value={formData.productName || formData.name || ""}
                        onChange={(e) => {
                            handleChange("productName", e.target.value);
                            handleChange("name", e.target.value);
                        }}
                    />
                </div>

                {/* Category & Status */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Category</label>
                        <select
                            className="drawer-input"
                            value={formData.categoryId || formData.categories_id || ""}
                            onChange={(e) => {
                                const catId = e.target.value;
                                const selectedCat = (categoriesList || []).find(
                                    (c) => (c.categories_id || c.categoryId || c.id) === catId
                                );
                                handleChange("categoryId", catId);
                                handleChange("categories_id", catId);
                                if (selectedCat) {
                                    handleChange("categoryName", selectedCat.categories_name || selectedCat.categoryName || selectedCat.name);
                                }
                            }}
                        >
                            <option value="">Select Category</option>
                            {(categoriesList || []).map((cat) => (
                                <option
                                    key={cat.categories_id || cat.categoryId || cat.id}
                                    value={cat.categories_id || cat.categoryId || cat.id}
                                >
                                    {cat.categories_name || cat.categoryName || cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Status</label>
                        <select
                            className="drawer-input"
                            value={String(formData.statusId || (statusesList.find(s => s.status_name === formData.status)?.status_id) || "1")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = statusesList.find((s) => String(s.status_id) === String(val) || s.status_name.toUpperCase() === val.toUpperCase());
                                setFormData((prev) => ({
                                    ...prev,
                                    status: matched?.status_name || val,
                                    statusId: matched?.status_id || val
                                }));
                            }}
                        >
                            {statusesList.map((s) => (
                                <option key={s.status_id} value={s.status_id}>{s.status_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Price (₦)</label>
                        <input
                            type="number"
                            className="drawer-input"
                            placeholder="e.g. 850000"
                            value={formData.productPrice ?? formData.price ?? ""}
                            onChange={(e) => {
                                const p = Number(e.target.value) || 0;
                                handleChange("price", p);
                                handleChange("productPrice", p);
                            }}
                        />
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Stock Quantity</label>
                        <input
                            type="number"
                            className="drawer-input"
                            placeholder="e.g. 24"
                            value={formData.quantity ?? formData.inStock ?? ""}
                            onChange={(e) => {
                                const q = Number(e.target.value) || 0;
                                handleChange("quantity", q);
                                handleChange("inStock", q);
                            }}
                        />
                    </div>
                </div>

                {/* Image URL */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Image URL</label>
                    <input
                        type="text"
                        className="drawer-input"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.image || ""}
                        onChange={(e) => handleChange("image", e.target.value)}
                    />
                    {formData.image && (
                        <div className="drawer-media-preview-wrap">
                            <img
                                src={formData.image}
                                alt="Product Preview"
                                className="drawer-img-preview-box"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                            <span className="table-cell-ellipsis-sub">Image Preview</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Product Description</label>
                    <textarea
                        className="drawer-textarea"
                        rows="4"
                        placeholder="Enter comprehensive product overview..."
                        value={formData.description || ""}
                        onChange={(e) => handleChange("description", e.target.value)}
                    ></textarea>
                </div>
            </div>
        </BaseDrawerShell>
    );
}
