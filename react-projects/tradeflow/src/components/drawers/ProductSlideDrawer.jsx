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
    const [statusesList, setStatusesList] = useState([]);

    // Load product statuses from backend setup endpoint
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
            icon="bi bi-box-seam"
            entityType="Product"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            {/* Card 1: Product Identification */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-box-seam text-primary-icon"></i>
                    <span>Product Information</span>
                </div>
                <div className="card-form-grid">
                    {/* Name */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Product Name *</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. Apple iPhone 15 Pro Max"
                            value={formData.productName || formData.name || ""}
                            onChange={(e) => {
                                handleChange("productName", e.target.value);
                                handleChange("name", e.target.value);
                            }}
                            required
                        />
                    </div>

                    {/* SKU / ID */}
                    <div className="form-group-item">
                        <label className="drawer-label">Product SKU / ID</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="Auto-generated on save"
                            value={formData.productId || formData.product_id || formData.code || ""}
                            onChange={(e) => handleChange("code", e.target.value)}
                            readOnly={Boolean(formData.productId || formData.product_id)}
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group-item">
                        <label className="drawer-label">Category *</label>
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
                            required
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

                    {/* Brand */}
                    <div className="form-group-item">
                        <label className="drawer-label">Brand</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. Apple, Nike, Samsung"
                            value={formData.brand || ""}
                            onChange={(e) => handleChange("brand", e.target.value)}
                        />
                    </div>

                    {/* Subtitle / Specs */}
                    <div className="form-group-item">
                        <label className="drawer-label">Subtitle / Key Specs</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. 256GB - Sierra Blue / 5G"
                            value={formData.subtitle || ""}
                            onChange={(e) => handleChange("subtitle", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Card 2: Pricing & Stock Inventory */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-currency-exchange text-primary-icon"></i>
                    <span>Pricing & Inventory</span>
                </div>
                <div className="card-form-grid">
                    {/* Price */}
                    <div className="form-group-item">
                        <label className="drawer-label">Price (₦) *</label>
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
                            required
                        />
                    </div>

                    {/* Original Price */}
                    <div className="form-group-item">
                        <label className="drawer-label">Original Price (₦)</label>
                        <input
                            type="number"
                            className="drawer-input"
                            placeholder="e.g. 920000"
                            value={formData.oldPrice ?? ""}
                            onChange={(e) => handleChange("oldPrice", Number(e.target.value) || 0)}
                        />
                    </div>

                    {/* Quantity */}
                    <div className="form-group-item">
                        <label className="drawer-label">Stock Quantity *</label>
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
                            required
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
                            {statusesList.filter((s) => ["ACTIVE", "INACTIVE", "PENDING", "OUT OF STOCK", "IN STOCK"].includes(s.status_name.toUpperCase())).map((s) => (
                                <option key={s.status_id} value={s.status_name}>
                                    {s.status_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Card 3: Media & Description */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-image text-primary-icon"></i>
                    <span>Media & Description</span>
                </div>
                <div className="card-form-grid">
                    {/* Image URL */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Image URL</label>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        objectFit: "contain",
                                        borderRadius: "6px",
                                        background: "#f8fafc",
                                        border: "1px solid #e2e8f0"
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            )}
                            <input
                                type="text"
                                className="drawer-input"
                                placeholder="https://..."
                                value={formData.image || ""}
                                onChange={(e) => handleChange("image", e.target.value)}
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Product Description *</label>
                        <textarea
                            className="drawer-textarea"
                            rows="3"
                            placeholder="Enter comprehensive product overview..."
                            value={formData.description || ""}
                            onChange={(e) => handleChange("description", e.target.value)}
                            required
                        ></textarea>
                    </div>
                </div>
            </div>
        </BaseDrawerShell>
    );
}
