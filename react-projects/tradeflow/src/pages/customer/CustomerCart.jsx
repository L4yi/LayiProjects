import React, { useState } from "react";
import { Link } from "react-router-dom";
import { INITIAL_CART_ITEMS, WISHLIST_ITEMS, STORE_PRODUCTS } from "../../data/storeData";

export default function CustomerCart() {
    const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
    const [checkoutComplete, setCheckoutComplete] = useState(false);

    const updateQuantity = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const addWishlistItemToCart = (wItem) => {
        const existing = cartItems.find(item => item.id === wItem.id);
        if (existing) {
            updateQuantity(wItem.id, 1);
        } else {
            setCartItems(prev => [
                ...prev,
                {
                    id: wItem.id,
                    name: wItem.name,
                    variation: "Standard Retail Edition",
                    price: wItem.price,
                    oldPrice: wItem.oldPrice,
                    discountPercent: wItem.discountPercent,
                    quantity: 1,
                    inStock: true,
                    express: true,
                    image: wItem.image
                }
            ]);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="customer-cart-page-container">
            {/* Breadcrumbs */}
            <div className="cart-breadcrumb-nav">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Shopping Cart</span>
            </div>

            {checkoutComplete ? (
                <div className="cart-success-banner">
                    <div className="success-icon-box">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for shopping with TradeFlow. Your order is being processed for delivery to Abeokuta.</p>
                    <Link to="/customer/dashboard" className="btn-cart-continue">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-grid-layout">
                    {/* Left Column: Cart Items & Wishlist */}
                    <div className="cart-main-column">
                        {/* Cart Header & Items */}
                        <div className="cart-items-card-box">
                            <h2 className="cart-section-title">
                                Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                            </h2>

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
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="cart-item-row">
                                            {/* Product Image */}
                                            <div className="cart-item-img-wrap">
                                                <Link to={`/customer/product/${item.id}`}>
                                                    <img src={item.image} alt={item.name} className="cart-prod-img" />
                                                </Link>
                                            </div>

                                            {/* Details & Controls */}
                                            <div className="cart-item-info">
                                                <div className="cart-item-top-details">
                                                    <div className="cart-prod-title-col">
                                                        <h4 className="cart-prod-title">
                                                            <Link to={`/customer/product/${item.id}`}>{item.name}</Link>
                                                        </h4>
                                                        <span className="cart-prod-variation">{item.variation}</span>
                                                        <div className="cart-prod-badges">
                                                            <span className="instock-badge">In Stock</span>
                                                            {item.express && (
                                                                <span className="tradeflow-express-badge">
                                                                    <i className="bi bi-lightning-fill"></i> TRADEFLOW EXPRESS
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="cart-prod-pricing-col">
                                                        <span className="cart-price-current">
                                                            ₦ {(item.price * item.quantity).toLocaleString()}
                                                        </span>
                                                        {item.oldPrice && (
                                                            <div className="cart-old-price-row">
                                                                <span className="cart-price-old">
                                                                    ₦ {(item.oldPrice * item.quantity).toLocaleString()}
                                                                </span>
                                                                <span className="cart-discount-pill">
                                                                    -{item.discountPercent}%
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bottom Actions: Remove & Quantity Stepper */}
                                                <div className="cart-item-bottom-actions">
                                                    <button
                                                        type="button"
                                                        className="btn-cart-remove"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <i className="bi bi-trash3"></i> Remove
                                                    </button>

                                                    <div className="cart-qty-counter">
                                                        <button
                                                            type="button"
                                                            className="btn-qty-step"
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="qty-number">{item.quantity}</span>
                                                        <button
                                                            type="button"
                                                            className="btn-qty-step"
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Wishlist Section */}
                        <div className="cart-wishlist-card-box">
                            <div className="wishlist-header">
                                <h3 className="wishlist-title">Wishlist ({WISHLIST_ITEMS.length})</h3>
                                <Link to="/customer/categories" className="link-see-all">See All &gt;</Link>
                            </div>

                            <div className="wishlist-grid">
                                {WISHLIST_ITEMS.map((wItem) => (
                                    <div key={wItem.id} className="wishlist-product-card">
                                        <span className="wishlist-discount-badge">-{wItem.discountPercent}%</span>
                                        <div className="wishlist-img-box">
                                            <img src={wItem.image} alt={wItem.name} />
                                        </div>
                                        <h5 className="wishlist-item-title">{wItem.name}</h5>
                                        <div className="wishlist-price-row">
                                            <span className="w-price-main">₦ {wItem.price.toLocaleString()}</span>
                                            <span className="w-price-old">₦ {wItem.oldPrice.toLocaleString()}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-wishlist-add-cart"
                                            onClick={() => addWishlistItemToCart(wItem)}
                                        >
                                            Add to cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recently Viewed Section */}
                        <div className="cart-recently-viewed-box">
                            <div className="wishlist-header">
                                <h3 className="wishlist-title">Recently Viewed</h3>
                                <Link to="/customer/categories" className="link-see-all">See All &gt;</Link>
                            </div>
                            <div className="recently-viewed-grid">
                                {STORE_PRODUCTS.slice(0, 4).map((p) => (
                                    <Link key={p.id} to={`/customer/product/${p.id}`} className="recent-prod-mini-card">
                                        <img src={p.image} alt={p.name} />
                                        <span className="recent-mini-title">{p.name}</span>
                                        <span className="recent-mini-price">₦ {p.price.toLocaleString()}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Cart Summary Box */}
                    <div className="cart-sidebar-column">
                        <div className="cart-summary-sticky-card">
                            <h3 className="summary-title">CART SUMMARY</h3>

                            <div className="summary-row subtotal-row">
                                <span className="summary-label">Subtotal</span>
                                <span className="summary-amount">₦ {subtotal.toLocaleString()}</span>
                            </div>

                            <div className="summary-delivery-note">
                                <i className="bi bi-info-circle"></i>
                                <span>Delivery fees not included yet. Calculated at checkout.</span>
                            </div>

                            <button
                                type="button"
                                className="btn-cart-checkout"
                                disabled={cartItems.length === 0}
                                onClick={() => setCheckoutComplete(true)}
                            >
                                Checkout (₦ {subtotal.toLocaleString()})
                            </button>

                            {/* Trust badges */}
                            <div className="cart-security-badges">
                                <div className="sec-badge-item">
                                    <i className="bi bi-shield-lock-fill text-emerald"></i>
                                    <div>
                                        <strong>Secure Payments</strong>
                                        <p>Encrypted SSL checkout with verified payment gateways.</p>
                                    </div>
                                </div>
                                <div className="sec-badge-item">
                                    <i className="bi bi-box-seam text-emerald"></i>
                                    <div>
                                        <strong>Doorstep Delivery</strong>
                                        <p>Fast dispatch across Abeokuta and nationwide.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
