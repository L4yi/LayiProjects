import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductItemCard from "../../components/ProductItemCard";
import { LoadingSpinner } from "../../components/common";
import productService from "../../services/productService";
import categoryService, { inferCategoryIcon } from "../../services/categoryService";

export default function CustomerCategoryProducts() {
    const { categoryId } = useParams();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, prodRes] = await Promise.all([
                    categoryService.fetchAllCategories(),
                    productService.fetchAllProducts()
                ]);

                if (catRes.success) {
                    setCategories(catRes.data || []);
                }
                if (prodRes.success) {
                    setProducts(prodRes.data || []);
                }
            } catch (_) {}
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const activeCat = categories.find(
        (c) => String(c.id || c.categories_id) === String(categoryId)
    ) || (categories.length > 0 ? categories[0] : { id: categoryId, name: "Products" });

    const filteredProducts = products.filter((p) => {
        if (!categoryId) return true;
        const pCatId = String(p.categoryId || p.categories_id || "");
        const curCatId = String(activeCat.id || activeCat.categories_id || "");
        const pCatName = (p.categoryName || p.categories_name || "").toLowerCase();
        const curCatName = (activeCat.name || activeCat.categories_name || "").toLowerCase();
        return pCatId === curCatId || (pCatName && curCatName && pCatName === curCatName);
    });

    const displayList = filteredProducts.length > 0 ? filteredProducts : products;

    const sortedProducts = [...displayList].sort((a, b) => {
        const priceA = Number(a.price || a.product_price || 0);
        const priceB = Number(b.price || b.product_price || 0);
        if (sortBy === "low-high") return priceA - priceB;
        if (sortBy === "high-low") return priceB - priceA;
        return 0;
    });

    return (
        <div className="customer-category-catalog-container">
            <div className="catalog-breadcrumb-bar">
                <div className="cat-breadcrumb-links">
                    <Link to="/customer/dashboard">Dashboard</Link>
                    <span>/</span>
                    <Link to="/customer/categories">Categories</Link>
                    <span>/</span>
                    <span className="current-page">{activeCat.name || activeCat.categories_name || "Category"}</span>
                </div>
            </div>

            <div className="category-hero-card">
                <div className="hero-text-side">
                    <span className="hero-badge-tag">{activeCat.status_name || "Official Category"}</span>
                    <h2 className="hero-category-title">{activeCat.name || activeCat.categories_name || "Category Catalog"}</h2>
                    <p className="hero-category-desc">
                        {activeCat.description || "Discover verified quality items available in this category with real-time stock."}
                    </p>
                    <div className="hero-meta-stats">
                        <span className="meta-pill"><i className="bi bi-box-seam"></i> {filteredProducts.length} Items</span>
                        <span className="meta-pill"><i className="bi bi-truck"></i> Fast Delivery</span>
                        <span className="meta-pill"><i className="bi bi-shield-check"></i> 100% Genuine</span>
                    </div>
                </div>
                <div className="hero-image-side">
                    <img
                        src={activeCat.image || "/src/assets/icon.png"}
                        alt={activeCat.name || "Category"}
                        className="hero-cat-img"
                        onError={(e) => { e.target.src = "/src/assets/icon.png"; }}
                    />
                </div>
            </div>

            {categories.length > 0 && (
                <div className="category-switcher-pills">
                    {categories.map((cat) => {
                        const cId = cat.id || cat.categories_id;
                        const isMatch = String(cId) === String(activeCat.id || activeCat.categories_id);
                        return (
                            <Link
                                key={cId}
                                to={`/customer/category/${cId}`}
                                className={`switcher-pill-btn ${isMatch ? "active" : ""}`}
                            >
                                <i className={inferCategoryIcon(cat.name || cat.categories_name)}></i>
                                <span>{cat.name || cat.categories_name}</span>
                            </Link>
                        );
                    })}
                </div>
            )}

            <section className="catalog-products-section">
                <div className="catalog-section-header">
                    <div>
                        <h3 className="section-title">Products in {activeCat.name || activeCat.categories_name}</h3>
                        <p className="section-sub">Showing verified items with real-time stock</p>
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
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "240px" }}>
                        <LoadingSpinner message="Loading products..." />
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b" }}>
                        <i className="bi bi-box" style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}></i>
                        <p>No products found in this category.</p>
                    </div>
                ) : (
                    <div className="customer-products-grid">
                        {sortedProducts.map((prod) => (
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
            </section>
        </div>
    );
}
