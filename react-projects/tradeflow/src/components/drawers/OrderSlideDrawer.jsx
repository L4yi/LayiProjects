import React, { useState, useEffect } from "react";
import BaseDrawerShell from "./BaseDrawerShell";
import setupService from "../../services/setupService";
import customerService from "../../services/customerService";
import productService from "../../services/productService";

// Slide drawer specifically for managing or creating an order.
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
    const [statusesList, setStatusesList] = useState(() => setupService.getOrderStatuses(setupService.getCachedStatuses()));
    const [customersList, setCustomersList] = useState([]);
    const [productsList, setProductsList] = useState([]);

    // Load setup data, customers, and products from backend
    useEffect(() => {
        setupService.fetchAllStatus().then((sRes) => {
            if (sRes.success && Array.isArray(sRes.data)) {
                setStatusesList(setupService.getOrderStatuses(sRes.data));
            }
        });
        customerService.fetchAllCustomers().then((cRes) => {
            if (cRes.success && Array.isArray(cRes.data)) {
                setCustomersList(cRes.data);
            }
        });
        productService.fetchAllProducts().then((pRes) => {
            if (pRes.success && Array.isArray(pRes.data)) {
                setProductsList(pRes.data);
            }
        });
    }, []);

    useEffect(() => {
        if (initialData) {
            const statusId = initialData.statusId ? String(initialData.statusId) : setupService.getStatusId(initialData.status, "4");
            setFormData({
                ...initialData,
                statusId: statusId || "4"
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCustomerSelect = (customerId) => {
        const found = customersList.find((c) => String(c.id || c.customerId) === String(customerId));
        setFormData((prev) => ({
            ...prev,
            customerId,
            customer_id: customerId,
            customerName: found?.name || found?.fullName || prev.customerName,
            name: found?.name || found?.fullName || prev.name
        }));
    };

    const handleProductSelect = (productId) => {
        const found = productsList.find((p) => String(p.id || p.productId || p.product_id) === String(productId));
        const price = found?.price || found?.productPrice || found?.product_price || 0;
        setFormData((prev) => ({
            ...prev,
            productId,
            product_id: productId,
            productName: found?.name || found?.productName || found?.product_name || prev.productName,
            price,
            amount: price
        }));
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
            <div className="drawer-flat-form">
                {/* Customer Selection */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Customer</label>
                    <select
                        className="drawer-input"
                        value={String(formData.customerId || formData.customer_id || "")}
                        onChange={(e) => handleCustomerSelect(e.target.value)}
                    >
                        <option value="">Select Customer</option>
                        {customersList.map((cust) => (
                            <option key={cust.id || cust.customerId} value={cust.id || cust.customerId}>
                                {cust.name || cust.fullName || `${cust.firstName || ""} ${cust.lastName || ""}`.trim() || cust.email} (ID: {cust.id || cust.customerId})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Selection */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Product</label>
                    <select
                        className="drawer-input"
                        value={String(formData.productId || formData.product_id || "")}
                        onChange={(e) => handleProductSelect(e.target.value)}
                    >
                        <option value="">Select Product</option>
                        {productsList.map((prod) => (
                            <option key={prod.id || prod.productId || prod.product_id} value={prod.id || prod.productId || prod.product_id}>
                                {prod.name || prod.productName || prod.product_name} - ₦{Number(prod.price || prod.productPrice || 0).toLocaleString()} (ID: {prod.id || prod.productId || prod.product_id})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount / Price Display */}
                <div className="drawer-form-row">
                    <div className="drawer-form-group">
                        <label className="drawer-label">Order Amount (₦)</label>
                        <input
                            type="number"
                            className="drawer-input"
                            placeholder="Auto-calculated from product"
                            value={formData.price || formData.amount || ""}
                            onChange={(e) => {
                                const val = Number(e.target.value) || 0;
                                handleChange("price", val);
                                handleChange("amount", val);
                            }}
                        />
                    </div>

                    {/* Order Status */}
                    <div className="drawer-form-group">
                        <label className="drawer-label">Order Status</label>
                        <select
                            className="drawer-input"
                            value={String(formData.statusId || (statusesList.find((s) => s.status_name === formData.status)?.status_id) || "4")}
                            onChange={(e) => {
                                const val = e.target.value;
                                const matched = statusesList.find((s) => String(s.status_id) === String(val) || s.status_name.toUpperCase() === val.toUpperCase());
                                setFormData((prev) => ({
                                    ...prev,
                                    status: matched?.status_name || val,
                                    statusId: matched?.status_id || val
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

                {/* Delivery Notes / Address */}
                <div className="drawer-form-group">
                    <label className="drawer-label">Delivery Address / Notes</label>
                    <input
                        type="text"
                        className="drawer-input"
                        placeholder="e.g. Panseke, Abeokuta"
                        value={formData.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                </div>
            </div>
        </BaseDrawerShell>
    );
}
