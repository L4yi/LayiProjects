import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerUserBanner from "../../components/CustomerUserBanner";
import CategoryCard from "../../components/CategoryCard";
import ProductItemCard from "../../components/ProductItemCard";
import categoryService from "../../services/categoryService";
import productService from "../../services/productService";

export default function CustomerDashboard() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch categories and products live from database
    useEffect(() => {
        const loadStorefrontData = async () => {
            try {
                const [catRes, prodRes] = await Promise.allSettled([
                    categoryService.fetchAllCategories(),
                    productService.fetchAllProducts()
                ]);

                if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value?.data)) {
                    setCategories(catRes.value.data.map(cat => ({
                        id: cat.categories_id || cat.categoryId || cat.id,
                        title: cat.category_name || cat.name || "Category",
                        badge: cat.status_name || "Active",
                        image: cat.image || null,
                        itemCount: 0
                    })));
                }

                if (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data)) {
                    setProducts(prodRes.value.data.map(prod => ({
                        id: prod.product_id || prod.productId || prod.id,
                        name: prod.product_name || prod.name || "Product",
                        subtitle: prod.category_name || "Retail",
                        rating: 5,
                        price: `₦ ${Number(prod.product_price || prod.price || 0).toLocaleString()}`,
                        oldPrice: `₦ ${(Number(prod.product_price || prod.price || 0) * 1.15).toLocaleString()}`,
                        image: prod.image || null
                    })));
                }
            } catch (err) {
                console.error("Failed to load storefront metrics:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadStorefrontData();
    }, []);

    return (
        <div className="customer-dashboard-container">
            {/* User Profile Banner */}
            <CustomerUserBanner
                buttonText="Make New Suggestion"
                buttonLink="/customer/categories"
            />

            {/* Product Categories Section */}
            <div className="customer-panel-card mt-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-grid-1x2-fill"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Product Categories</h2>
                            <p className="panel-subtitle">
                                Explore verified categories fetched directly from our catalog
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

                {/* Categories Grid from backend */}
                {isLoading ? (
                    <div style={{ padding: "30px", textAlign: "center", color: "#718096" }}>
                        Loading store categories...
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

            {/* Top Sales Products Section */}
            <div className="customer-panel-card mt-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-box-seam"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Top Sales Products</h2>
                            <p className="panel-subtitle">
                                Live products recorded in our inventory
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

                {/* Products Grid from backend */}
                {isLoading ? (
                    <div style={{ padding: "30px", textAlign: "center", color: "#718096" }}>
                        Loading catalog products...
                    </div>
                ) : (
                    <div className="customer-products-grid">
                        {products.map((prod) => (
                            <ProductItemCard
                                key={prod.id}
                                id={prod.id}
                                name={prod.name}
                                subtitle={prod.subtitle}
                                rating={prod.rating}
                                price={prod.price}
                                oldPrice={prod.oldPrice}
                                image={prod.image}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
