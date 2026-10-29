import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";

// Slide drawer specifically for adding or editing a customer account.
export default function CustomerSlideDrawer({
    isOpen,
    onClose,
    title = "Customer Details",
    subtitle = "Please complete the form below with accurate customer details.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [rolesList, setRolesList] = useState([]);
    const [statusesList, setStatusesList] = useState([]);

    // Load customer roles and statuses from the backend setup endpoints
    useEffect(() => {
        const loadSetup = async () => {
            const [rRes, sRes] = await Promise.all([
                setupService.fetchAllRoles(),
                setupService.fetchAllStatus()
            ]);
            if (rRes.success && Array.isArray(rRes.data)) setRolesList(rRes.data);
            if (sRes.success && Array.isArray(sRes.data)) setStatusesList(sRes.data);
        };
        loadSetup();
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
            icon="bi bi-people"
            entityType="Customer Account"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            {/* Card 1: Customer Contact & Delivery Info */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-person-vcard text-primary-icon"></i>
                    <span>Customer Details</span>
                </div>
                <div className="card-form-grid">
                    {/* Full Name */}
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
                                setFormData((prev) => ({
                                    ...prev,
                                    name: val,
                                    firstName: parts[0] || "",
                                    lastName: parts.slice(1).join(" ") || ""
                                }));
                            }}
                            required
                        />
                    </div>

                    {/* Customer ID */}
                    <div className="form-group-item">
                        <label className="drawer-label">Customer ID</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="Auto-generated on save"
                            value={formData.id || formData.customerId || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData((prev) => ({
                                    ...prev,
                                    id: val,
                                    customerId: val
                                }));
                            }}
                            readOnly={Boolean(formData.id || formData.customerId)}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="form-group-item">
                        <label className="drawer-label">Phone Number *</label>
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

                    {/* Email */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Email Address *</label>
                        <input
                            type="email"
                            className="drawer-input"
                            placeholder="customer@example.com"
                            value={formData.email || formData.emailAddress || ""}
                            onChange={(e) => {
                                handleChange("email", e.target.value);
                                handleChange("emailAddress", e.target.value);
                            }}
                            required
                        />
                    </div>

                    {/* Delivery Address */}
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

            {/* Card 2: Membership & Account Status */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-shield-check text-primary-icon"></i>
                    <span>Membership & Status</span>
                </div>
                <div className="card-form-grid">
                    {/* Role / Tier */}
                    <div className="form-group-item">
                        <label className="drawer-label">Customer Tier / Role</label>
                        <select
                            className="drawer-input"
                            value={formData.role || "Customer"}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = rolesList.find((r) => r.role_name === val);
                                setFormData((prev) => ({
                                    ...prev,
                                    role: val,
                                    roleId: matched?.role_id || rolesList.find((r) => r.role_name.toLowerCase().includes("customer"))?.role_id || ""
                                }));
                            }}
                        >
                            {/* Render customer role from backend setup */}
                            {rolesList.filter((r) => r.role_id === "19" || r.role_name.toLowerCase().includes("customer")).map((r) => (
                                <option key={r.role_id} value={r.role_name}>
                                    {r.role_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="form-group-item">
                        <label className="drawer-label">Account Status</label>
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
                </div>
            </div>
        </BaseDrawerShell>
    );
}
