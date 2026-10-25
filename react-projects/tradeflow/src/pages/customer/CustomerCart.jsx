import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartItems, updateCartQuantity, removeCartItem, clearCart, getCartSubtotal } from "../../utils/cart";
import { getSessionUser } from "../../utils/session";
import { StatusModal, Button } from "../../components/common";
import customerService from "../../services/customerService";

export default function CustomerCart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(getCartItems());
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderMessage, setOrderMessage] = useState("");
    const [checkoutError, setCheckoutError] = useState("");

    useEffect(() => {
        const handleCartUpdate = (e) => {
            setCartItems(e.detail || getCartItems());
        };
        window.addEventListener("tradeflow_cart_update", handleCartUpdate);
        return () => window.removeEventListener("tradeflow_cart_update", handleCartUpdate);
    }, []);

    const subtotal = getCartSubtotal();
    const totalCount = cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setCheckoutError("");

        const user = getSessionUser();
        const customerId = user.customerId || user.id;

        if (!customerId || user.role !== "Customer") {
            setCheckoutError("Please sign in with a Customer account to complete your checkout.");
            setTimeout(() => {
                navigate("/customer/signin");
            }, 1500);
            return;
        }

        setSubmitting(true);
        try {
            for (const item of cartItems) {
                await customerService.createOrder({
                    customerId: customerId,
                    productId: item.id,
                    statusId: "1"
                });
            }

            clearCart();
            setOrderMessage(`Your order for ${totalCount} item${totalCount > 1 ? "s" : ""} has been submitted successfully.`);
            setShowSuccessModal(true);
        } catch (error) {
            setCheckoutError("Unable to submit order. Please check your network and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="customer-cart-page-container">
            <div className="cart-breadcrumb-nav">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Shopping Cart</span>
            </div>

            {checkoutError && (
                <div
                    style={{
                        padding: "12px 16px",
                        background: "#fff1f2",
                        border: "1px solid #fecdd3",
                        borderRadius: "8px",
                        color: "#be123c",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{checkoutError}</span>
                </div>
            )}

            <div className="cart-grid-layout">
                <div className="cart-main-column">
                    <div className="cart-items-card-box">
                        <div className="cart-box-header">
                            <h2 className="cart-section-title">
                                Cart ({totalCount})
                            </h2>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="cart-empty-state">
                                <div className="empty-cart-icon">
                                    <i className="bi bi-cart-x"></i>
                                </div>
                                <h3>Your cart is empty!</h3>
                                <p>Browse our verified categories and discover great deals.</p>
                                <Link to="/customer/categories" className="btn-start-shopping">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="cart-items-list">
                                {cartItems.map((item) => {
                                    const itemPrice = Number(item.price || 0);
                                    const qty = item.quantity || 1;
                                    const lineTotal = itemPrice * qty;

                                    return (
                                        <div key={item.id} className="cart-item-row">
                                            <div className="cart-item-media">
                                                <img
                                                    src={item.image || "/src/assets/icon.png"}
                                                    alt={item.name}
                                                    onError={(e) => { e.target.src = "/src/assets/icon.png"; }}
                                                />
                                            </div>

                                            <div className="cart-item-details">
                                                <h4 className="cart-item-title">{item.name}</h4>
                                                <p className="cart-item-meta">{item.categoryName || "Official Product"}</p>
                                                <div className="cart-item-price-mobile">
                                                    ₦ {itemPrice.toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="cart-item-price-col">
                                                <span className="cart-unit-price">₦ {lineTotal.toLocaleString()}</span>
                                                {qty > 1 && (
                                                    <span className="cart-qty-subtext">(₦ {itemPrice.toLocaleString()} each)</span>
                                                )}
                                            </div>

                                            <div className="cart-item-actions-col">
                                                <div className="cart-qty-stepper">
                                                    <button
                                                        type="button"
                                                        className="stepper-btn"
                                                        onClick={() => updateCartQuantity(item.id, -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="stepper-value">{qty}</span>
                                                    <button
                                                        type="button"
                                                        className="stepper-btn"
                                                        onClick={() => updateCartQuantity(item.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="btn-remove-item"
                                                    onClick={() => removeCartItem(item.id)}
                                                    title="Remove item"
                                                >
                                                    <i className="bi bi-trash3"></i>
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="cart-sidebar-column">
                    <div className="cart-summary-card">
                        <h3 className="summary-card-title">CART SUMMARY</h3>
                        <div className="summary-row">
                            <span className="summary-label">Subtotal</span>
                            <span className="summary-value">₦ {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Delivery Fee</span>
                            <span className="summary-value free-delivery">FREE</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total-row">
                            <span className="summary-label">Total</span>
                            <span className="summary-value total-figure">₦ {subtotal.toLocaleString()}</span>
                        </div>

                        <Button
                            type="button"
                            variant="primary"
                            size="md"
                            isLoading={submitting}
                            loadingText="Placing Order..."
                            disabled={cartItems.length === 0}
                            onClick={handleCheckout}
                            style={{ width: "100%", height: "48px", marginTop: "16px" }}
                        >
                            Checkout (₦ {subtotal.toLocaleString()})
                        </Button>
                    </div>
                </div>
            </div>

            <StatusModal
                isOpen={showSuccessModal}
                type="success"
                title="ORDER PLACED SUCCESSFULLY!"
                message={orderMessage}
                buttonText="Okay, Continue"
                onConfirm={() => {
                    setShowSuccessModal(false);
                    navigate("/customer/dashboard");
                }}
            />
        </div>
    );
}
