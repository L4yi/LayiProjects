import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isInWishlist, addToWishlist, removeFromWishlist } from "../utils/wishlist";
import { getSessionUser } from "../utils/session";
import { customerService } from "../services/customerService";

function ProductItemCard({
    id = "prd-01",
    name = "",
    title = "",
    subtitle = "",
    image = "",
    price = "₦0.00",
    oldPrice = "",
    rating = 5,
    reviewsCount = 12,
    badge = ""
}) {
    const [imgFailed, setImgFailed] = useState(false);
    const [isSaved, setIsSaved] = useState(() => isInWishlist(id));
    const displayName = title || name || "Product Name";

    useEffect(() => {
        setImgFailed(false);
    }, [image]);

    useEffect(() => {
        setIsSaved(isInWishlist(id));
        const handleSync = () => {
            setIsSaved(isInWishlist(id));
        };
        window.addEventListener("tradeflow_wishlist_update", handleSync);
        return () => window.removeEventListener("tradeflow_wishlist_update", handleSync);
    }, [id]);

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const user = getSessionUser();
        const customerId = user?.customerId || user?.id;

        if (isSaved) {
            removeFromWishlist(id);
            setIsSaved(false);
            if (customerId) {
                customerService.removeWishlist(customerId, id).catch(() => {});
            }
        } else {
            addToWishlist({
                id,
                productId: id,
                name: displayName,
                price,
                originalPrice: oldPrice,
                categoryName: subtitle || "General",
                image
            });
            setIsSaved(true);
            if (customerId) {
                customerService.addToWishlist(customerId, id).catch(() => {});
            }
        }
    };

    const hasValidImage = Boolean(image && !imgFailed);

    return (
        <div className="customer-product-card">
            {badge && <span className="product-badge-flag">{badge}</span>}
            <button
                type="button"
                className={`product-card-wishlist-btn ${isSaved ? "active" : ""}`}
                onClick={handleToggleWishlist}
                aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
                title={isSaved ? "Saved in Wishlist" : "Add to Wishlist"}
            >
                <i className={`bi ${isSaved ? "bi-heart-fill" : "bi-heart"}`}></i>
            </button>
            <div className="product-card-img-wrap">
                <Link to={`/customer/product/${id}`}>
                    {hasValidImage ? (
                        <img
                            src={image}
                            alt={displayName}
                            className="product-card-thumb"
                            onError={() => setImgFailed(true)}
                        />
                    ) : (
                        <div className="product-card-thumb-placeholder">
                            <i className="bi bi-box-seam"></i>
                        </div>
                    )}
                </Link>
            </div>

            <div className="product-card-content">
                <h4 className="product-card-title">
                    <Link to={`/customer/product/${id}`}>{displayName}</Link>
                </h4>

                {subtitle && <p className="product-card-sub">{subtitle}</p>}

                <div className="product-card-rating">
                    <span className="rating-stars">
                        {"★".repeat(Math.floor(rating))}
                        {"☆".repeat(5 - Math.floor(rating))}
                    </span>
                    <span className="reviews-count">({reviewsCount})</span>
                </div>

                <div className="product-card-price-row">
                    <span className="current-price">{price}</span>
                    {oldPrice && <span className="old-price">{oldPrice}</span>}
                </div>

                <Link to={`/customer/product/${id}`} className="btn-view-details">
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default React.memo(ProductItemCard);
