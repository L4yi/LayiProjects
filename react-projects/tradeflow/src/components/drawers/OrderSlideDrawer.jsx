import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";

// Slide drawer specifically for managing or updating an order.
export default function OrderSlideDrawer({
    isOpen,
    onClose,
    title = "Order Details",
    subtitle = "Please complete the form below with accurate order details.",
    initialData = {},
    isSaving = false,
    errorMessage = "",
    onSave
}) {
    const [formData, setFormData] = useState({});
    const [paymentMethodsList, setPaymentMethodsList] = useState([]);
    const [statusesList, setStatusesList] = useState([]);

    // Load payment methods and fulfillment statuses from backend setup endpoints
    useEffect(() => {
        const loadSetup = async () => {
            const [pmRes, sRes] = await Promise.all([
                setupService.fetchAllPaymentMethods(),
                setupService.fetchAllStatus()
            ]);
            if (pmRes.success && Array.isArray(pmRes.data)) setPaymentMethodsList(pmRes.data);
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
            icon="bi bi-receipt"
            entityType="Order"
            isSaving={isSaving}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
        >
            {/* Card 1: Order & Customer Information */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-receipt text-primary-icon"></i>
                    <span>Order & Customer</span>
                </div>
                <div className="card-form-grid">
                    {/* Order ID */}
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

                    {/* Customer Name */}
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

                    {/* Delivery Address */}
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

            {/* Card 2: Fulfillment & Payment */}
            <div className="drawer-form-card">
                <div className="card-header-bar">
                    <i className="bi bi-cart-check text-primary-icon"></i>
                    <span>Fulfillment & Payment</span>
                </div>
                <div className="card-form-grid">
                    {/* Items Summary */}
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

                    {/* Total Amount */}
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

                    {/* Payment Method */}
                    <div className="form-group-item">
                        <label className="drawer-label">Payment Method</label>
                        <select
                            className="drawer-input"
                            value={formData.paymentMethod || "Bank Transfer"}
                            onChange={(e) => handleChange("paymentMethod", e.target.value)}
                        >
                            {paymentMethodsList.map((pm) => (
                                <option key={pm.payment_method_id} value={pm.payment_method_name}>
                                    {pm.payment_method_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Order Status */}
                    <div className="form-group-item full-width">
                        <label className="drawer-label">Order Status</label>
                        <select
                            className="drawer-input"
                            value={String(formData.status || "Processing")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = statusesList.find((s) => s.status_name.toUpperCase() === val.toUpperCase());
                                setFormData((prev) => ({
                                    ...prev,
                                    status: val,
                                    statusId: matched?.status_id || ""
                                }));
                            }}
                        >
                            {statusesList.filter((s) => ["PROCESSING", "SUCCESSFUL", "PAID", "FAILED"].includes(s.status_name.toUpperCase())).map((s) => (
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
