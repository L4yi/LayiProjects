import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../../services/productService";
import { addToCart } from "../../utils/cart";

export default function CustomerProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedNotice, setAddedNotice] = useState(false);

    // Fetch product details live from backend
    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await productService.fetchAllProducts();
                if (res.success && Array.isArray(res.data)) {
                    const found = res.data.find(
                        p => String(p.product_id || p.productId || p.id) === String(productId)
                    ) || res.data[0];

                    if (found) {
                        setProduct({
                            id: String(found.product_id || found.productId || found.id),
                            name: found.product_name || found.name || "Product",
                            categoryId: String(found.category_id || found.categoryId || ""),
                            categoryName: found.category_name || "Catalog",
                            price: Number(found.product_price || found.price || 0),
                            oldPrice: Number(found.product_price || found.price || 0) * 1.15,
                            rating: 5,
                            reviewCount: 12,
                            sku: `SKU-${found.product_id || found.productId || "001"}`,
                            stockCount: found.quantity || found.inStock || 25,
                            description: found.description || "Premium quality retail product backed by TradeFlow authenticity warranty.",
                            image: found.image || null,
                            highlights: [
                                "Official Manufacturer Warranty included",
                                "Doorstep delivery available across all zones",
                                "7-day return and exchange guarantee"
                            ]
                        });
                    }
                }
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
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#718096" }}>
                Loading product details from database...
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

    const galleryImages = [
        product.image,
        product.image,
        product.image,
        product.image
    ].filter(Boolean);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedNotice(true);
        setTimeout(() => {
            navigate("/customer/cart");
        }, 500);
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
                        {galleryImages[selectedImgIndex] ? (
                            <img
                                src={galleryImages[selectedImgIndex]}
                                alt={product.name}
                                className="active-display-img"
                            />
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", color: "#94a3b8" }}>
                                <i className="bi bi-box-seam" style={{ fontSize: "3rem" }}></i>
                            </div>
                        )}
                        <button type="button" className="btn-wishlist-heart" title="Save to Wishlist">
                            <i className="bi bi-heart"></i>
                        </button>
                    </div>

                    {galleryImages.length > 1 && (
                        <div className="thumbnail-strip">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`thumb-btn ${selectedImgIndex === idx ? "active-thumb" : ""}`}
                                    onClick={() => setSelectedImgIndex(idx)}
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
                    </div>

                    <div className="stock-availability-bar">
                        <i className="bi bi-check-circle-fill green-icon"></i>
                        <span>In Stock ({product.stockCount} units available in warehouse)</span>
                    </div>

                    <p className="product-description-snippet">{product.description}</p>

                    <div className="product-highlights-box">
                        <h4>Key Specifications:</h4>
                        <ul>
                            {product.highlights.map((h, idx) => (
                                <li key={idx}>
                                    <i className="bi bi-check2"></i>
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
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
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

                        <button
                            type="button"
                            className="btn-buy-now-accent"
                            onClick={handleAddToCart}
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="trust-badges-bar">
                        <div className="trust-badge-item">
                            <i className="bi bi-shield-check"></i>
                            <div>
                                <strong>Authentic Product</strong>
                                <p>100% genuine guaranteed</p>
                            </div>
                        </div>
                        <div className="trust-badge-item">
                            <i className="bi bi-truck"></i>
                            <div>
                                <strong>Fast Dispatch</strong>
                                <p>Dispatches within 24 hours</p>
                            </div>
                        </div>
                        <div className="trust-badge-item">
                            <i className="bi bi-arrow-repeat"></i>
                            <div>
                                <strong>Easy Returns</strong>
                                <p>7-day hassle-free returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
