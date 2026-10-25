import React from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import { STORE_CATEGORIES } from "../../data/storeData";

export default function CustomerCategories() {
    return (
        <div className="customer-categories-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Product Categories</span>
            </div>

            {/* Product Categories Catalog Panel */}
            <div className="customer-panel-card">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-grid-1x2-fill"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Explore All Product Categories</h2>
                            <p className="panel-subtitle">
                                Browse our verified catalog of electronics, fashion, wearables, and accessories
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="customer-categories-grid">
                    {STORE_CATEGORIES.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            id={cat.id}
                            title={cat.title}
                            badge={cat.badge}
                            image={cat.image}
                            itemCount={cat.itemCount}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
