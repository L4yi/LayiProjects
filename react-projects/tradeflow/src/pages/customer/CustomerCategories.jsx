import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import { LoadingSpinner } from "../../components/common";
import categoryService from "../../services/categoryService";

export default function CustomerCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);

    const loadCategories = async () => {
        setLoading(true);
        setHasNetworkError(false);
        try {
            const res = await categoryService.fetchAllCategories();
            if (res.success) {
                setCategories(res.data || []);
            } else {
                setCategories([]);
                if (res.message?.includes("network") || res.message?.includes("Failed to connect")) {
                    setHasNetworkError(true);
                }
            }
        } catch (_) {
            setHasNetworkError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <div className="customer-categories-page-container">
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">Product Categories</span>
            </div>

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

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "260px" }}>
                        <LoadingSpinner message="Loading categories..." />
                    </div>
                ) : hasNetworkError ? (
                    <div
                        style={{
                            margin: "24px 0",
                            padding: "24px",
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            borderRadius: "12px",
                            textAlign: "center"
                        }}
                    >
                        <i className="bi bi-wifi-off" style={{ fontSize: "2rem", color: "#e11d48", display: "block", marginBottom: "8px" }}></i>
                        <h3 style={{ margin: "0 0 6px", color: "#9f1239" }}>Connection Error</h3>
                        <p style={{ margin: "0 0 16px", color: "#881337", fontSize: "0.9rem" }}>
                            Unable to fetch product categories.
                        </p>
                        <button
                            type="button"
                            onClick={loadCategories}
                            style={{
                                padding: "8px 18px",
                                background: "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : categories.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                        <i className="bi bi-folder2-open" style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}></i>
                        <p>No categories found in the catalog.</p>
                    </div>
                ) : (
                    <div className="customer-categories-grid">
                        {categories.map((cat) => (
                            <CategoryCard
                                key={cat.id || cat.categories_id}
                                id={cat.id || cat.categories_id}
                                title={cat.name || cat.categories_name}
                                badge={cat.status_name || "ACTIVE"}
                                image={cat.image || "/src/assets/icon.png"}
                                itemCount={cat.itemCount || ""}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
