import React, { useState, useEffect } from "react";

export default function AdminSlideDrawer({
    isOpen,
    onClose,
    title = "Edit Details",
    subtitle = "Please complete the form below with accurate details.",
    icon = "bi bi-pencil-square",
    entityType = "Item",
    initialData = {},
    onSave
}) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) onSave(formData);
        onClose();
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

                <form className="drawer-body-scroll" onSubmit={handleSubmit}>
                    <div className="drawer-form-card">
                        <div className="card-header-bar">
                            <i className="bi bi-person-vcard text-primary-icon"></i>
                            <span>{entityType} Basic Info</span>
                        </div>
                        <div className="card-form-grid">
                            <div className="form-group-item full-width">
                                <label className="drawer-label">Title / Salutation</label>
                                <select
                                    className="drawer-input"
                                    value={formData.title || ""}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                >
                                    <option value="">Select here</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Prof">Prof</option>
                                    <option value="Engr">Engr</option>
                                </select>
                            </div>

                            <div className="form-group-item">
                                <label className="drawer-label">First Name / Name *</label>
                                <input
                                    type="text"
                                    className="drawer-input"
                                    placeholder="Enter first name"
                                    value={formData.firstName || formData.name || ""}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group-item">
                                <label className="drawer-label">Last Name / Code *</label>
                                <input
                                    type="text"
                                    className="drawer-input"
                                    placeholder="Enter last name or ID code"
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
                                    value={formData.email || ""}
                                    onChange={(e) => handleChange("email", e.target.value)}
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
                                />
                            </div>

                            <div className="form-group-item full-width">
                                <label className="drawer-label">Home Address / Location</label>
                                <input
                                    type="text"
                                    className="drawer-input"
                                    placeholder="Abeokuta, Ogun State, Nigeria"
                                    value={formData.address || ""}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
 
                    <div className="drawer-form-card">
                        <div className="card-header-bar">
                            <i className="bi bi-shield-check text-primary-icon"></i>
                            <span>Administrative & Status Details</span>
                        </div>
                        <div className="card-form-grid">
                            <div className="form-group-item">
                                <label className="drawer-label">Assigned Role / Category</label>
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
                                <label className="drawer-label">Account / Record Status</label>
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

                            <div className="form-group-item full-width">
                                <label className="drawer-label">Notes / Remarks</label>
                                <textarea
                                    className="drawer-textarea"
                                    rows="3"
                                    placeholder="Add any additional remarks or administrative notes..."
                                    value={formData.notes || ""}
                                    onChange={(e) => handleChange("notes", e.target.value)}
                                ></textarea>
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
                        >
                            <i className="bi bi-check2-circle"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
