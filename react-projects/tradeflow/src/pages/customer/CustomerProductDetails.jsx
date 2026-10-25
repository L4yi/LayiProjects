import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../utils/cart";
import { LoadingSpinner } from "../../components/common";
import productService from "../../services/productService";

export default function CustomerProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedNotice, setAddedNotice] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const singleRes = await productService.fetchProductById(productId);
                if (singleRes.success && singleRes.data) {
                    setProduct(singleRes.data);
                } else {
                    const allRes = await productService.fetchAllProducts();
                    if (allRes.success && allRes.data) {
                        const matched = allRes.data.find(
                            (p) => String(p.id || p.product_id) === String(productId)
                        );
                        setProduct(matched || null);
                    }
                }
            } catch (_) {}
            finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id || product.product_id,
            name: product.name || product.product_name,
            categoryId: product.categoryId || product.categories_id,
            categoryName: product.categoryName || product.categories_name,
            price: Number(product.price || product.product_price || 0),
            image: product.image || "/src/assets/icon.png",
            quantity
        }, quantity);

        setAddedNotice(true);
        setTimeout(() => {
            navigate("/customer/cart");
        }, 600);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px" }}>
                <LoadingSpinner message="Loading product details..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b" }}>
                <i className="bi bi-exclamation-circle" style={{ fontSize: "2.5rem", color: "#ef4444", display: "block", marginBottom: "12px" }}></i>
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist or has been removed.</p>
                <Link to="/customer/categories" className="btn-start-shopping" style={{ display: "inline-block", marginTop: "16px" }}>
                    Browse All Products
                </Link>
            </div>
        );
    }

    const prodName = product.name || product.product_name;
    const prodPrice = Number(product.price || product.product_price || 0);
    const prodImg = product.image || "/src/assets/icon.png";
    const prodDesc = product.description || "High quality verified product with manufacturer warranty.";

    return (
        <div className="customer-product-details-container">
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <Link to="/customer/categories">Categories</Link>
                <span>&gt;</span>
                <span className="current-crumb">{prodName}</span>
            </div>

            {addedNotice && (
                <div className="cart-toast-alert">
                    <i className="bi bi-check-circle-fill"></i>
                    <span><strong>{prodName}</strong> added to cart successfully! Redirecting...</span>
                </div>
            )}

            <div className="jumia-product-details-card">
                <div className="product-gallery-side">
                    <div className="main-image-viewport">
                        <img
                            src={prodImg}
                            alt={prodName}
                            className="active-display-img"
                            onError={(e) => { e.target.src = "/src/assets/icon.png"; }}
                        />
                    </div>
                </div>

                <div className="product-info-side">
                    <div className="store-badge-row">
                        <span className="official-store-tag">Official Store</span>
                        <span className="brand-name-tag">Category: <strong>{product.categoryName || product.categories_name || "General"}</strong></span>
                    </div>

                    <h1 className="product-full-title">{prodName}</h1>
                    <p className="product-full-subtitle">{product.categoryName || product.categories_name || "TradeFlow Verified Item"}</p>

                    <div className="product-card-rating">
                        <span className="rating-stars">★★★★★</span>
                        <span className="reviews-count">(Verified Quality)</span>
                    </div>

                    <div className="product-price-section">
                        <div className="price-display-group">
                            <span className="main-price-figure">₦ {prodPrice.toLocaleString()}</span>
                        </div>
                        <div className="stock-alert-tag in-stock">
                            <i className="bi bi-check2-circle"></i>
                            <span>In Stock — Ready to ship</span>
                        </div>
                    </div>

                    <div className="product-quantity-selector">
                        <label>Quantity:</label>
                        <div className="qty-control-buttons">
                            <button
                                type="button"
                                className="qty-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <span className="qty-number-display">{quantity}</span>
                            <button
                                type="button"
                                className="qty-btn"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="product-action-buttons">
                        <button
                            type="button"
                            className="btn-add-to-cart primary-cart-btn"
                            onClick={handleAddToCart}
                        >
                            <i className="bi bi-cart-plus-fill"></i>
                            <span>ADD TO CART</span>
                        </button>
                    </div>

                    <div className="product-description-accordion mt-24">
                        <h3 className="section-subtitle">Product Description</h3>
                        <p style={{ lineHeight: "1.6", color: "#475569", whiteSpace: "pre-line" }}>
                            {prodDesc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
