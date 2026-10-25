import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerUserBanner from "../../components/CustomerUserBanner";
import CategoryCard from "../../components/CategoryCard";
import ProductItemCard from "../../components/ProductItemCard";
import { LoadingSpinner } from "../../components/common";
import categoryService, { inferCategoryIcon } from "../../services/categoryService";
import productService from "../../services/productService";

export default function CustomerDashboard() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setHasNetworkError(false);
        try {
            const [catRes, prodRes] = await Promise.all([
                categoryService.fetchAllCategories(),
                productService.fetchAllProducts()
            ]);

            if (catRes.success) {
                setCategories(catRes.data || []);
            } else if (catRes.data?.length === 0) {
                setCategories([]);
            }

            if (prodRes.success) {
                setProducts(prodRes.data || []);
            } else if (prodRes.data?.length === 0) {
                setProducts([]);
            }

            if (!catRes.success && !prodRes.success && catRes.message?.includes("network")) {
                setHasNetworkError(true);
            }
        } catch (_) {
            setHasNetworkError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="customer-dashboard-container">
            <CustomerUserBanner
                buttonText="Browse Categories"
                buttonLink="/customer/categories"
            />

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
                    <LoadingSpinner message="Loading catalog..." />
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
                        Unable to load store data from the server.
                    </p>
                    <button
                        type="button"
                        onClick={loadData}
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
            ) : (
                <>
                    <div className="customer-panel-card mt-24">
                        <div className="panel-card-header">
                            <div className="panel-title-group">
                                <div className="panel-accent-icon green-accent">
                                    <i className="bi bi-grid-1x2-fill"></i>
                                </div>
                                <div>
                                    <h2 className="panel-title">Product Categories</h2>
                                    <p className="panel-subtitle">
                                        Explore live product categories from our official catalog
                                    </p>
                                </div>
                            </div>

                            <div className="panel-header-actions">
                                <Link to="/customer/categories" className="btn-view-all-categories green-btn">
                                    <span>View All Categories</span>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>
                            </div>
                        </div>

                        {categories.length === 0 ? (
                            <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                                <i className="bi bi-folder2-open" style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}></i>
                                <p>No categories available at the moment.</p>
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

                    <div className="customer-panel-card mt-24">
                        <div className="panel-card-header">
                            <div className="panel-title-group">
                                <div className="panel-accent-icon green-accent">
                                    <i className="bi bi-box-seam"></i>
                                </div>
                                <div>
                                    <h2 className="panel-title">Featured Products</h2>
                                    <p className="panel-subtitle">
                                        Verified products available for immediate delivery
                                    </p>
                                </div>
                            </div>

                            <div className="panel-header-actions">
                                <Link to="/customer/categories" className="btn-view-all-categories green-btn">
                                    <span>See All Deals</span>
                                    <i className="bi bi-chevron-right"></i>
                                </Link>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                                <i className="bi bi-box" style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}></i>
                                <p>No products available currently.</p>
                            </div>
                        ) : (
                            <div className="customer-products-grid">
                                {products.map((prod) => (
                                    <ProductItemCard
                                        key={prod.id || prod.product_id}
                                        id={prod.id || prod.product_id}
                                        name={prod.name || prod.product_name}
                                        title={prod.name || prod.product_name}
                                        subtitle={prod.categoryName || prod.categories_name || "Official Store"}
                                        rating={5}
                                        price={`₦ ${Number(prod.price || prod.product_price || 0).toLocaleString()}`}
                                        image={prod.image || "/src/assets/icon.png"}
                                        badge={prod.status_name || "In Stock"}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
