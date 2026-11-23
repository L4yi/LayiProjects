import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlistItems, setWishlistItems, removeFromWishlist, clearWishlist } from "../../utils/wishlist";
import { addToCart, addBatchToCart } from "../../utils/cart";
import { getSessionUser } from "../../utils/session";
import { customerService } from "../../services/customerService";
import { PageHeader } from "../../components/common";

export default function CustomerWishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState(getWishlistItems());
    const [failedImgs, setFailedImgs] = useState({});
    const [toastMessage, setToastMessage] = useState("");
    const [movingId, setMovingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [isClearing, setIsClearing] = useState(false);
    const [isMovingAll, setIsMovingAll] = useState(false);

    useEffect(() => {
        const handleWishlistUpdate = () => {
            setWishlist(getWishlistItems());
        };
        window.addEventListener("tradeflow_wishlist_update", handleWishlistUpdate);

        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            customerService.fetchWishlist(customerId).then(res => {
                if (res?.success && Array.isArray(res.data)) {
                    const remoteItems = res.data.map(item => ({
                        id: String(item.productId || item.id),
                        productId: String(item.productId || item.id),
                        name: item.productName || item.name || "Item",
                        price: parseFloat(item.price || 0),
                        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : null,
                        category: item.categoryName || item.category || "General",
                        categoryName: item.categoryName || item.category || "General",
                        image: item.imageUrl || item.image || item.product_image || "",
                        inStock: item.inStock !== false && item.inStock !== 0
                    }));
                    setWishlistItems(remoteItems);
                    setWishlist(remoteItems);
                }
            }).catch(() => {});
        }

        return () => window.removeEventListener("tradeflow_wishlist_update", handleWishlistUpdate);
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3000);
    };

    const handleMoveToCart = async (item) => {
        setMovingId(item.id);
        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            try {
                await customerService.moveWishlistToCart(customerId, item.productId || item.id);
            } catch (err) {
                console.warn("Backend move to cart fallback:", err);
            }
        }
        addToCart(item, 1);
        removeFromWishlist(item.id);
        setWishlist(getWishlistItems());
        setMovingId(null);
        showToast(`Moved "${item.name}" to your shopping cart!`);
    };

    const handleRemove = async (id, name) => {
        setRemovingId(id);
        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            try {
                await customerService.removeWishlist(customerId, id);
            } catch (err) {
                console.warn("Backend remove wishlist fallback:", err);
            }
        }
        removeFromWishlist(id);
        setWishlist(getWishlistItems());
        setRemovingId(null);
        showToast(`Removed "${name}" from your wishlist.`);
    };

    const handleMoveAllToCart = async () => {
        if (wishlist.length === 0) return;
        setIsMovingAll(true);
        const itemsToMove = [...wishlist];
        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            await Promise.allSettled(
                itemsToMove.map(item =>
                    customerService.moveWishlistToCart(customerId, item.productId || item.id)
                )
            );
        }
        const count = itemsToMove.length;
        addBatchToCart(itemsToMove);
        clearWishlist();
        setWishlist([]);
        setIsMovingAll(false);
        showToast(`Moved all ${count} item${count > 1 ? "s" : ""} to your shopping cart!`);
    };

    const handleClearAll = async () => {
        if (wishlist.length === 0) return;
        setIsClearing(true);
        const itemsToClear = [...wishlist];
        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;
        if (customerId) {
            await Promise.allSettled(
                itemsToClear.map(item =>
                    customerService.removeWishlist(customerId, item.productId || item.id)
                )
            );
        }
        clearWishlist();
        setWishlist([]);
        setIsClearing(false);
        showToast("Your wishlist has been cleared.");
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Wishlist</span>
            </div>

            {/* Notification Toast */}
            {toastMessage && (
                <div className="wishlist-toast-alert animate-fadeIn">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{toastMessage}</span>
                    <button type="button" onClick={() => setToastMessage("")}>
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            )}

            {/* Header Card */}
            <div className="customer-panel-card mb-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-heart-fill text-rose"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Saved Wishlist &amp; Favorites</h2>
                            <p className="panel-subtitle">
                                You have {wishlist.length} item{wishlist.length === 1 ? "" : "s"} saved for later purchase
                            </p>
                        </div>
                    </div>

                    {wishlist.length > 0 && (
                        <div className="panel-header-actions wishlist-header-actions">
                            <button
                                type="button"
                                className="btn-move-all-wishlist"
                                onClick={handleMoveAllToCart}
                                disabled={isMovingAll || isClearing}
                            >
                                {isMovingAll ? (
                                    <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} role="status"></span>
                                ) : (
                                    <i className="bi bi-cart-plus-fill"></i>
                                )}
                                <span>{isMovingAll ? "Moving All..." : "Move All to Cart"}</span>
                            </button>

                            <button
                                type="button"
                                className="btn-clear-wishlist"
                                onClick={handleClearAll}
                                disabled={isClearing || isMovingAll}
                            >
                                {isClearing ? (
                                    <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} role="status"></span>
                                ) : (
                                    <i className="bi bi-trash3"></i>
                                )}
                                <span>{isClearing ? "Clearing..." : "Clear Wishlist"}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Wishlist Items Grid */}
                {wishlist.length > 0 ? (
                    <div className="customer-products-grid">
                        {wishlist.map((item) => (
                            <div key={item.id} className="wishlist-product-card">
                                <div className="wishlist-card-media">
                                    <Link to={`/customer/product/${item.id}`} className="wishlist-img-link">
                                        {item.image && !failedImgs[item.id] ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="wishlist-card-img"
                                                onError={() => setFailedImgs(prev => ({ ...prev, [item.id]: true }))}
                                            />
                                        ) : (
                                            <div className="wishlist-img-fallback">
                                                <i className="bi bi-box-seam"></i>
                                            </div>
                                        )}
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn-wishlist-remove"
                                        onClick={() => handleRemove(item.id, item.name)}
                                        disabled={removingId === item.id}
                                        title="Remove from Wishlist"
                                    >
                                        {removingId === item.id ? (
                                            <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px" }} role="status"></span>
                                        ) : (
                                            <i className="bi bi-trash3"></i>
                                        )}
                                    </button>
                                </div>

                                <div className="wishlist-card-body">
                                    <span className="wishlist-category-tag">{item.subtitle || item.categoryName || "Catalog Item"}</span>
                                    <h4 className="wishlist-product-title">
                                        <Link to={`/customer/product/${item.id}`}>{item.name}</Link>
                                    </h4>

                                    <div className="wishlist-rating-row">
                                        <div className="stars-group">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className="bi bi-star-fill star-gold"></i>
                                            ))}
                                        </div>
                                        <span className="rating-score">(5.0)</span>
                                    </div>

                                    <div className="wishlist-price-row">
                                        <span className="wishlist-current-price">
                                            {typeof item.price === "number" ? `₦ ${item.price.toLocaleString()}` : item.price}
                                        </span>
                                        {item.oldPrice && (
                                            <span className="wishlist-old-price">
                                                {typeof item.oldPrice === "number" ? `₦ ${item.oldPrice.toLocaleString()}` : item.oldPrice}
                                            </span>
                                        )}
                                    </div>

                                    <div className="wishlist-actions-bar">
                                        <button
                                            type="button"
                                            className="btn-move-to-cart"
                                            onClick={() => handleMoveToCart(item)}
                                            disabled={movingId === item.id}
                                        >
                                            {movingId === item.id ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" style={{ width: "12px", height: "12px", marginRight: "6px" }} role="status"></span>
                                                    <span>Moving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-cart-plus"></i>
                                                    <span>Move to Cart</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="wishlist-empty-state">
                        <div className="wishlist-empty-icon-circle">
                            <i className="bi bi-heart"></i>
                        </div>
                        <h3>Your wishlist is currently empty</h3>
                        <p>Explore our catalog, discover deals, and tap the heart icon on any product to save it here for later.</p>
                        <Link to="/customer/products" className="btn-explore-catalog">
                            <i className="bi bi-bag-check"></i>
                            <span>Explore All Products</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
