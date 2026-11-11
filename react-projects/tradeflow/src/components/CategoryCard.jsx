import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({
    id = "tubers",
    to = "",
    title = "Category",
    image = "",
    badge = "Active",
    itemCount = ""
}) {
    const destination = to || `/customer/category/${id}`;
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        setImgFailed(false);
    }, [image]);

    const hasValidImage = Boolean(image && !imgFailed);

    return (
        <Link to={destination} className="customer-category-card" title={`Browse ${title}`}>
            <div className="cat-card-img-wrapper">
                {badge && (
                    <div className="cat-brand-pill">
                        <span className="cat-brand-dot"></span>
                        <span className="cat-brand-text">{badge}</span>
                    </div>
                )}
                {hasValidImage ? (
                    <img
                        src={image}
                        alt={title}
                        className="cat-group-img"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <div className="cat-card-placeholder-bg">
                        <span className="cat-card-placeholder-initial">{title ? title.charAt(0).toUpperCase() : "C"}</span>
                    </div>
                )}
            </div>
            <div className="cat-card-footer">
                <h4 className="cat-card-title">{title}</h4>
                {itemCount && <span className="cat-item-count">{itemCount}</span>}
            </div>
        </Link>
    );
}
