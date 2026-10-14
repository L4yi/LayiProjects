import React, { useState, useEffect } from "react";

export default function AdminSlideDrawer({
    isOpen,
    onClose,
    title = "Edit Details",
    subtitle = "Please complete the form below with accurate details.",
    icon = "bi bi-pencil-square",
    entityType = "Item",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
        setShowPassword(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) onSave(formData);
    };

    // Determine normalized mode from entityType
    const norm = String(entityType || "").toLowerCase();
    const isCategory = norm.includes("categor");
    const isProduct = norm.includes("product");
    const isCustomer = norm.includes("customer");
    const isOrder = norm.includes("order");
    const isTransaction = norm.includes("transaction");
    const isReport = norm.includes("report");
    const isStaff = !isCategory && !isProduct && !isCustomer && !isOrder && !isTransaction && !isReport;

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="admin-slide-drawer" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="drawer-header-gradient">
                    <div className="drawer-header-left">
                        <div className="drawer-header-icon">
                            <i className={icon}></i>
                        </div>
                        <h3 className="drawer-title">{title}</h3>
                    </div>
                    <button
                        type="button"
                        className="drawer-close-btn"
                        onClick={onClose}
                        title="Close Drawer"
                    >
                        <i className="bi bi-x-lg"></i> Close
                    </button>
                </div>

                {/* Subtitle Bar */}
                <div className="drawer-subtitle-bar">
                    <p>
                        You are about to modify <strong>{entityType}</strong>. {subtitle}
                    </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div
                        style={{
                            margin: "12px 20px 0",
                            background: "#fee2e2",
                            border: "1px solid #f87171",
                            color: "#991b1b",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            fontSize: "0.88rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form className="drawer-body-scroll" onSubmit={handleSubmit}>
                    {/* 1. CATEGORY FORM */}
                    {isCategory && (
                        <>
                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-tags text-primary-icon"></i>
                                    <span>Category Identification</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Category Name *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Mobile Devices & Phones"
                                            value={formData.name || ""}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Category Code / ID *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. #CAT-107"
                                            value={formData.code || ""}
                                            onChange={(e) => handleChange("code", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Status</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.status || "ACTIVE"}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                        </select>
                                    </div>

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

                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-card-text text-primary-icon"></i>
                                    <span>Description & Details</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Description / Notes</label>
                                        <textarea
                                            className="drawer-textarea"
                                            rows="3"
                                            placeholder="Briefly describe products belonging to this category..."
                                            value={formData.description || formData.notes || ""}
                                            onChange={(e) => {
                                                handleChange("description", e.target.value);
                                                handleChange("notes", e.target.value);
                                            }}
                                        ></textarea>
                                    </div>
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
                        </>
                    )}

                    {/* 2. PRODUCT FORM */}
                    {isProduct && (
                        <>
                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-box-seam text-primary-icon"></i>
                                    <span>Product Information</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Product Name *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Apple iPhone 15 Pro Max"
                                            value={formData.name || ""}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Product SKU / ID *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. #PRD-025"
                                            value={formData.code || ""}
                                            onChange={(e) => handleChange("code", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Category *</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.categoryId || "mobile-devices"}
                                            onChange={(e) => {
                                                const catId = e.target.value;
                                                const catNames = {
                                                    "mobile-devices": "Mobile Devices & Phones",
                                                    "footwear": "Footwear & Shoes",
                                                    "apparel": "Apparel & Clothing",
                                                    "accessories": "Bags & Accessories",
                                                    "audio": "Audio Devices & Sound",
                                                    "wearable": "Wearable Technology"
                                                };
                                                handleChange("categoryId", catId);
                                                handleChange("categoryName", catNames[catId] || catId);
                                            }}
                                        >
                                            <option value="mobile-devices">Mobile Devices & Phones</option>
                                            <option value="footwear">Footwear & Shoes</option>
                                            <option value="apparel">Apparel & Clothing</option>
                                            <option value="accessories">Bags & Accessories</option>
                                            <option value="audio">Audio Devices & Sound</option>
                                            <option value="wearable">Wearable Technology</option>
                                        </select>
                                    </div>

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

                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-currency-exchange text-primary-icon"></i>
                                    <span>Pricing & Inventory</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item">
                                        <label className="drawer-label">Price (₦) *</label>
                                        <input
                                            type="number"
                                            className="drawer-input"
                                            placeholder="e.g. 850000"
                                            value={formData.price ?? ""}
                                            onChange={(e) => handleChange("price", Number(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

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

                                    <div className="form-group-item">
                                        <label className="drawer-label">Stock Units *</label>
                                        <input
                                            type="number"
                                            className="drawer-input"
                                            placeholder="e.g. 24"
                                            value={formData.inStock ?? ""}
                                            onChange={(e) => handleChange("inStock", Number(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Status</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.status || "ACTIVE"}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="OUT OF STOCK">OUT OF STOCK</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-image text-primary-icon"></i>
                                    <span>Media & Description</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Image URL</label>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            {formData.image && (
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "6px", background: "#f8fafc", border: "1px solid #e2e8f0" }}
                                                    onError={(e) => { e.target.style.display = "none"; }}
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

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Product Description</label>
                                        <textarea
                                            className="drawer-textarea"
                                            rows="3"
                                            placeholder="Enter comprehensive product overview..."
                                            value={formData.description || ""}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 3. CUSTOMER FORM */}
                    {isCustomer && (
                        <>
                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-person-vcard text-primary-icon"></i>
                                    <span>Customer Details</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Full Name *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Alexander Wright"
                                            value={formData.name || ""}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Customer ID</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. CUST-01"
                                            value={formData.id || ""}
                                            onChange={(e) => handleChange("id", e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Phone Number *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="080 1234 5678"
                                            value={formData.phone || ""}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Email Address *</label>
                                        <input
                                            type="email"
                                            className="drawer-input"
                                            placeholder="customer@example.com"
                                            value={formData.email || ""}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Delivery Address</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Ibara, Abeokuta, Ogun State"
                                            value={formData.address || ""}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-shield-check text-primary-icon"></i>
                                    <span>Membership & Status</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item">
                                        <label className="drawer-label">Customer Tier / Role</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.role || "Customer"}
                                            onChange={(e) => handleChange("role", e.target.value)}
                                        >
                                            <option value="Customer">Customer</option>
                                            <option value="VIP Customer">VIP Customer</option>
                                            <option value="Wholesale Buyer">Wholesale Buyer</option>
                                            <option value="Retail Member">Retail Member</option>
                                        </select>
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Account Status</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.status || "ACTIVE"}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="PENDING">PENDING</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 4. ORDER FORM */}
                    {isOrder && (
                        <>
                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-receipt text-primary-icon"></i>
                                    <span>Order & Customer</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item">
                                        <label className="drawer-label">Order ID *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. #ORD-9830"
                                            value={formData.code || formData.id || ""}
                                            onChange={(e) => {
                                                handleChange("code", e.target.value);
                                                handleChange("id", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Customer Name *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Sophia Martinez"
                                            value={formData.name || formData.customerName || ""}
                                            onChange={(e) => {
                                                handleChange("name", e.target.value);
                                                handleChange("customerName", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Delivery Address</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Panseke, Abeokuta"
                                            value={formData.address || ""}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-cart-check text-primary-icon"></i>
                                    <span>Fulfillment & Payment</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Items Summary</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Apple iPhone 13 Pro Max (256GB)"
                                            value={formData.notes || formData.productName || ""}
                                            onChange={(e) => {
                                                handleChange("notes", e.target.value);
                                                handleChange("productName", e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Total Amount (₦) *</label>
                                        <input
                                            type="number"
                                            className="drawer-input"
                                            placeholder="e.g. 850000"
                                            value={formData.price || formData.amount || ""}
                                            onChange={(e) => {
                                                handleChange("price", Number(e.target.value) || 0);
                                                handleChange("amount", Number(e.target.value) || 0);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Payment Method</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.paymentMethod || "Bank Transfer"}
                                            onChange={(e) => handleChange("paymentMethod", e.target.value)}
                                        >
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Credit Card">Credit Card</option>
                                            <option value="Debit Card">Debit Card</option>
                                            <option value="Cash on Delivery">Cash on Delivery</option>
                                        </select>
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Order Status</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.status || "Pending"}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                            <option value="Failed">Failed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 5. TRANSACTION FORM */}
                    {isTransaction && (
                        <>
                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-credit-card text-primary-icon"></i>
                                    <span>Transaction Details</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item">
                                        <label className="drawer-label">Transaction ID *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. #TXN-8821"
                                            value={formData.code || formData.id || ""}
                                            onChange={(e) => {
                                                handleChange("code", e.target.value);
                                                handleChange("id", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Customer Name *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Chloe Mitchell"
                                            value={formData.name || formData.customerName || ""}
                                            onChange={(e) => {
                                                handleChange("name", e.target.value);
                                                handleChange("customerName", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Amount (₦) *</label>
                                        <input
                                            type="number"
                                            className="drawer-input"
                                            placeholder="e.g. 65000"
                                            value={formData.amount || ""}
                                            onChange={(e) => handleChange("amount", Number(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Payment Channel</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.paymentMethod || "Bank Transfer"}
                                            onChange={(e) => handleChange("paymentMethod", e.target.value)}
                                        >
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Card Payment">Card Payment</option>
                                            <option value="USSD">USSD</option>
                                            <option value="Cash">Cash</option>
                                        </select>
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Payment Status</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.status || "PAID"}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="PAID">PAID</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="FAILED">FAILED</option>
                                            <option value="REFUNDED">REFUNDED</option>
                                        </select>
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Reference Note / Memo</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. Verified payment log via Monnify"
                                            value={formData.notes || ""}
                                            onChange={(e) => handleChange("notes", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 6. REPORT FORM */}
                    {isReport && (
                        <>
                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-bar-chart-line text-primary-icon"></i>
                                    <span>Report Configuration</span>
                                </div>
                                <div className="card-form-grid">
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
                        </>
                    )}

                    {/* 7. STAFF FORM (Default) */}
                    {isStaff && (
                        <>
                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-person-vcard text-primary-icon"></i>
                                    <span>Staff Basic Info</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Title</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.title || "Mr"}
                                            onChange={(e) => handleChange("title", e.target.value)}
                                        >
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Miss">Miss</option>
                                            <option value="Dr">Dr</option>
                                            <option value="Prof">Prof</option>
                                        </select>
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">First Name *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="Enter first name"
                                            value={formData.firstName || formData.name || ""}
                                            onChange={(e) => {
                                                handleChange("firstName", e.target.value);
                                                handleChange("name", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Last Name *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="Enter last name"
                                            value={formData.lastName || ""}
                                            onChange={(e) => handleChange("lastName", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Email Address *</label>
                                        <input
                                            type="email"
                                            className="drawer-input"
                                            placeholder="email@tradeflow.com"
                                            value={formData.email || formData.emailAddress || ""}
                                            onChange={(e) => {
                                                handleChange("email", e.target.value);
                                                handleChange("emailAddress", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Contact Number *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="080 1234 5678"
                                            value={formData.phone || formData.phoneNumber || ""}
                                            onChange={(e) => {
                                                handleChange("phone", e.target.value);
                                                handleChange("phoneNumber", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Address</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="Enter address"
                                            value={formData.address || ""}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                        />
                                    </div>

                                    {!formData.staffId && !formData.id && (
                                        <div className="form-group-item full-width">
                                            <label className="drawer-label">Initial Password</label>
                                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="drawer-input"
                                                    placeholder="Default: Password123!"
                                                    value={formData.password || ""}
                                                    onChange={(e) => handleChange("password", e.target.value)}
                                                    style={{ paddingRight: "42px", width: "100%" }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{
                                                        position: "absolute",
                                                        right: "12px",
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "#718096",
                                                        cursor: "pointer",
                                                        padding: 0,
                                                        fontSize: "1.1rem",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                    title={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="drawer-form-card">
                                <div className="card-header-bar">
                                    <i className="bi bi-shield-check text-primary-icon"></i>
                                    <span>Administrative & Status Details</span>
                                </div>
                                <div className="card-form-grid">
                                    <div className="form-group-item">
                                        <label className="drawer-label">Role</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.role || "Store Manager"}
                                            onChange={(e) => handleChange("role", e.target.value)}
                                        >
                                            <option value="Store Manager">Store Manager</option>
                                            <option value="Super Admin">Super Admin</option>
                                            <option value="Senior Operations Lead">Senior Operations Lead</option>
                                            <option value="Sales & Retail Lead">Sales & Retail Lead</option>
                                            <option value="Inventory Lead">Inventory Lead</option>
                                            <option value="Systems Specialist">Systems Specialist</option>
                                            <option value="Customer Support">Customer Support</option>
                                            <option value="Customer Success Officer">Customer Success Officer</option>
                                            <option value="Staff Member">Staff Member</option>
                                        </select>
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Account Status</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.status || "ACTIVE"}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="PENDING">PENDING</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer Actions */}
                    <div className="drawer-footer-actions">
                        <button
                            type="button"
                            className="btn-drawer-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-drawer-save"
                            disabled={isSaving}
                            style={{ opacity: isSaving ? 0.75 : 1, cursor: isSaving ? "not-allowed" : "pointer" }}
                        >
                            {isSaving ? (
                                <span>
                                    <i className="bi bi-arrow-repeat spin" style={{ marginRight: "6px" }}></i>
                                    Saving...
                                </span>
                            ) : (
                                <span>
                                    <i className="bi bi-check2-circle"></i> Save Changes
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
