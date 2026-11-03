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
    const [titlesList, setTitlesList] = useState(setupService.getCachedTitles());
    const [rolesList, setRolesList] = useState(setupService.getCachedRoles());
    const [statusesList, setStatusesList] = useState(() => setupService.getAccountStatuses(setupService.getCachedStatuses()));

    // Load titles, full roles list (all 19), and account statuses from backend setup
    useEffect(() => {
        const loadSetup = async () => {
            const [tRes, rRes, sRes] = await Promise.all([
                setupService.fetchAllTitles(),
                setupService.fetchAllRoles(),
                setupService.fetchAllStatus()
            ]);
            if (tRes.success && Array.isArray(tRes.data)) setTitlesList(tRes.data);
            if (rRes.success && Array.isArray(rRes.data)) setRolesList(rRes.data);
            if (sRes.success && Array.isArray(sRes.data)) {
                setStatusesList(setupService.getAccountStatuses(sRes.data));
            }
        };
        loadSetup();
    }, []);

    useEffect(() => {
        if (initialData) {
            const titleId = initialData.titleId ? String(initialData.titleId) : setupService.getTitleId(initialData.title, "1");
            const roleId = initialData.roleId ? String(initialData.roleId) : setupService.getRoleId(initialData.role, "19");
            const statusId = initialData.statusId ? String(initialData.statusId) : setupService.getStatusId(initialData.status, "1");
            const firstName = initialData.firstName || initialData.first_name || initialData.name?.split(" ")[0] || "";
            const lastName = initialData.lastName || initialData.last_name || initialData.name?.split(" ").slice(1).join(" ") || "";
            setFormData({
                ...initialData,
                firstName,
                lastName,
                titleId: titleId || "1",
                roleId: roleId || "19",
                statusId: statusId || "1"
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
            icon="bi bi-people"
            entityType="Customer Account"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            <div className="drawer-flat-form">
                {/* Title */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Title</label>
                    <select
                        className="drawer-input"
                        value={String(formData.titleId || "1")}
                        onChange={(e) => {
                            const val = e.target.value;
                            const matched = titlesList.find((t) => String(t.title_id) === String(val));
                            setFormData((prev) => ({
                                ...prev,
                                titleId: val,
                                title: matched?.title_name || prev.title || "Mr"
                            }));
                        }}
                    >
                        {titlesList.map((t) => (
                            <option key={t.title_id} value={t.title_id}>
                                {t.title_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* First Name & Last Name */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">First Name</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. Alexander"
                            value={formData.firstName || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange("firstName", val);
                                handleChange("name", `${val} ${formData.lastName || ""}`.trim());
                            }}
                        />
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Last Name</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. Wright"
                            value={formData.lastName || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange("lastName", val);
                                handleChange("name", `${formData.firstName || ""} ${val}`.trim());
                            }}
                        />
                    </div>
                </div>

                {/* Phone & Email */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Contact Number</label>
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

                    <div className="drawer-form-group">
                        <label className="drawer-label">Email Address</label>
                        <input
                            type="email"
                            className="drawer-input"
                            placeholder="customer@example.com"
                            value={formData.email || formData.emailAddress || ""}
                            onChange={(e) => {
                                handleChange("email", e.target.value);
                                handleChange("emailAddress", e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Delivery Address</label>
                    <input
                        type="text"
                        className="drawer-input"
                        placeholder="e.g. Ibara, Abeokuta, Ogun State"
                        value={formData.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </div>

                {/* Customer Role & Status */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Customer Tier / Role</label>
                        <select
                            className="drawer-input"
                            value={String(formData.roleId || "19")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = rolesList.find((r) => String(r.role_id) === String(val));
                                setFormData((prev) => ({
                                    ...prev,
                                    roleId: val,
                                    role: matched?.role_name || prev.role || "Customer"
                                }));
                            }}
                        >
                            {rolesList.length > 0 ? (
                                rolesList.map((r) => (
                                    <option key={r.role_id} value={r.role_id}>
                                        {r.role_name}
                                    </option>
                                ))
                            ) : (
                                <option value="19">Customer</option>
                            )}
                        </select>
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Account Status</label>
                        <select
                            className="drawer-input"
                            value={String(formData.statusId || "1")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = statusesList.find((s) => String(s.status_id) === String(val));
                                setFormData((prev) => ({
                                    ...prev,
                                    statusId: val,
                                    status: matched?.status_name || prev.status || "ACTIVE"
                                }));
                            }}
                        >
                            {statusesList.map((s) => (
                                <option key={s.status_id} value={s.status_id}>
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
