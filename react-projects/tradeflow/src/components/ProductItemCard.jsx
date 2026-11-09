import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductItemCard({
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
    const displayName = title || name || "Product Name";

    useEffect(() => {
        setImgFailed(false);
    }, [image]);

    const hasValidImage = Boolean(image && !imgFailed);

    return (
        <div className="customer-product-card">
            {badge && <span className="product-badge-flag">{badge}</span>}
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
