import React, { useState } from "react";
import { Link } from "react-router-dom";
import { inferCategoryIcon } from "../services/categoryService";

export default function CategoryCard({
    id = "tubers",
    to = "",
    title = "Category",
    image = "",
    icon = "",
    badge = "Active",
    itemCount = ""
}) {
    const destination = to || `/customer/category/${id}`;
    const [imgFailed, setImgFailed] = useState(false);
    const iconClass = icon || inferCategoryIcon(title);
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
                    <div className="cat-card-icon-avatar">
                        <i className={iconClass}></i>
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
