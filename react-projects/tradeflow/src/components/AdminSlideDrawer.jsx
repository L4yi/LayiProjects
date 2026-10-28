import React, { useState, useEffect } from "react";
import setupService from "../services/setupService";

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
    categoriesList = [],
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [titlesList, setTitlesList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [statusesList, setStatusesList] = useState([]);
    const [paymentMethodsList, setPaymentMethodsList] = useState([]);

    // load setup tables from backend so dropdowns are always new and updated
    useEffect(() => {
        const loadSetupData = async () => {
            const [titlesRes, rolesRes, pmRes, statusesRes] = await Promise.all([
                setupService.fetchAllTitles(),
                setupService.fetchAllRoles(),
                setupService.fetchAllPaymentMethods(),
                setupService.fetchAllStatus()
            ]);
            if (titlesRes.success && Array.isArray(titlesRes.data)) {
                setTitlesList(titlesRes.data);
            }
            if (rolesRes.success && Array.isArray(rolesRes.data)) {
                setRolesList(rolesRes.data);
            }
            if (pmRes.success && Array.isArray(pmRes.data)) {
                setPaymentMethodsList(pmRes.data);
            }
            if (statusesRes.success && Array.isArray(statusesRes.data)) {
                setStatusesList(statusesRes.data);
            }
        };
        loadSetupData();
    }, []);

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

    const norm = String(entityType || "").toLowerCase();
    const isCategory = norm.includes("categor");
    const isProduct = norm.includes("product") && !isCategory;
    const isOrder = norm.includes("order");
    const isCustomer = norm.includes("customer") && !isOrder;
    const isTransaction = norm.includes("transaction");
    const isReport = norm.includes("report");
    const isStaff = !isCategory && !isProduct && !isCustomer && !isOrder && !isTransaction && !isReport;

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="admin-slide-drawer" onClick={(e) => e.stopPropagation()}>
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

                <div className="drawer-subtitle-bar">
                    <p>
                        You are about to modify <strong>{entityType}</strong>. {subtitle}
                    </p>
                </div>

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
                                            value={formData.name || formData.categoryName || ""}
                                            onChange={(e) => {
                                                handleChange("name", e.target.value);
                                                handleChange("categoryName", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

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

                                    <div className="form-group-item">
                                        <label className="drawer-label">Status</label>
                                        <select
                                            className="drawer-input"
                                            value={String(formData.status || "ACTIVE").toUpperCase()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matched = statusesList.find(s => s.status_name.toUpperCase() === val.toUpperCase());
                                                setFormData(prev => ({ ...prev, status: val, statusId: matched?.status_id || "1" }));
                                            }}
                                        >
                                            {statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING"].includes(s.status_name.toUpperCase())).length > 0 ? (
                                                statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING"].includes(s.status_name.toUpperCase())).map(s => (
                                                    <option key={s.status_id} value={s.status_name}>{s.status_name}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="INACTIVE">INACTIVE</option>
                                                </>
                                            )}
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
                                            value={formData.productName || formData.name || ""}
                                            onChange={(e) => {
                                                handleChange("productName", e.target.value);
                                                handleChange("name", e.target.value);
                                            }}
                                            required
                                        />
                                    </div>

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

                                    <div className="form-group-item">
                                        <label className="drawer-label">Category *</label>
                                        <select
                                            className="drawer-input"
                                            value={formData.categoryId || formData.categories_id || ""}
                                            onChange={(e) => {
                                                const catId = e.target.value;
                                                const selectedCat = (categoriesList || []).find(c => (c.categories_id || c.categoryId || c.id) === catId);
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
                                                <option key={cat.categories_id || cat.categoryId || cat.id} value={cat.categories_id || cat.categoryId || cat.id}>
                                                    {cat.categories_name || cat.categoryName || cat.name}
                                                </option>
                                            ))}
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
                                            value={formData.productPrice ?? formData.price ?? ""}
                                            onChange={(e) => {
                                                const p = Number(e.target.value) || 0;
                                                handleChange("price", p);
                                                handleChange("productPrice", p);
                                            }}
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

                                    <div className="form-group-item">
                                        <label className="drawer-label">Status</label>
                                        <select
                                            className="drawer-input"
                                            value={String(formData.status || "ACTIVE").toUpperCase()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matched = statusesList.find(s => s.status_name.toUpperCase() === val.toUpperCase());
                                                setFormData(prev => ({ ...prev, status: val, statusId: matched?.status_id || "1" }));
                                            }}
                                        >
                                            {statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING", "OUT OF STOCK", "IN STOCK"].includes(s.status_name.toUpperCase())).length > 0 ? (
                                                statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING", "OUT OF STOCK", "IN STOCK"].includes(s.status_name.toUpperCase())).map(s => (
                                                    <option key={s.status_id} value={s.status_name}>{s.status_name}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="INACTIVE">INACTIVE</option>
                                                    <option value="OUT OF STOCK">OUT OF STOCK</option>
                                                </>
                                            )}
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
                        </>
                    )}

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
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const parts = val.trim().split(/\s+/);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    name: val,
                                                    firstName: parts[0] || "",
                                                    lastName: parts.slice(1).join(" ") || ""
                                                }));
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Customer ID</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="e.g. CUST-01"
                                            value={formData.id || formData.customerId || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    id: val,
                                                    customerId: val
                                                }));
                                            }}
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Phone Number *</label>
                                        <input
                                            type="text"
                                            className="drawer-input"
                                            placeholder="080 1234 5678"
                                            value={formData.phone || formData.phoneNumber || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    phone: val,
                                                    phoneNumber: val
                                                }));
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Email Address *</label>
                                        <input
                                            type="email"
                                            className="drawer-input"
                                            placeholder="customer@example.com"
                                            value={formData.email || formData.emailAddress || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    email: val,
                                                    emailAddress: val
                                                }));
                                            }}
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
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matched = rolesList.find(r => r.role_name === val);
                                                setFormData(prev => ({ ...prev, role: val, roleId: matched?.role_id || "19" }));
                                            }}
                                        >
                                            {rolesList.filter(r => r.role_name.toLowerCase().includes("customer") || r.role_id === "19").length > 0 ? (
                                                rolesList.filter(r => r.role_name.toLowerCase().includes("customer") || r.role_id === "19").map(r => (
                                                    <option key={r.role_id} value={r.role_name}>{r.role_name}</option>
                                                ))
                                            ) : (
                                                <option value="Customer">Customer</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Account Status</label>
                                        <select
                                            className="drawer-input"
                                            value={String(formData.status || "ACTIVE").toUpperCase()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matched = statusesList.find(s => s.status_name.toUpperCase() === val.toUpperCase());
                                                setFormData(prev => ({ ...prev, status: val, statusId: matched?.status_id || "1" }));
                                            }}
                                        >
                                            {statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING"].includes(s.status_name.toUpperCase())).length > 0 ? (
                                                statusesList.filter(s => ["ACTIVE", "INACTIVE", "PENDING"].includes(s.status_name.toUpperCase())).map(s => (
                                                    <option key={s.status_id} value={s.status_name}>{s.status_name}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="INACTIVE">INACTIVE</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

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
                                            {paymentMethodsList.length > 0 ? (
                                                paymentMethodsList.map(pm => (
                                                    <option key={pm.payment_method_id} value={pm.payment_method_name}>
                                                        {pm.payment_method_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="Wallet">Wallet</option>
                                                    <option value="Cash">Cash</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group-item full-width">
                                        <label className="drawer-label">Order Status</label>
                                        <select
                                            className="drawer-input"
                                            value={(() => {
                                                const s = String(formData.status || "").toLowerCase();
                                                if (s.includes("success") || s === "active") return "Successful";
                                                if (s.includes("fail") || s === "inactive") return "Failed";
                                                if (s.includes("paid")) return "Paid";
                                                return "Processing";
                                            })()}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const sUpper = val.toUpperCase();
                                                let sId = "4";
                                                if (sUpper.includes("SUCCESS")) sId = "5";
                                                else if (sUpper.includes("FAIL")) sId = "9";
                                                else if (sUpper.includes("PAID")) sId = "8";
                                                setFormData(prev => ({ ...prev, status: val, statusId: sId }));
                                            }}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Successful">Successful</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Failed">Failed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

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
                                            value={formData.status || "ACTIVE"}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
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
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matched = titlesList.find(t => t.title_name === val);
                                                setFormData(prev => ({ ...prev, title: val, titleId: matched?.title_id || "1" }));
                                            }}
                                        >
                                            {titlesList.length > 0 ? (
                                                titlesList.map(t => (
                                                    <option key={t.title_id} value={t.title_name}>{t.title_name}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="Mr">Mr</option>
                                                    <option value="Mrs">Mrs</option>
                                                    <option value="Dr">Dr</option>
                                                </>
                                            )}
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
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matched = rolesList.find(r => r.role_name === val);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    role: val,
                                                    roleId: matched?.role_id || "5"
                                                }));
                                            }}
                                        >
                                            {rolesList.filter(r => r.role_id !== "19").length > 0 ? (
                                                rolesList.filter(r => r.role_id !== "19").map(r => (
                                                    <option key={r.role_id} value={r.role_name}>{r.role_name}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="Store Manager">Store Manager</option>
                                                    <option value="Super Admin">Super Admin</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="STAFF">STAFF</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group-item">
                                        <label className="drawer-label">Account Status</label>
                                        <select
                                            className="drawer-input"
                                            value={(String(formData.status || "").toUpperCase() === "INACTIVE" || String(formData.statusId) === "2") ? "INACTIVE" : "ACTIVE"}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matched = statusesList.find(s => s.status_name.toUpperCase() === val.toUpperCase());
                                                setFormData(prev => ({
                                                    ...prev,
                                                    status: val,
                                                    statusId: matched?.status_id || (val === "INACTIVE" ? "2" : "1")
                                                }));
                                            }}
                                        >
                                            {statusesList.filter(s => ["ACTIVE", "INACTIVE"].includes(s.status_name.toUpperCase())).length > 0 ? (
                                                statusesList.filter(s => ["ACTIVE", "INACTIVE"].includes(s.status_name.toUpperCase())).map(s => (
                                                    <option key={s.status_id} value={s.status_name}>{s.status_name}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="INACTIVE">INACTIVE</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

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
