import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { STORE_PRODUCTS } from "../../data/storeData";

export default function CustomerProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedNotice, setAddedNotice] = useState(false);

    const product = STORE_PRODUCTS.find(p => p.id === productId) || STORE_PRODUCTS[0];

    const galleryImages = [
        product.image,
        product.image,
        product.image,
        product.image
    ];

    const handleAddToCart = () => {
        setAddedNotice(true);
        setTimeout(() => {
            navigate("/customer/cart");
        }, 600);
    };

    return (
        <div className="customer-product-details-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <Link to="/customer/categories">Categories</Link>
                <span>&gt;</span>
                <Link to={`/customer/category/${product.categoryId}`}>{product.categoryName}</Link>
                <span>&gt;</span>
                <span className="current-crumb">{product.name}</span>
            </div>

            {addedNotice && (
                <div className="cart-toast-alert">
                    <i className="bi bi-check-circle-fill"></i>
                    <span><strong>{product.name}</strong> added to cart successfully! Redirecting to cart...</span>
                </div>
            )}

            {/* Main Product Card Container */}
            <div className="jumia-product-details-card">
                {/* Left Side: Interactive Image Gallery */}
                <div className="product-gallery-side">
                    <div className="main-image-viewport">
                        <img
                            src={galleryImages[selectedImgIndex]}
                            alt={product.name}
                            className="active-display-img"
                        />
                        <button type="button" className="btn-wishlist-heart" title="Save to Wishlist">
                            <i className="bi bi-heart"></i>
                        </button>
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="thumbnail-strip">
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`thumb-button ${selectedImgIndex === idx ? "selected" : ""}`}
                                onClick={() => setSelectedImgIndex(idx)}
                            >
                                <img src={img} alt={`View ${idx + 1}`} />
                            </button>
                        ))}
                    </div>

                    <div className="share-product-row">
                        <span className="share-label">SHARE THIS PRODUCT:</span>
                        <div className="social-icons-group">
                            <button type="button" className="social-btn" title="Share on Facebook"><i className="bi bi-facebook"></i></button>
                            <button type="button" className="social-btn" title="Share on Twitter"><i className="bi bi-twitter-x"></i></button>
                            <button type="button" className="social-btn" title="Share on WhatsApp"><i className="bi bi-whatsapp"></i></button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Product Information */}
                <div className="product-info-side">
                    {/* Brand & Store Badge */}
                    <div className="store-badge-row">
                        <span className="official-store-tag">Official Store</span>
                        <span className="brand-name-tag">Brand: <strong>{product.brand}</strong></span>
                    </div>

                    <h1 className="product-full-title">{product.name}</h1>
                    <p className="product-full-subtitle">{product.subtitle}</p>

                    {/* Rating and Reviews */}
                    <div className="product-rating-row">
                        <div className="star-icons">
                            {"★".repeat(Math.floor(product.rating))}
                            {"☆".repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span className="rating-score">{product.rating}</span>
                        <span className="rating-divider">|</span>
                        <span className="rating-reviews-link">({product.reviewsCount} verified ratings)</span>
                    </div>

                    {/* Flash Sales Promotional Banner */}
                    <div className="flash-sales-promo-bar">
                        <div className="flash-title">
                            <i className="bi bi-lightning-charge-fill"></i>
                            <span>Flash Sales</span>
                        </div>
                        <div className="flash-timer">
                            <span className="time-label">Time Left:</span>
                            <span className="timer-pill">04:32:19</span>
                        </div>
                    </div>

                    {/* Price Block */}
                    <div className="product-price-block">
                        <div className="main-price-row">
                            <span className="naira-price">₦ {product.price.toLocaleString()}</span>
                            <span className="naira-old-price">₦ {product.oldPrice.toLocaleString()}</span>
                            <span className="discount-pill">-{product.discountPercent}%</span>
                        </div>
                        <div className="stock-progress-wrap">
                            <span className="stock-text">{product.inStock} items left</span>
                            <div className="stock-bar">
                                <div className="stock-fill-level" style={{ width: `${Math.min(100, (product.inStock / 50) * 100)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="quantity-selector-row">
                        <span className="qty-label">Quantity:</span>
                        <div className="qty-counter-box">
                            <button
                                type="button"
                                className="qty-btn"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            >
                                -
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                type="button"
                                className="qty-btn"
                                onClick={() => setQuantity(prev => prev + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart CTA */}
                    <div className="cart-action-group">
                        <button
                            type="button"
                            className="btn-add-to-cart-jumia"
                            onClick={handleAddToCart}
                        >
                            <i className="bi bi-cart3"></i>
                            <span>Add to cart</span>
                        </button>
                        <Link to="/customer/cart" className="btn-view-cart-link">
                            <i className="bi bi-bag-check"></i>
                            <span>View Cart</span>
                        </Link>
                    </div>

                    {/* Delivery & Returns Info */}
                    <div className="delivery-info-card">
                        <div className="delivery-header">
                            <i className="bi bi-truck text-emerald"></i>
                            <span>DELIVERY & RETURNS</span>
                        </div>
                        <div className="delivery-details-list">
                            <div className="delivery-item">
                                <div className="deliv-icon"><i className="bi bi-geo-alt"></i></div>
                                <div className="deliv-text">
                                    <strong>Delivery to Abeokuta, Ogun State</strong>
                                    <p>Estimated delivery within 24-48 hours. Express shipping available.</p>
                                </div>
                            </div>
                            <div className="delivery-item">
                                <div className="deliv-icon"><i className="bi bi-arrow-repeat"></i></div>
                                <div className="deliv-text">
                                    <strong>Free Return within 7 Days</strong>
                                    <p>Free return on all eligible items. Full money-back guarantee.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Specifications & Details Card */}
            <div className="product-specifications-card">
                <h3 className="specs-section-title">Product Details</h3>
                <p className="specs-description">{product.description}</p>

                <h4 className="specs-features-title">Key Features:</h4>
                <ul className="specs-features-list">
                    {product.features && product.features.map((feat, idx) => (
                        <li key={idx}><i className="bi bi-check2-circle"></i> {feat}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
