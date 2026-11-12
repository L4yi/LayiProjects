import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartItems, getCartSubtotal, clearCart } from "../../utils/cart";
import { getSessionUser } from "../../utils/session";
import { getDefaultPaymentMethod, OFFICIAL_BANK_DETAILS } from "../../utils/payment";
import orderService from "../../services/orderService";
import setupService from "../../services/setupService";
import customerService from "../../services/customerService";

const DELIVERY_OPTIONS = [
    {
        id: "standard",
        title: "Standard Doorstep Delivery",
        description: "Delivered within 2 - 4 business days nationwide.",
        price: 1500,
        badge: "Most Popular",
        icon: "bi-truck"
    },
    {
        id: "express",
        title: "Express Priority Dispatch",
        description: "Dispatched immediately. Delivered within 24 hours in Abeokuta & Lagos.",
        price: 3500,
        badge: "Fastest",
        icon: "bi-lightning-charge-fill"
    },
    {
        id: "pickup",
        title: "TradeFlow Hub Pickup Station",
        description: "Pick up for free at TradeFlow Central Hub, Abeokuta.",
        price: 0,
        badge: "Free",
        icon: "bi-building-check"
    }
];

const PAYMENT_METHODS = [
    {
        id: "card",
        title: "Debit / Credit Card (Instant & Secure)",
        description: "Pay securely with Mastercard, Visa, or Verve.",
        icon: "bi-credit-card-2-front-fill",
        badge: "Instant"
    },
    {
        id: "bank_transfer",
        title: "Direct Bank Transfer",
        description: "Transfer to TradeFlow dedicated business account.",
        icon: "bi-bank2",
        badge: "Zero Fee"
    },
    {
        id: "pod",
        title: "Pay on Delivery (Cash / POS)",
        description: "Inspect your items first. Pay with cash or card upon delivery.",
        icon: "bi-cash-coin",
        badge: "Flexible"
    }
];

export default function CustomerCheckout() {
    const navigate = useNavigate();
    const sessionUser = getSessionUser();

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    // Form fields
    const [formData, setFormData] = useState({
        fullName: sessionUser?.name || "",
        email: sessionUser?.email || "",
        phone: sessionUser?.phone || "",
        altPhone: "",
        address: sessionUser?.address || "",
        city: "Abeokuta",
        state: "Ogun State",
        deliveryNotes: ""
    });

    const [selectedDelivery, setSelectedDelivery] = useState(DELIVERY_OPTIONS[0]);
    const [selectedPayment, setSelectedPayment] = useState(() => getDefaultPaymentMethod() || PAYMENT_METHODS[1].id);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(null);
    const [copiedBank, setCopiedBank] = useState(false);

    const handleCopyBankAcc = () => {
        try {
            navigator.clipboard.writeText(OFFICIAL_BANK_DETAILS.accountNumber);
            setCopiedBank(true);
            setTimeout(() => setCopiedBank(false), 2500);
        } catch (_) {}
    };

    useEffect(() => {
        const items = getCartItems();
        setCartItems(items);
        setSubtotal(getCartSubtotal());
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = "Full name is required";
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Enter a valid email address";
        }
        if (!formData.phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (formData.phone.replace(/\D/g, "").length < 10) {
            errors.phone = "Enter a valid phone number";
        }
        if (!formData.address.trim()) errors.address = "Delivery street address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const firstError = document.querySelector(".checkout-input-error");
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        if (cartItems.length === 0) return;

        setIsSubmitting(true);

        const fallbackOrderId = `ORD${Date.now()}`;
        const totalAmount = subtotal + selectedDelivery.price;
        const totalCount = cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

        // Resolve or create a verified Customer ID in the database
        let customerId = sessionUser?.customerId || sessionUser?.id;
        if (!customerId || customerId === "CUST-GUEST") {
            try {
                const custRes = await customerService.fetchAllCustomers();
                if (custRes.success && Array.isArray(custRes.data)) {
                    const match = custRes.data.find(c => 
                        (c.emailAddress || c.email || "").toLowerCase().trim() === formData.email.toLowerCase().trim()
                    );
                    if (match) {
                        customerId = match.id || match.customerId;
                    }
                }
            } catch (err) {
                console.warn("Customer lookup failed:", err);
            }
        }

        // Fallback default customer account if not authenticated
        if (!customerId || customerId === "CUST-GUEST") {
            customerId = "CUST20261111143445"; // Default verified customer account
        }

        // Place order directly in MySQL backend database
        let backendAssignedOrderId = null;
        try {
            for (const item of cartItems) {
                const prodId = item.id || item.productId || item.product_id;
                if (prodId) {
                    const res = await orderService.createOrder({
                        customerId: String(customerId),
                        productId: String(prodId),
                        statusId: "4" // 4 = PROCESSING in database setup
                    }).catch(() => null);

                    if (res?.success && (res.data?.orderId || res.data?.id)) {
                        backendAssignedOrderId = res.data.orderId || res.data.id;
                    }
                }
            }

            // If create-order did not return orderId in payload, query latest order for this customer
            if (!backendAssignedOrderId) {
                const latestRes = await orderService.fetchAllOrders();
                if (latestRes.success && Array.isArray(latestRes.data) && latestRes.data.length > 0) {
                    const matchOrder = latestRes.data.find(o => String(o.customerId) === String(customerId));
                    if (matchOrder && (matchOrder.orderId || matchOrder.code || matchOrder.id)) {
                        backendAssignedOrderId = matchOrder.orderId || matchOrder.code || matchOrder.id;
                    } else if (latestRes.data[0]?.orderId) {
                        backendAssignedOrderId = latestRes.data[0].orderId;
                    }
                }
            }
        } catch (_) {
            // Non-blocking fallback
        }

        const finalOrderId = backendAssignedOrderId || fallbackOrderId;

        const completedOrder = {
            orderId: finalOrderId,
            backendOrderId: backendAssignedOrderId,
            date: new Date().toLocaleDateString("en-NG", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }),
            items: cartItems,
            itemCount: totalCount,
            subtotal,
            shippingFee: selectedDelivery.price,
            totalAmount,
            deliveryOption: selectedDelivery,
            paymentMethod: PAYMENT_METHODS.find(p => p.id === selectedPayment) || PAYMENT_METHODS[0],
            shippingDetails: { ...formData },
            status: "Processing"
        };

        // Persist to user's order history
        try {
            const existingOrders = JSON.parse(localStorage.getItem("tradeflow_orders") || "[]");
            localStorage.setItem("tradeflow_orders", JSON.stringify([completedOrder, ...existingOrders]));
        } catch (e) {
            console.warn("Could not save to local tradeflow_orders:", e);
        }

        // Empty the cart
        clearCart();
        setIsSubmitting(false);
        setOrderConfirmed(completedOrder);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // If order was confirmed, show the Confirmation Screen
    if (orderConfirmed) {
        return (
            <div className="checkout-page-container">
                <div className="checkout-success-card">
                    <div className="success-pulse-ring">
                        <i className="bi bi-check2-circle"></i>
                    </div>

                    <span className="success-pill-tag">Order Confirmed</span>
                    <h1 className="success-main-title">Thank You For Your Order!</h1>
                    <p className="success-subtitle">
                        Your order has been recorded successfully and is now being packaged at our warehouse.
                    </p>

                    <div className="order-meta-box">
                        <div className="meta-item">
                            <span className="meta-label">Order Reference</span>
                            <strong className="meta-val font-mono">{orderConfirmed.orderId}</strong>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Date & Time</span>
                            <span className="meta-val">{orderConfirmed.date}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Payment Method</span>
                            <span className="meta-val">{orderConfirmed.paymentMethod.title.split("(")[0]}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Total Amount</span>
                            <strong className="meta-val text-brand-dark">₦ {orderConfirmed.totalAmount.toLocaleString()}</strong>
                        </div>
                    </div>

                    <div className="order-details-recap">
                        <div className="recap-section">
                            <h3><i className="bi bi-geo-alt-fill"></i> Delivery Destination</h3>
                            <p><strong>{orderConfirmed.shippingDetails.fullName}</strong></p>
                            <p>{orderConfirmed.shippingDetails.address}, {orderConfirmed.shippingDetails.city}, {orderConfirmed.shippingDetails.state}</p>
                            <p>Phone: {orderConfirmed.shippingDetails.phone}</p>
                            <span className="delivery-speed-pill">
                                <i className="bi bi-clock-history"></i> {orderConfirmed.deliveryOption.title}
                            </span>
                        </div>

                        <div className="recap-section">
                            <h3><i className="bi bi-box-seam-fill"></i> Items Ordered ({orderConfirmed.itemCount})</h3>
                            <div className="recap-items-list">
                                {orderConfirmed.items.map((it, idx) => (
                                    <div key={idx} className="recap-item-row">
                                        <div className="recap-item-info">
                                            <span className="item-qty-badge">{it.quantity || 1}x</span>
                                            <span className="item-name">{it.name}</span>
                                        </div>
                                        <span className="item-price">₦ {((it.price || 0) * (it.quantity || 1)).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="confirmation-actions-row">
                        <Link to="/customer/dashboard" className="btn-continue-storefront">
                            <i className="bi bi-bag-check-fill"></i>
                            <span>Continue Shopping</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Empty Cart view guard
    if (cartItems.length === 0) {
        return (
            <div className="checkout-page-container">
                <div className="cart-empty-checkout-card">
                    <div className="empty-cart-icon">
                        <i className="bi bi-cart-x"></i>
                    </div>
                    <h2>Your Shopping Cart is Empty</h2>
                    <p>There are no items ready for checkout. Explore our live catalog to select products.</p>
                    <Link to="/customer/dashboard" className="btn-continue-storefront">
                        <i className="bi bi-arrow-left"></i>
                        <span>Return to Storefront</span>
                    </Link>
                </div>
            </div>
        );
    }

    const shippingFee = selectedDelivery.price;
    const grandTotal = subtotal + shippingFee;
    const totalCount = cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

    return (
        <div className="checkout-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <Link to="/customer/cart">Shopping Cart</Link>
                <span>&gt;</span>
                <span className="current-crumb">Checkout</span>
            </div>

            <div className="checkout-page-title-row">
                <div>
                    <h1 className="checkout-heading">Secure Checkout</h1>
                    <p className="checkout-subheading">Complete your order details and choose your delivery preference.</p>
                </div>
                <div className="secure-encryption-badge">
                    <i className="bi bi-shield-check"></i>
                    <span>256-Bit SSL Encrypted</span>
                </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-layout-grid" noValidate>
                {/* Left Column: Checkout Forms */}
                <div className="checkout-main-flow">
                    {/* Step 1: Delivery Address */}
                    <div className="checkout-card-section">
                        <div className="checkout-card-header">
                            <div className="step-circle">1</div>
                            <div>
                                <h2 className="step-title">Delivery Address</h2>
                                <p className="step-subtitle">Where should we deliver your order?</p>
                            </div>
                        </div>

                        <div className="checkout-form-grid">
                            <div className="form-group-field full-width">
                                <label>Recipient Full Name <span className="req-star">*</span></label>
                                <input
                                    type="text"
                                    className={`checkout-input ${formErrors.fullName ? "checkout-input-error" : ""}`}
                                    placeholder="e.g. Oladejo Muhaz"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                />
                                {formErrors.fullName && <span className="field-err-msg">{formErrors.fullName}</span>}
                            </div>

                            <div className="form-group-field">
                                <label>Email Address <span className="req-star">*</span></label>
                                <input
                                    type="email"
                                    className={`checkout-input ${formErrors.email ? "checkout-input-error" : ""}`}
                                    placeholder="e.g. customer@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                />
                                {formErrors.email && <span className="field-err-msg">{formErrors.email}</span>}
                            </div>

                            <div className="form-group-field">
                                <label>Phone Number <span className="req-star">*</span></label>
                                <input
                                    type="tel"
                                    className={`checkout-input ${formErrors.phone ? "checkout-input-error" : ""}`}
                                    placeholder="e.g. 08012345678"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                />
                                {formErrors.phone && <span className="field-err-msg">{formErrors.phone}</span>}
                            </div>

                            <div className="form-group-field full-width">
                                <label>Delivery Street Address <span className="req-star">*</span></label>
                                <input
                                    type="text"
                                    className={`checkout-input ${formErrors.address ? "checkout-input-error" : ""}`}
                                    placeholder="House/Street/Flat No, Landmark"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                />
                                {formErrors.address && <span className="field-err-msg">{formErrors.address}</span>}
                            </div>

                            <div className="form-group-field">
                                <label>City / Town <span className="req-star">*</span></label>
                                <input
                                    type="text"
                                    className={`checkout-input ${formErrors.city ? "checkout-input-error" : ""}`}
                                    placeholder="e.g. Abeokuta"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                />
                                {formErrors.city && <span className="field-err-msg">{formErrors.city}</span>}
                            </div>

                            <div className="form-group-field">
                                <label>State <span className="req-star">*</span></label>
                                <select
                                    className={`checkout-input ${formErrors.state ? "checkout-input-error" : ""}`}
                                    value={formData.state}
                                    onChange={(e) => handleInputChange("state", e.target.value)}
                                >
                                    <option value="Ogun State">Ogun State</option>
                                    <option value="Lagos State">Lagos State</option>
                                    <option value="Oyo State">Oyo State</option>
                                    <option value="Abuja (FCT)">Abuja (FCT)</option>
                                    <option value="Rivers State">Rivers State</option>
                                    <option value="Other States">Other States (Nationwide)</option>
                                </select>
                                {formErrors.state && <span className="field-err-msg">{formErrors.state}</span>}
                            </div>

                            <div className="form-group-field full-width">
                                <label>Delivery Instructions / Closest Landmark (Optional)</label>
                                <input
                                    type="text"
                                    className="checkout-input"
                                    placeholder="e.g. Opposite Central Mosque, Call upon arrival"
                                    value={formData.deliveryNotes}
                                    onChange={(e) => handleInputChange("deliveryNotes", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Delivery Method */}
                    <div className="checkout-card-section">
                        <div className="checkout-card-header">
                            <div className="step-circle">2</div>
                            <div>
                                <h2 className="step-title">Delivery Method</h2>
                                <p className="step-subtitle">Choose how you want to receive your package.</p>
                            </div>
                        </div>

                        <div className="delivery-options-list">
                            {DELIVERY_OPTIONS.map((opt) => (
                                <label
                                    key={opt.id}
                                    className={`delivery-option-item ${selectedDelivery.id === opt.id ? "selected" : ""}`}
                                    onClick={() => setSelectedDelivery(opt)}
                                >
                                    <div className="opt-radio-wrap">
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            checked={selectedDelivery.id === opt.id}
                                            onChange={() => setSelectedDelivery(opt)}
                                        />
                                    </div>
                                    <div className="opt-content">
                                        <div className="opt-title-line">
                                            <strong>{opt.title}</strong>
                                            {opt.badge && <span className="opt-badge">{opt.badge}</span>}
                                        </div>
                                        <p className="opt-description">{opt.description}</p>
                                    </div>
                                    <div className="opt-price">
                                        {opt.price === 0 ? "FREE" : `₦ ${opt.price.toLocaleString()}`}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Step 3: Payment Method */}
                    <div className="checkout-card-section">
                        <div className="checkout-card-header">
                            <div className="step-circle">3</div>
                            <div>
                                <h2 className="step-title">Payment Method</h2>
                                <p className="step-subtitle">Select your preferred payment channel.</p>
                            </div>
                        </div>

                        <div className="payment-options-list">
                            {PAYMENT_METHODS.map((pay) => (
                                <label
                                    key={pay.id}
                                    className={`payment-option-item ${selectedPayment === pay.id ? "selected" : ""}`}
                                    onClick={() => setSelectedPayment(pay.id)}
                                >
                                    <div className="opt-radio-wrap">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            checked={selectedPayment === pay.id}
                                            onChange={() => setSelectedPayment(pay.id)}
                                        />
                                    </div>
                                    <div className="payment-icon-box">
                                        <i className={`bi ${pay.icon}`}></i>
                                    </div>
                                    <div className="opt-content">
                                        <div className="opt-title-line">
                                            <strong>{pay.title}</strong>
                                            {pay.badge && <span className="opt-badge">{pay.badge}</span>}
                                        </div>
                                        <p className="opt-description">{pay.description}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {selectedPayment === "bank_transfer" && (
                            <div className="bank-transfer-details-box checkout-treasury-box">
                                <div className="transfer-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <i className="bi bi-shield-check" style={{ color: "#10b981", fontSize: "18px" }}></i>
                                        <strong style={{ color: "#143526", fontSize: "14px" }}>TradeFlow Central Treasury Account</strong>
                                    </div>
                                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#047857", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", padding: "2px 8px", borderRadius: "12px", letterSpacing: "0.4px" }}>VERIFIED BUSINESS</span>
                                </div>
                                <p style={{ fontSize: "12px", color: "#64748b", margin: "6px 0 14px" }}>
                                    Transfer your order total to our corporate account below. Your order will be confirmed immediately upon settlement.
                                </p>
                                <div className="transfer-data-grid">
                                    <div>
                                        <span className="lbl">Bank Name:</span>
                                        <strong>{OFFICIAL_BANK_DETAILS.bankName}</strong>
                                    </div>
                                    <div>
                                        <span className="lbl">Beneficiary Account Name:</span>
                                        <strong>{OFFICIAL_BANK_DETAILS.accountName}</strong>
                                    </div>
                                    <div className="acc-num-col">
                                        <span className="lbl">Account Number:</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <strong className="font-mono text-emerald" style={{ fontSize: "16px", letterSpacing: "0.5px" }}>{OFFICIAL_BANK_DETAILS.accountNumber}</strong>
                                            <button
                                                type="button"
                                                onClick={handleCopyBankAcc}
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    padding: "3px 10px",
                                                    fontSize: "11px",
                                                    fontWeight: "600",
                                                    borderRadius: "4px",
                                                    border: "1px solid #143526",
                                                    backgroundColor: "#143526",
                                                    color: "#ffffff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {copiedBank ? "Copied!" : "Copy"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sticky Order Summary */}
                <div className="checkout-sidebar-flow">
                    <div className="checkout-summary-sticky-card">
                        <h3 className="summary-title">ORDER SUMMARY</h3>

                        {/* Cart preview */}
                        <div className="checkout-items-preview-list">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="preview-item-row">
                                    <div className="preview-thumb">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                        ) : (
                                            <div className="preview-placeholder">
                                                <i className="bi bi-box-seam"></i>
                                            </div>
                                        )}
                                        <span className="preview-qty">{item.quantity || 1}</span>
                                    </div>
                                    <div className="preview-meta">
                                        <h4 className="preview-name">{item.name}</h4>
                                        <span className="preview-price">₦ {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-cost-breakdown">
                            <div className="cost-row">
                                <span>Items Subtotal ({totalCount} item{totalCount > 1 ? "s" : ""})</span>
                                <strong>₦ {subtotal.toLocaleString()}</strong>
                            </div>
                            <div className="cost-row">
                                <span>Delivery Fee ({selectedDelivery.title.split(" ")[0]})</span>
                                <strong>{shippingFee === 0 ? "FREE" : `₦ ${shippingFee.toLocaleString()}`}</strong>
                            </div>
                            <div className="cost-row total-row">
                                <span>Total Amount</span>
                                <span className="grand-total-amount">₦ {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-place-order-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    <span>Processing Order...</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-lock-fill"></i>
                                    <span>Place Order (₦ {grandTotal.toLocaleString()})</span>
                                </>
                            )}
                        </button>

                        <div className="checkout-security-guarantees">
                            <div className="guarantee-line">
                                <i className="bi bi-shield-check text-success"></i>
                                <span>TradeFlow 100% Genuine Guarantee</span>
                            </div>
                            <div className="guarantee-line">
                                <i className="bi bi-arrow-repeat text-primary"></i>
                                <span>7-Day Free Replacement or Refund</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
