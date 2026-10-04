import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({
    id = "tubers",
    to = "",
    title = "Category",
    image = "",
    badge = "Get FoodStuffs",
    itemCount = ""
}) {
    const destination = to || `/customer/category/${id}`;

    return (
        <Link to={destination} className="customer-category-card" title={`Browse ${title}`}>
            <div className="cat-card-img-wrapper">
                {badge && (
                    <div className="cat-brand-pill">
                        <span className="cat-brand-dot"></span>
                        <span className="cat-brand-text">{badge}</span>
                    </div>
                )}
                <img
                    src={image}
                    alt={title}
                    className="cat-group-img"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            </div>
            <div className="cat-card-footer">
                <h4 className="cat-card-title">{title}</h4>
                {itemCount && <span className="cat-item-count">{itemCount}</span>}
            </div>
        </Link>
    );
}
