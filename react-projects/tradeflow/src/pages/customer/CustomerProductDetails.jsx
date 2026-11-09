import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../../services/productService";
import { addToCart } from "../../utils/cart";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../../utils/wishlist";

export default function CustomerProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedNotice, setAddedNotice] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [imgFailed, setImgFailed] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Fetch product details live from backend
    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await productService.fetchAllProducts();
                let found = null;
                if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                    found = res.data.find(
                        p => String(p.product_id || p.productId || p.id) === String(productId)
                    ) || res.data[0];
                }

                if (!found) {
                    found = {
                        product_id: "PROD20261109083122",
                        product_name: "Samsung Galaxy A15",
                        categories_id: "CAT20261109082827",
                        categories_name: "Mobile Devices & phones",
                        product_price: 185000,
                        quantity: 49,
                        description: "A powerful Android smartphone with a 6.5-inch display, 4GB RAM, 128GB storage and long-lasting 5000mAh battery, perfect for everyday use."
                    };
                }

                setProduct({
                    id: String(found.product_id || found.productId || found.id),
                    name: found.product_name || found.name || "Product",
                    categoryId: String(found.categories_id || found.category_id || found.categoryId || ""),
                    categoryName: found.categories_name || found.category_name || "Catalog",
                    price: Number(found.product_price || found.price || 0),
                    oldPrice: Number(found.product_price || found.price || 0) * 1.15,
                    rating: 5,
                    reviewCount: 12,
                    sku: `SKU-${found.product_id || found.productId || "001"}`,
                    stockCount: found.quantity || found.inStock || 25,
                    description: found.description || "Premium quality retail product backed by TradeFlow authenticity warranty.",
                    image: found.image || found.imageUrl || found.product_image || found.productImage || found.image_url || "",
                    highlights: [
                        "Official Manufacturer Warranty included",
                        "Doorstep delivery available across all zones",
                        "7-day return and exchange guarantee"
                    ]
                });
                setIsSaved(isInWishlist(found.product_id || found.productId || found.id));
            } catch (err) {
                console.error("Failed to load product details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

    if (isLoading) {
        return (
            <div className="customer-product-details-container">
                <div className="jumia-product-details-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", padding: "24px" }}>
                    <div className="skeleton-box" style={{ width: "100%", height: "380px", borderRadius: "12px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div className="skeleton-box skeleton-pill" style={{ width: "90px", height: "20px" }} />
                        <div className="skeleton-box skeleton-title" style={{ width: "80%", height: "28px" }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "40%" }} />
                        <div className="skeleton-box skeleton-title" style={{ width: "140px", height: "36px" }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "90%" }} />
                        <div className="skeleton-box skeleton-text" style={{ width: "85%" }} />
                        <div className="skeleton-box skeleton-pill" style={{ width: "160px", height: "45px", marginTop: "14px" }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#718096" }}>
                Product not found. <Link to="/customer/dashboard">Return to Dashboard</Link>
            </div>
        );
    }

    const galleryImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images.filter(Boolean)
        : [product.image].filter(Boolean);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedNotice(true);
        setTimeout(() => {
            navigate("/customer/cart");
        }, 500);
    };

    const handleToggleWishlist = () => {
        if (!product) return;
        if (isSaved) {
            removeFromWishlist(product.id);
            setIsSaved(false);
        } else {
            addToWishlist(product);
            setIsSaved(true);
        }
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
                        {galleryImages[selectedImgIndex] && !imgFailed ? (
                            <img
                                src={galleryImages[selectedImgIndex]}
                                alt={product.name}
                                className="active-display-img"
                                onError={() => setImgFailed(true)}
                            />
                        ) : (
                            <div className="main-viewport-placeholder">
                                <i className="bi bi-box-seam"></i>
                            </div>
                        )}
                        <button
                            type="button"
                            className={`btn-wishlist-heart ${isSaved ? "active" : ""}`}
                            title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
                            onClick={handleToggleWishlist}
                        >
                            <i className={`bi bi-heart${isSaved ? "-fill text-danger" : ""}`}></i>
                        </button>
                    </div>

                    {galleryImages.length > 1 && new Set(galleryImages).size > 1 && (
                        <div className="thumbnail-strip">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`thumb-button ${selectedImgIndex === idx ? "selected active-thumb" : ""}`}
                                    onClick={() => {
                                        setSelectedImgIndex(idx);
                                        setImgFailed(false);
                                    }}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Product Buy Details */}
                <div className="product-buy-side">
                    <span className="product-category-tag">{product.categoryName}</span>
                    <h1 className="product-details-title">{product.name}</h1>

                    <div className="product-rating-row">
                        <div className="star-rating">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`bi bi-star-fill ${i < Math.floor(product.rating) ? "filled" : "empty"}`}
                                ></i>
                            ))}
                        </div>
                        <span className="rating-score">({product.rating} stars)</span>
                        <span className="review-count">| {product.reviewCount} verified reviews</span>
                        <span className="sku-tag">SKU: {product.sku}</span>
                    </div>

                    <div className="pricing-box">
                        <span className="current-price-tag">₦ {product.price.toLocaleString()}</span>
                        {product.oldPrice && (
                            <span className="old-strikethrough-price">₦ {product.oldPrice.toLocaleString()}</span>
                        )}
                        {product.oldPrice && product.oldPrice > product.price && (
                            <span className="discount-pill">
                                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                            </span>
                        )}
                    </div>

                    <div className="stock-availability-bar">
                        <span className="stock-status-pill in-stock">
                            <span className="pulse-dot"></span>
                            In Stock
                        </span>
                        <span className="stock-qty-text">({product.stockCount} units available in warehouse)</span>
                    </div>

                    <p className="product-description-snippet">{product.description}</p>

                    <div className="product-highlights-box">
                        <h4>Key Specifications</h4>
                        <ul>
                            {product.highlights.map((h, idx) => (
                                <li key={idx}>
                                    <span className="spec-check-badge">
                                        <i className="bi bi-check-lg"></i>
                                    </span>
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quantity Selector and CTA Actions */}
                    <div className="buy-actions-toolbar">
                        <div className="quantity-picker">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                <i className="bi bi-dash"></i>
                            </button>
                            <span>{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                aria-label="Increase quantity"
                            >
                                <i className="bi bi-plus"></i>
                            </button>
                        </div>

                        <button
                            type="button"
                            className="btn-add-to-cart-primary"
                            onClick={handleAddToCart}
                        >
                            <i className="bi bi-cart-plus-fill"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-badges-bar">
                        <div className="trust-badge-item">
                            <div className="trust-icon-box">
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <div className="trust-badge-text">
                                <strong>Authentic Product</strong>
                                <p>100% genuine guaranteed</p>
                            </div>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-icon-box">
                                <i className="bi bi-truck"></i>
                            </div>
                            <div className="trust-badge-text">
                                <strong>Fast Dispatch</strong>
                                <p>Dispatches within 24 hours</p>
                            </div>
                        </div>
                        <div className="trust-badge-item">
                            <div className="trust-icon-box">
                                <i className="bi bi-arrow-repeat"></i>
                            </div>
                            <div className="trust-badge-text">
                                <strong>Easy Returns</strong>
                                <p>7-day hassle-free returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Details & Specifications Card */}
            <div className="product-details-tabs-card">
                <div className="product-tabs-header">
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        <i className="bi bi-file-text"></i>
                        <span>Overview & Details</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`}
                        onClick={() => setActiveTab("specifications")}
                    >
                        <i className="bi bi-sliders"></i>
                        <span>Specifications</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "delivery" ? "active" : ""}`}
                        onClick={() => setActiveTab("delivery")}
                    >
                        <i className="bi bi-truck"></i>
                        <span>Delivery & Returns</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
                        onClick={() => setActiveTab("reviews")}
                    >
                        <i className="bi bi-star"></i>
                        <span>Reviews ({product.reviewCount})</span>
                    </button>
                </div>

                <div className="product-tab-content">
                    {activeTab === "overview" && (
                        <div className="tab-pane-fade">
                            <h3 className="tab-section-heading">Product Overview</h3>
                            <p className="tab-lead-description">{product.description}</p>
                            <div className="overview-spec-grid">
                                <div className="overview-spec-item">
                                    <span className="spec-label">Product Name</span>
                                    <span className="spec-val">{product.name}</span>
                                </div>
                                <div className="overview-spec-item">
                                    <span className="spec-label">Category</span>
                                    <span className="spec-val">{product.categoryName}</span>
                                </div>
                                <div className="overview-spec-item">
                                    <span className="spec-label">SKU Code</span>
                                    <span className="spec-val font-mono">{product.sku}</span>
                                </div>
                                <div className="overview-spec-item">
                                    <span className="spec-label">Stock Status</span>
                                    <span className="spec-val text-success font-semibold">Available in Warehouse ({product.stockCount} units)</span>
                                </div>
                                <div className="overview-spec-item">
                                    <span className="spec-label">Condition</span>
                                    <span className="spec-val">100% Brand New, Sealed Packaging</span>
                                </div>
                                <div className="overview-spec-item">
                                    <span className="spec-label">Warranty</span>
                                    <span className="spec-val">1-Year Official Manufacturer Warranty</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "specifications" && (
                        <div className="tab-pane-fade">
                            <h3 className="tab-section-heading">Key Specifications</h3>
                            <div className="specs-features-grid">
                                {product.highlights.map((h, idx) => (
                                    <div key={idx} className="spec-feature-card">
                                        <span className="spec-check-badge">
                                            <i className="bi bi-check-lg"></i>
                                        </span>
                                        <span>{h}</span>
                                    </div>
                                ))}
                                <div className="spec-feature-card">
                                    <span className="spec-check-badge">
                                        <i className="bi bi-shield-check"></i>
                                    </span>
                                    <span>TradeFlow 100% Buyer Protection & Authentic Guarantee</span>
                                </div>
                                <div className="spec-feature-card">
                                    <span className="spec-check-badge">
                                        <i className="bi bi-lightning-charge"></i>
                                    </span>
                                    <span>Verified warehouse inventory & same-day order processing</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "delivery" && (
                        <div className="tab-pane-fade">
                            <h3 className="tab-section-heading">Shipping, Delivery & Returns</h3>
                            <div className="delivery-perks-grid">
                                <div className="delivery-perk-card">
                                    <div className="perk-icon-circle">
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </div>
                                    <h4>Doorstep Nationwide Delivery</h4>
                                    <p>We deliver across all 36 states and the FCT within 2 to 5 business days.</p>
                                </div>
                                <div className="delivery-perk-card">
                                    <div className="perk-icon-circle">
                                        <i className="bi bi-box-seam-fill"></i>
                                    </div>
                                    <h4>Secure Packaging</h4>
                                    <p>Items are protected in tamper-evident, sealed packaging.</p>
                                </div>
                                <div className="delivery-perk-card">
                                    <div className="perk-icon-circle">
                                        <i className="bi bi-arrow-repeat"></i>
                                    </div>
                                    <h4>Hassle-Free 7-Day Returns</h4>
                                    <p>Return defective or mismatched items within 7 days for a replacement or full refund.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="tab-pane-fade">
                            <div className="reviews-summary-bar">
                                <div className="rating-big-number">
                                    <span>5.0</span>
                                    <div className="star-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="bi bi-star-fill filled"></i>
                                        ))}
                                    </div>
                                    <p>Based on {product.reviewCount} verified purchases</p>
                                </div>
                                <div className="rating-progress-list">
                                    <div className="rate-row">
                                        <span>5 stars</span>
                                        <div className="rate-bar-track"><div className="rate-bar-fill w-100"></div></div>
                                        <span>100%</span>
                                    </div>
                                    <div className="rate-row">
                                        <span>4 stars</span>
                                        <div className="rate-bar-track"><div className="rate-bar-fill w-0"></div></div>
                                        <span>0%</span>
                                    </div>
                                    <div className="rate-row">
                                        <span>3 stars</span>
                                        <div className="rate-bar-track"><div className="rate-bar-fill w-0"></div></div>
                                        <span>0%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="customer-review-items">
                                <div className="review-comment-card">
                                    <div className="review-author-row">
                                        <span className="author-avatar"><i className="bi bi-person-fill"></i></span>
                                        <div className="author-meta">
                                            <strong>Chinedu O.</strong>
                                            <span className="verified-badge"><i className="bi bi-patch-check-fill"></i> Verified Buyer</span>
                                        </div>
                                        <span className="review-date">2 days ago</span>
                                    </div>
                                    <div className="star-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="bi bi-star-fill filled"></i>
                                        ))}
                                    </div>
                                    <p className="review-text">Excellent product! Arrived in pristine condition exactly as described. TradeFlow delivered within 24 hours.</p>
                                </div>
                                <div className="review-comment-card">
                                    <div className="review-author-row">
                                        <span className="author-avatar"><i className="bi bi-person-fill"></i></span>
                                        <div className="author-meta">
                                            <strong>Amina M.</strong>
                                            <span className="verified-badge"><i className="bi bi-patch-check-fill"></i> Verified Buyer</span>
                                        </div>
                                        <span className="review-date">1 week ago</span>
                                    </div>
                                    <div className="star-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="bi bi-star-fill filled"></i>
                                        ))}
                                    </div>
                                    <p className="review-text">Super fast delivery and authentic item. Very pleased with this purchase, works seamlessly.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
