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
    const [titlesList, setTitlesList] = useState(setupService.getCachedTitles());
    const [rolesList, setRolesList] = useState(() => setupService.getStaffRoles(setupService.getCachedRoles()));
    const [statusesList, setStatusesList] = useState(() => setupService.getActiveInactiveStatuses(setupService.getCachedStatuses()));
    const [errors, setErrors] = useState({});
    const [localError, setLocalError] = useState("");

    // Load setup tables (titles, roles, and statuses) directly from the backend
    useEffect(() => {
        const loadSetup = async () => {
            const [tRes, rRes, sRes] = await Promise.all([
                setupService.fetchAllTitles(),
                setupService.fetchAllRoles(),
                setupService.fetchAllStatus()
            ]);
            if (tRes.success && Array.isArray(tRes.data)) setTitlesList(tRes.data);
            if (rRes.success && Array.isArray(rRes.data)) setRolesList(setupService.getStaffRoles(rRes.data));
            if (sRes.success && Array.isArray(sRes.data)) setStatusesList(setupService.getActiveInactiveStatuses(sRes.data));
        };
        loadSetup();
    }, []);

     
    useEffect(() => {
        if (initialData) {
            const isEdit = Boolean(initialData.staffId || initialData.id);
            const titleId = initialData.titleId
                ? String(initialData.titleId)
                : (isEdit && initialData.title ? setupService.getTitleId(initialData.title) : "");
            const roleId = (initialData.roleId || initialData.role_id)
                ? String(initialData.roleId || initialData.role_id)
                : (isEdit && initialData.role ? setupService.getRoleId(initialData.role) : "");
            const statusId = (initialData.statusId || initialData.status_id)
                ? String(initialData.statusId || initialData.status_id)
                : (isEdit && initialData.status ? setupService.getStatusId(initialData.status) : "");
            setFormData({
                ...initialData,
                titleId: titleId || "",
                roleId: roleId || "",
                statusId: statusId || ""
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
        if (!formData.titleId) newErrors.titleId = true;
        if (!formData.firstName && !formData.name?.split(" ")[0]) newErrors.firstName = true;
        if (!formData.lastName) newErrors.lastName = true;

        const emailVal = (formData.email || formData.emailAddress || "").trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) newErrors.email = true;

        const phoneVal = (formData.phone || formData.phoneNumber || "").trim();
        if (!phoneVal) newErrors.phone = true;

        if (!formData.roleId) newErrors.roleId = true;
        if (!formData.statusId) newErrors.statusId = true;

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
            icon="bi bi-person-badge"
            entityType="Staff Member"
            isSaving={isSaving}
            errorMessage={errorMessage || localError}
            onSubmit={handleSubmit}
        >
            <div className="drawer-flat-form">
                {/* Title */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Title</label>
                    <select
                        className={`drawer-input ${errors.titleId ? "is-invalid" : ""}`}
                        value={formData.titleId || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            const matched = titlesList.find((t) => String(t.title_id) === String(val));
                            setFormData((prev) => ({
                                ...prev,
                                titleId: val,
                                title: matched?.title_name || ""
                            }));
                            if (errors.titleId) setErrors((prev) => ({ ...prev, titleId: false }));
                            if (localError) setLocalError("");
                        }}
                    >
                        <option value="">Select Here</option>
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
                            className={`drawer-input ${errors.firstName ? "is-invalid" : ""}`}
                            placeholder="Enter first name"
                            value={formData.firstName || formData.name?.split(" ")[0] || ""}
                            onChange={(e) => {
                                handleChange("firstName", e.target.value);
                                handleChange("name", `${e.target.value} ${formData.lastName || ""}`.trim());
                            }}
                        />
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Last Name</label>
                        <input
                            type="text"
                            className={`drawer-input ${errors.lastName ? "is-invalid" : ""}`}
                            placeholder="Enter last name"
                            value={formData.lastName || ""}
                            onChange={(e) => {
                                handleChange("lastName", e.target.value);
                                handleChange("name", `${formData.firstName || ""} ${e.target.value}`.trim());
                            }}
                        />
                    </div>
                </div>

                {/* Email & Contact Number */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Email Address</label>
                        <input
                            type="text"
                            inputMode="email"
                            className={`drawer-input ${errors.email ? "is-invalid" : ""}`}
                            placeholder="email@tradeflow.com"
                            value={formData.email || formData.emailAddress || ""}
                            onChange={(e) => {
                                handleChange("email", e.target.value);
                                handleChange("emailAddress", e.target.value);
                            }}
                        />
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Contact Number</label>
                        <input
                            type="text"
                            className={`drawer-input ${errors.phone ? "is-invalid" : ""}`}
                            placeholder="080 1234 5678"
                            value={formData.phone || formData.phoneNumber || ""}
                            onChange={(e) => {
                                handleChange("phone", e.target.value);
                                handleChange("phoneNumber", e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Address</label>
                    <input
                        type="text"
                        className="drawer-input"
                        placeholder="Enter address"
                        value={formData.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </div>

                {/* Role & Account Status */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Role</label>
                        <select
                            className={`drawer-input ${errors.roleId ? "is-invalid" : ""}`}
                            value={String(formData.roleId || "")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = rolesList.find((r) => String(r.role_id) === String(val));
                                setFormData((prev) => ({
                                    ...prev,
                                    roleId: val,
                                    role: matched?.role_name || prev.role || ""
                                }));
                                if (errors.roleId) setErrors((prev) => ({ ...prev, roleId: false }));
                                if (localError) setLocalError("");
                            }}
                        >
                            <option value="">Select Here</option>
                            {rolesList.map((r) => (
                                <option key={r.role_id} value={r.role_id}>
                                    {r.role_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Account Status</label>
                        <select
                            className={`drawer-input ${errors.statusId ? "is-invalid" : ""}`}
                            value={String(formData.statusId || "")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = statusesList.find((s) => String(s.status_id) === String(val));
                                setFormData((prev) => ({
                                    ...prev,
                                    statusId: val,
                                    status: matched?.status_name || (val === "2" ? "INACTIVE" : "ACTIVE")
                                }));
                                if (errors.statusId) setErrors((prev) => ({ ...prev, statusId: false }));
                                if (localError) setLocalError("");
                            }}
                        >
                            <option value="">Select Here</option>
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
