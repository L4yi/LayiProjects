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
    const [statusesList, setStatusesList] = useState(() => setupService.getActiveInactiveStatuses(setupService.getCachedStatuses()));
    const [errors, setErrors] = useState({});
    const [localError, setLocalError] = useState("");

    // Load product statuses (strictly active/inactive) from backend setup
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getActiveInactiveStatuses(res.data));
            }
        });
    }, []);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            const isEdit = Boolean(initialData.id || initialData.productId);
            const statusId = initialData.statusId ? String(initialData.statusId) : (isEdit && initialData.status ? setupService.getStatusId(initialData.status) : "");
            const categoryId = initialData.categoryId ? String(initialData.categoryId) : (initialData.categories_id ? String(initialData.categories_id) : "");
            const imgVal = initialData.rawImage || initialData.image || initialData.imageUrl || initialData.productImage || "";
            setFormData({
                ...initialData,
                statusId: statusId || "",
                categoryId: categoryId || "",
                image: imgVal,
                imageUrl: imgVal
            });
        } else {
            setFormData({
                statusId: "",
                categoryId: "",
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
        const nameVal = (formData.productName || formData.name || "").trim();
        if (!nameVal) newErrors.productName = true;
        if (!formData.categoryId) newErrors.categoryId = true;
        if (!formData.statusId) newErrors.statusId = true;

        const priceVal = formData.productPrice ?? formData.price;
        if (priceVal === undefined || priceVal === null || String(priceVal).trim() === "" || Number(priceVal) <= 0) {
            newErrors.price = true;
        }

        const qtyVal = formData.quantity ?? formData.inStock;
        if (qtyVal === undefined || qtyVal === null || String(qtyVal).trim() === "") {
            newErrors.quantity = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLocalError("Please select options and fill in all required fields marked in red.");
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
            icon="bi bi-box-seam"
            entityType="Product"
            isSaving={isSaving}
            errorMessage={errorMessage || localError}
            onSubmit={handleSubmit}
        >
            <div className="drawer-flat-form">
                {/* Product Name */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Product Name</label>
                    <input
                        type="text"
                        className={`drawer-input ${errors.productName ? "is-invalid" : ""}`}
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
                            className={`drawer-input ${errors.categoryId ? "is-invalid" : ""}`}
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
                                if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: false }));
                                if (localError) setLocalError("");
                            }}
                        >
                            <option value="">Select Here</option>
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
                            className={`drawer-input ${errors.statusId ? "is-invalid" : ""}`}
                            value={String(formData.statusId || "")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = statusesList.find((s) => String(s.status_id) === String(val) || s.status_name.toUpperCase() === val.toUpperCase());
                                setFormData((prev) => ({
                                    ...prev,
                                    status: matched?.status_name || val,
                                    statusId: matched?.status_id || val
                                }));
                                if (errors.statusId) setErrors((prev) => ({ ...prev, statusId: false }));
                                if (localError) setLocalError("");
                            }}
                        >
                            <option value="">Select Here</option>
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
                            type="text"
                            inputMode="numeric"
                            className={`drawer-input ${errors.price ? "is-invalid" : ""}`}
                            placeholder="e.g. 850000"
                            value={formData.productPrice ?? formData.price ?? ""}
                            onChange={(e) => {
                                const sanitized = e.target.value.replace(/[^0-9.]/g, "");
                                handleChange("price", sanitized);
                                handleChange("productPrice", sanitized);
                            }}
                        />
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Stock Quantity</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            className={`drawer-input ${errors.quantity ? "is-invalid" : ""}`}
                            placeholder="e.g. 24"
                            value={formData.quantity ?? formData.inStock ?? ""}
                            onChange={(e) => {
                                const sanitized = e.target.value.replace(/[^0-9]/g, "");
                                handleChange("quantity", sanitized);
                                handleChange("inStock", sanitized);
                            }}
                        />
                    </div>
                </div>

                {/* Product Image URL */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Product Image URL</label>
                    <input
                        type="url"
                        className="drawer-input"
                        placeholder="e.g. https://example.com/images/product.jpg"
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
                                alt="Product Preview"
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
