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
    const [statusesList, setStatusesList] = useState(() => setupService.getTransactionStatuses(setupService.getCachedStatuses()));
    const [paymentMethodsList, setPaymentMethodsList] = useState(setupService.getCachedPaymentMethods());

    // Load payment transaction statuses and payment methods from backend setup
    useEffect(() => {
        setupService.fetchAllStatus().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getTransactionStatuses(res.data));
            }
        });
        setupService.fetchAllPaymentMethods().then((res) => {
            if (res.success && Array.isArray(res.data)) {
                setPaymentMethodsList(res.data);
            }
        });
    }, []);

    useEffect(() => {
        if (initialData) {
            const statusId = initialData.statusId ? String(initialData.statusId) : setupService.getStatusId(initialData.status, "1");
            setFormData({
                ...initialData,
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
            icon="bi bi-credit-card"
            entityType="Transaction"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-credit-card text-primary-icon"></i>
                    <span>Transaction Details</span>
                </div>
                <div className="card-form-grid">
                    {/* Transaction ID */}
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

                    {/* Customer Name */}
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

                    {/* Amount */}
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

                    {/* Payment Channel */}
                    <div className="form-group-item">
                        <label className="drawer-label">Payment Channel</label>
                        <select
                            className="drawer-input"
                            value={String(formData.paymentMethodId || (paymentMethodsList.find(pm => pm.payment_method_name === formData.paymentMethod)?.payment_method_id) || "2")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = paymentMethodsList.find(pm => String(pm.payment_method_id) === String(val));
                                setFormData(prev => ({
                                    ...prev,
                                    paymentMethodId: val,
                                    paymentMethod: matched?.payment_method_name || prev.paymentMethod || "Bank Transfer"
                                }));
                            }}
                        >
                            {paymentMethodsList.map((pm) => (
                                <option key={pm.payment_method_id} value={pm.payment_method_id}>
                                    {pm.payment_method_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Status */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Payment Status</label>
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
                            {statusesList.length > 0 ? (
                                statusesList.map((s) => (
                                    <option key={s.status_id} value={s.status_id}>
                                        {s.status_name}
                                    </option>
                                ))
                            ) : (
                                <option value="1">ACTIVE</option>
                            )}
                        </select>
                    </div>

                    {/* Reference Note */}
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
        </BaseDrawerShell>
    );
}
