import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";

// Slide drawer specifically for viewing or exporting transaction details.
export default function TransactionSlideDrawer({
    isOpen,
    onClose,
    title = "Transaction Details",
    subtitle = "View or verify transaction log details.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [statusesList, setStatusesList] = useState(() => setupService.getActiveInactiveStatuses(setupService.getCachedStatuses()));
    const [paymentMethodsList, setPaymentMethodsList] = useState(setupService.getCachedPaymentMethods());
    const [errors, setErrors] = useState({});
    const [localError, setLocalError] = useState("");

    // Load payment transaction statuses (active/inactive) and payment methods from backend setup
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getActiveInactiveStatuses(res.data));
            }
        });
        setupService.fetchAllPaymentMethods().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setPaymentMethodsList(res.data);
            }
        });
    }, []);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            const isEdit = Boolean(initialData.id || initialData.code);
            const statusId = initialData.statusId ? String(initialData.statusId) : (isEdit && initialData.status ? setupService.getStatusId(initialData.status) : "");
            const paymentMethodId = initialData.paymentMethodId ? String(initialData.paymentMethodId) : (isEdit && initialData.paymentMethod ? setupService.getPaymentMethodId(initialData.paymentMethod) : "");
            setFormData({
                ...initialData,
                statusId: statusId || "",
                paymentMethodId: paymentMethodId || ""
            });
        } else {
            setFormData({
                code: "",
                id: "",
                name: "",
                customerName: "",
                amount: "",
                paymentMethodId: "",
                statusId: "",
                notes: ""
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
        const amt = formData.amount;
        if (amt === undefined || amt === null || String(amt).trim() === "" || Number(amt) <= 0) {
            newErrors.amount = true;
        }
        if (!formData.paymentMethodId) newErrors.paymentMethodId = true;
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
            icon="bi bi-credit-card"
            entityType="Transaction"
            isSaving={isSaving}
            errorMessage={errorMessage || localError}
            onSubmit={handleSubmit}
        >
            <div className="drawer-flat-form">
                {/* Transaction ID & Customer Name */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Transaction ID</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. #TXN-8821"
                            value={formData.code || formData.id || ""}
                            onChange={(e) => {
                                handleChange("code", e.target.value);
                                handleChange("id", e.target.value);
                            }}
                        />
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Customer Name</label>
                        <input
                            type="text"
                            className="drawer-input"
                            placeholder="e.g. Chloe Mitchell"
                            value={formData.name || formData.customerName || ""}
                            onChange={(e) => {
                                handleChange("name", e.target.value);
                                handleChange("customerName", e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* Amount & Payment Channel */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Amount (₦)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            className={`drawer-input ${errors.amount ? "is-invalid" : ""}`}
                            placeholder="e.g. 65000"
                            value={formData.amount || ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9.]/g, "");
                                handleChange("amount", val);
                            }}
                        />
                    </div>

                    <div className="drawer-form-group">
                        <label className="drawer-label">Payment Channel</label>
                        <select
                            className={`drawer-input ${errors.paymentMethodId ? "is-invalid" : ""}`}
                            value={String(formData.paymentMethodId || "")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = paymentMethodsList.find((pm) => String(pm.payment_method_id) === String(val));
                                setFormData((prev) => ({
                                    ...prev,
                                    paymentMethodId: val,
                                    paymentMethod: matched?.payment_method_name || prev.paymentMethod || ""
                                }));
                                if (errors.paymentMethodId) setErrors((prev) => ({ ...prev, paymentMethodId: false }));
                                if (localError) setLocalError("");
                            }}
                        >
                            <option value="">Select Here</option>
                            {paymentMethodsList.map((pm) => (
                                <option key={pm.payment_method_id} value={pm.payment_method_id}>
                                    {pm.payment_method_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Payment Status</label>
                    <select
                        className={`drawer-input ${errors.statusId ? "is-invalid" : ""}`}
                        value={String(formData.statusId || "")}
                        onChange={(e) => {
                            const val = e.target.value;
                            const matched = statusesList.find((s) => String(s.status_id) === String(val));
                            setFormData((prev) => ({
                                ...prev,
                                statusId: val,
                                status: matched?.status_name || prev.status || ""
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

                {/* Reference Note */}
                <div className="drawer-form-group">
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
        </BaseDrawerShell>
    );
}
