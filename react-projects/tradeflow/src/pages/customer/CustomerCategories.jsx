import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import categoryService from "../../services/categoryService";

export default function CustomerCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch categories directly from backend database
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await categoryService.fetchAllCategories();
                if (res.success && Array.isArray(res.data)) {
                    const mapped = res.data.map((cat) => ({
                        id: cat.categories_id || cat.categoryId || cat.id,
                        title: cat.category_name || cat.name || "Category",
                        badge: cat.status_name || "Active",
                        image: cat.image || null,
                        itemCount: 0
                    }));
                    setCategories(mapped);
                }
            } catch (err) {
                console.error("Failed to load store categories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

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

                {/* Categories Grid loaded from backend */}
                {isLoading ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#718096" }}>
                        Loading categories from database...
                    </div>
                ) : (
                    <div className="customer-categories-grid">
                        {categories.map((cat) => (
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
                )}
            </div>
        </div>
    );
}
