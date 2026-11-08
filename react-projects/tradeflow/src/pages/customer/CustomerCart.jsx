import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import { getCartItems, updateCartQuantity, removeCartItem, addToCart, getCartSubtotal } from "../../utils/cart";
import { getWishlistItems, removeFromWishlist } from "../../utils/wishlist";

export default function CustomerCart() {
    const [cartItems, setCartItems] = useState(getCartItems());
    const [wishlistItems, setWishlistItems] = useState(getWishlistItems());
    const [checkoutComplete, setCheckoutComplete] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);

    // Fetch live products directly from backend
    useEffect(() => {
        productService.fetchAllProducts().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setSuggestedProducts(res.data.map(p => ({
                    id: String(p.product_id || p.productId || p.id),
                    name: p.product_name || p.name || 'Product',
                    price: Number(p.product_price || p.price || 0),
                    oldPrice: Number(p.product_price || p.price || 0) * 1.15,
                    image: p.image || null
                })));
            }
        });
    }, []);

    useEffect(() => {
        const handleCartUpdate = (e) => {
            setCartItems(e.detail || getCartItems());
        };
        window.addEventListener("tradeflow_cart_update", handleCartUpdate);
        return () => window.removeEventListener("tradeflow_cart_update", handleCartUpdate);
    }, []);

    useEffect(() => {
        const handleWishlistUpdate = (e) => {
            setWishlistItems(e.detail || getWishlistItems());
        };
        window.addEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
        return () => window.removeEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
    }, []);

    const updateQuantity = (id, delta) => {
        updateCartQuantity(id, delta);
    };

    const removeItem = (id) => {
        removeCartItem(id);
    };

    const addWishlistItemToCart = (wItem) => {
        addToCart({
            id: wItem.id,
            name: wItem.name,
            categoryId: wItem.categoryId || "catalog",
            categoryName: wItem.categoryName || "Catalog",
            variation: "Standard Retail Edition",
            price: wItem.price,
            oldPrice: wItem.oldPrice,
            discountPercent: wItem.discountPercent,
            image: wItem.image,
            express: true
        }, 1);
        removeFromWishlist(wItem.id);
    };

    const subtotal = getCartSubtotal();
    const totalCount = cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

    // Group items by category to identify categories on checkout
    const categoriesInCart = Array.from(new Set(cartItems.map(i => i.categoryName || "General Store")));

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
                    <p>Thank you for shopping with TradeFlow. Your order for <strong>{totalCount} item{totalCount > 1 ? "s" : ""}</strong> is being processed for delivery to Abeokuta.</p>
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
                            <div className="cart-box-header">
                                <h2 className="cart-section-title">
                                    Cart ({totalCount})
                                </h2>
                                {categoriesInCart.length > 0 && (
                                    <div className="cart-header-categories-pills">
                                        <span className="cat-pill-label">Categories:</span>
                                        {categoriesInCart.map((cat, idx) => (
                                            <span key={idx} className="cart-prod-category-tag">
                                                <i className="bi bi-tag-fill"></i> {cat}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="cart-empty-state">
                                    <div className="empty-cart-icon">
                                        <i className="bi bi-bag-x"></i>
                                    </div>
                                    <h3 className="empty-cart-title">Your cart is empty!</h3>
                                    <p className="empty-cart-desc">
                                        Explore our verified catalog to discover high-quality products, great deals, and verified inventory.
                                    </p>
                                    <Link to="/customer/categories" className="btn-start-shopping">
                                        <i className="bi bi-bag-plus"></i>
                                        <span>Start Shopping</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="cart-items-list">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="cart-item-row">
                                    
                                            <div className="cart-item-img-wrap">
                                                <Link to={`/customer/product/${item.id}`}>
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="cart-prod-img" />
                                                    ) : (
                                                        <i className="bi bi-box-seam cart-fallback-icon"></i>
                                                    )}
                                                </Link>
                                            </div>

                                            {/* Details & Controls */}
                                            <div className="cart-item-info">
                                                <div className="cart-item-top-details">
                                                    <div className="cart-prod-title-col">
                                                        {/* Category identifier tag with clean spacing */}
                                                        <div className="cart-category-space-row">
                                                            <span className="cart-prod-category-tag">
                                                                <i className="bi bi-folder2-open"></i> {item.categoryName || "Product"}
                                                            </span>
                                                        </div>

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
                                                        {item.quantity > 1 && (
                                                            <span className="cart-unit-sub-note">
                                                                ₦ {item.price.toLocaleString()} × {item.quantity}
                                                            </span>
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
                                <h3 className="wishlist-title">
                                    <i className="bi bi-heart-fill me-2 text-emerald"></i>
                                    Wishlist ({wishlistItems.length})
                                </h3>
                                <Link to="/customer/categories" className="link-see-all">
                                    See All &gt;
                                </Link>
                            </div>

                            {wishlistItems.length > 0 ? (
                                <div className="wishlist-grid">
                                    {wishlistItems.map((wItem) => (
                                        <div key={wItem.id} className="wishlist-product-card">
                                            {wItem.discountPercent > 0 && (
                                                <span className="wishlist-discount-badge">-{wItem.discountPercent}%</span>
                                            )}
                                            <div className="wishlist-img-box">
                                                {wItem.image ? (
                                                    <img src={wItem.image} alt={wItem.name} />
                                                ) : (
                                                    <i className="bi bi-box-seam wishlist-fallback-icon"></i>
                                                )}
                                            </div>
                                            <h5 className="wishlist-item-title">{wItem.name}</h5>
                                            <div className="wishlist-price-row">
                                                <span className="w-price-main">₦ {Number(wItem.price || 0).toLocaleString()}</span>
                                                {wItem.oldPrice && (
                                                    <span className="w-price-old">₦ {Number(wItem.oldPrice || 0).toLocaleString()}</span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-wishlist-add-cart"
                                                onClick={() => addWishlistItemToCart(wItem)}
                                            >
                                                <i className="bi bi-cart-plus me-1"></i> Add to cart
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="wishlist-empty-inline">
                                    <div className="wishlist-empty-icon-wrap">
                                        <i className="bi bi-heart"></i>
                                    </div>
                                    <div className="wishlist-empty-text-wrap">
                                        <h4 className="wishlist-empty-heading">Your wishlist is empty</h4>
                                        <p className="wishlist-empty-sub">
                                            Save your favorite verified products from the catalog to easily revisit and purchase them anytime.
                                        </p>
                                    </div>
                                    <Link to="/customer/categories" className="btn-wishlist-browse">
                                        <i className="bi bi-grid"></i>
                                        <span>Browse Catalog</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Suggested Products Section (from live backend) */}
                        {suggestedProducts.length > 0 && (
                            <div className="cart-recently-viewed-box">
                                <div className="wishlist-header">
                                    <h3 className="wishlist-title">
                                        <i className="bi bi-stars me-2 text-emerald"></i>
                                        Recommended from Catalog
                                    </h3>
                                    <Link to="/customer/categories" className="link-see-all">See All &gt;</Link>
                                </div>
                                <div className="recently-viewed-grid">
                                    {suggestedProducts.slice(0, 4).map((p) => (
                                        <Link key={p.id} to={`/customer/product/${p.id}`} className="recent-prod-mini-card">
                                            {p.image ? (
                                                <img src={p.image} alt={p.name} />
                                            ) : (
                                                <div className="recent-mini-fallback">
                                                    <i className="bi bi-box-seam"></i>
                                                </div>
                                            )}
                                            <span className="recent-mini-title">{p.name}</span>
                                            <span className="recent-mini-price">₦ {Number(p.price || 0).toLocaleString()}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Cart Summary Box */}
                    <div className="cart-sidebar-column">
                        <div className="cart-summary-sticky-card">
                            <h3 className="summary-title">CART SUMMARY</h3>

                            {/* Category Breakdown list on checkout */}
                            {categoriesInCart.length > 0 && (
                                <div className="checkout-categories-summary-block">
                                    <span className="chk-cat-header-label">Categories in Order:</span>
                                    <div className="chk-cat-tags-list">
                                        {categoriesInCart.map((cat, idx) => (
                                            <span key={idx} className="chk-category-pill">
                                                <i className="bi bi-check-circle-fill"></i> {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="summary-row subtotal-row">
                                <span className="summary-label">Subtotal ({totalCount} item{totalCount > 1 ? "s" : ""})</span>
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
