import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";

// Slide drawer specifically for adding or editing a staff member.
export default function StaffSlideDrawer({
    isOpen,
    onClose,
    title = "Staff Details",
    subtitle = "Please complete the form below with accurate staff details.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [titlesList, setTitlesList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [statusesList, setStatusesList] = useState([]);

    // Load setup tables (titles, roles, and statuses) directly from the backend
    useEffect(() => {
        const loadSetup = async () => {
            const [tRes, rRes, sRes] = await Promise.all([
                setupService.fetchAllTitles(),
                setupService.fetchAllRoles(),
                setupService.fetchAllStatus()
            ]);
            if (tRes.success && Array.isArray(tRes.data)) setTitlesList(tRes.data);
            if (rRes.success && Array.isArray(rRes.data)) setRolesList(rRes.data);
            if (sRes.success && Array.isArray(sRes.data)) setStatusesList(sRes.data);
        };
        loadSetup();
    }, []);

    // Synchronize form state when drawer opens or initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        }
        setShowPassword(false);
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
            icon="bi bi-person-badge"
            entityType="Staff Member"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            {/* Card 1: Basic Information */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-person-vcard text-primary-icon"></i>
                    <span>Staff Basic Info</span>
                </div>
                <div className="card-form-grid">
                    {/* Title */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Title</label>
                        <select
                            className="drawer-input"
                            value={formData.title || "Mr"}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = titlesList.find((t) => t.title_name === val);
                                setFormData((prev) => ({
                                    ...prev,
                                    title: val,
                                    titleId: matched?.title_id || titlesList[0]?.title_id || ""
                                }));
                            }}
                        >
                            {titlesList.map((t) => (
                                <option key={t.title_id} value={t.title_name}>
                                    {t.title_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* First Name */}
                    <div className="form-group-item">
                        <label className="drawer-label">First Name *</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="Enter first name"
                            value={formData.firstName || formData.name?.split(" ")[0] || ""}
                            onChange={(e) => {
                                handleChange("firstName", e.target.value);
                                handleChange("name", `${e.target.value} ${formData.lastName || ""}`.trim());
                            }}
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="form-group-item">
                        <label className="drawer-label">Last Name *</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="Enter last name"
                            value={formData.lastName || ""}
                            onChange={(e) => {
                                handleChange("lastName", e.target.value);
                                handleChange("name", `${formData.firstName || ""} ${e.target.value}`.trim());
                            }}
                            required
                        />
                    </div>

                    {/* Email */}
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

                    {/* Phone Number */}
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

                    {/* Address */}
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

                    {/* Initial Password (only shown when creating a new staff account) */}
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

            {/* Card 2: Administrative Role & Status Details */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-shield-check text-primary-icon"></i>
                    <span>Administrative & Status Details</span>
                </div>
                <div className="card-form-grid">
                    {/* Role */}
                    <div className="form-group-item">
                        <label className="drawer-label">Role</label>
                        <select
                            className="drawer-input"
                            value={formData.role || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = rolesList.find((r) => r.role_name === val);
                                setFormData((prev) => ({
                                    ...prev,
                                    role: val,
                                    roleId: matched?.role_id || rolesList[0]?.role_id || ""
                                }));
                            }}
                        >
                            {/* Filter out customer role (role_id 19) */}
                            {rolesList.filter((r) => r.role_id !== "19" && !r.role_name.toLowerCase().includes("customer")).map((r) => (
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
                            {/* Only Active and Inactive for staff accounts */}
                            {statusesList.filter((s) => ["1", "2"].includes(String(s.status_id)) || ["ACTIVE", "INACTIVE"].includes(s.status_name.toUpperCase())).map((s) => (
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
