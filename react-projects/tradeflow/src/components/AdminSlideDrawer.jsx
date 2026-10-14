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
            setFormData(initialData);
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
                    <div className="drawer-form-card">
                        <div className="card-header-bar">
                            <i className="bi bi-person-vcard text-primary-icon"></i>
                            <span>{entityType} Basic Info</span>
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
                                    value={formData.lastName || formData.code || ""}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
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

                            {entityType === "Staff Member" && !formData.staffId && (
                                <div className="form-group-item full-width">
                                    <label className="drawer-label">Initial Password</label>
                                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="drawer-input"
                                            placeholder="Default: 123456"
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
                                    value={formData.role || formData.categoryName || ""}
                                    onChange={(e) => handleChange(entityType.toLowerCase().includes("product") ? "categoryName" : "role", e.target.value)}
                                >
                                    {entityType.toLowerCase().includes("customer") ? (
                                        <>
                                            <option value="Customer">Customer</option>
                                            <option value="VIP Customer">VIP Customer</option>
                                            <option value="Wholesale Buyer">Wholesale Buyer</option>
                                            <option value="Retail Member">Retail Member</option>
                                        </>
                                    ) : entityType.toLowerCase().includes("product") || entityType.toLowerCase().includes("category") ? (
                                        <>
                                            <option value="Mobile Devices & Phones">Mobile Devices & Phones</option>
                                            <option value="Footwear & Shoes">Footwear & Shoes</option>
                                            <option value="Apparel & Clothing">Apparel & Clothing</option>
                                            <option value="Bags & Accessories">Bags & Accessories</option>
                                            <option value="Audio Devices & Sound">Audio Devices & Sound</option>
                                            <option value="Wearable Technology">Wearable Technology</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Store Manager">Store Manager</option>
                                            <option value="Senior Operations Lead">Senior Operations Lead</option>
                                            <option value="Sales & Retail Lead">Sales & Retail Lead</option>
                                            <option value="Inventory Lead">Inventory Lead</option>
                                            <option value="Systems Specialist">Systems Specialist</option>
                                            <option value="Customer Support">Customer Support</option>
                                            <option value="Customer Success Officer">Customer Success Officer</option>
                                            <option value="Staff Member">Staff Member</option>
                                        </>
                                    )}
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
