import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductItemCard from "../../components/ProductItemCard";
import { STORE_CATEGORIES, STORE_PRODUCTS } from "../../data/storeData";

export default function CustomerCategoryProducts() {
    const { categoryId } = useParams();
    const [sortBy, setSortBy] = useState("popular");

    const currentCat = STORE_CATEGORIES.find(c => c.id === categoryId) || STORE_CATEGORIES[0];
    const filteredProducts = STORE_PRODUCTS.filter(
        p => p.categoryId === currentCat.id
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "low-high") return a.price - b.price;
        if (sortBy === "high-low") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // Default / popular
    });

    const displayProducts = sortedProducts.length > 0 ? sortedProducts : STORE_PRODUCTS;

    return (
        <div className="customer-category-catalog-container">
            {/* Breadcrumb Header */}
            <div className="catalog-breadcrumb-bar">
                <div className="cat-breadcrumb-links">
                    <Link to="/customer/dashboard">Dashboard</Link>
                    <span>/</span>
                    <Link to="/customer/categories">Categories</Link>
                    <span>/</span>
                    <span className="current-page">{currentCat.title}</span>
                </div>
            </div>

            {/* Category Hero Banner */}
            <div className="category-hero-card">
                <div className="hero-text-side">
                    <span className="hero-badge-tag">{currentCat.badge}</span>
                    <h2 className="hero-category-title">{currentCat.name}</h2>
                    <p className="hero-category-desc">{currentCat.description}</p>
                    <div className="hero-meta-stats">
                        <span className="meta-pill"><i className="bi bi-box-seam"></i> {filteredProducts.length} Verified Items</span>
                        <span className="meta-pill"><i className="bi bi-truck"></i> Fast Delivery</span>
                        <span className="meta-pill"><i className="bi bi-shield-check"></i> 100% Genuine</span>
                    </div>
                </div>
                <div className="hero-image-side">
                    <img src={currentCat.image} alt={currentCat.name} className="hero-cat-img" />
                </div>
            </div>

            {/* Quick Switch Category Pills */}
            <div className="category-switcher-pills">
                {STORE_CATEGORIES.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/customer/category/${cat.id}`}
                        className={`switcher-pill-btn ${cat.id === currentCat.id ? "active" : ""}`}
                    >
                        <i className={cat.icon}></i>
                        <span>{cat.name}</span>
                    </Link>
                ))}
            </div>

            {/* Catalog Grid Section */}
            <section className="catalog-products-section">
                <div className="catalog-section-header">
                    <div>
                        <h3 className="section-title">Products in {currentCat.name}</h3>
                        <p className="section-sub">Showing top verified items with real-time stock</p>
                    </div>
                    <div className="catalog-sort-select-wrap">
                        <i className="bi bi-arrow-down-up"></i>
                        <select
                            className="catalog-sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Sort: Most Popular</option>
                            <option value="low-high">Price: Low to High</option>
                            <option value="high-low">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                <div className="customer-products-grid">
                    {displayProducts.map((prod) => (
                        <ProductItemCard
                            key={prod.id}
                            id={prod.id}
                            name={prod.name}
                            subtitle={prod.subtitle}
                            rating={prod.rating}
                            price={`₦ ${prod.price.toLocaleString()}`}
                            oldPrice={`₦ ${prod.oldPrice.toLocaleString()}`}
                            image={prod.image}
                            badge={prod.express ? "TradeFlow Express" : ""}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
