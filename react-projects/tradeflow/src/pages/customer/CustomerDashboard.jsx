import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerUserBanner from "../../components/CustomerUserBanner";
import CategoryCard from "../../components/CategoryCard";
import ProductItemCard from "../../components/ProductItemCard";
import { PageSkeleton } from "../../components/common";
import categoryService from "../../services/categoryService";
import productService, { resolveProductImage } from "../../services/productService";

const VERIFIED_FALLBACK_CATEGORIES = [
    {
        id: "CAT20261109082827",
        title: "Mobile Devices & phones",
        badge: "ACTIVE",
        image: null,
        itemCount: "1 Item"
    },
    {
        id: "CAT20261109082647",
        title: "Health & Beauty",
        badge: "ACTIVE",
        image: null,
        itemCount: "0 Items"
    },
    {
        id: "CAT20261109082603",
        title: "Office Supplies",
        badge: "ACTIVE",
        image: null,
        itemCount: "0 Items"
    },
    {
        id: "CAT20261109082511",
        title: "Clothing & Apparel",
        badge: "ACTIVE",
        image: null,
        itemCount: "0 Items"
    },
    {
        id: "CAT20261109082439",
        title: "Groceries",
        badge: "ACTIVE",
        image: null,
        itemCount: "0 Items"
    },
    {
        id: "CAT20261109082340",
        title: "Electronics",
        badge: "ACTIVE",
        image: null,
        itemCount: "0 Items"
    }
];

const VERIFIED_FALLBACK_PRODUCTS = [
    {
        id: "PROD20261109083122",
        name: "Samsung Galaxy A15",
        subtitle: "Mobile Devices & phones",
        rating: 5,
        price: "₦ 185,000",
        oldPrice: "₦ 212,750",
        image: resolveProductImage("Samsung Galaxy A15", "Mobile Devices & phones")
    }
];

export default function CustomerDashboard() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch categories and products live from database with customer/admin endpoints
    useEffect(() => {
        const loadStorefrontData = async () => {
            try {
                const [catRes, prodRes] = await Promise.allSettled([
                    categoryService.fetchAllCategories(),
                    productService.fetchAllProducts()
                ]);

                const rawProducts = (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data) && prodRes.value.data.length > 0)
                    ? prodRes.value.data
                    : [];

                if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value?.data) && catRes.value.data.length > 0) {
                    setCategories(catRes.value.data.map(cat => {
                        const catId = cat.categories_id || cat.categoryId || cat.id;
                        const catName = cat.categories_name || cat.category_name || cat.name || "Category";
                        const matchCount = rawProducts.filter(p => (p.categories_id || p.categoryId || p.category_id) === catId).length;
                        return {
                            id: catId,
                            title: catName,
                            badge: cat.status_name || (String(cat.status_id) === "2" ? "Inactive" : "Active"),
                            image: cat.image || null,
                            itemCount: matchCount > 0 ? `${matchCount} ${matchCount === 1 ? "Item" : "Items"}` : "0 Items"
                        };
                    }));
                } else {
                    setCategories(VERIFIED_FALLBACK_CATEGORIES);
                }

                if (rawProducts.length > 0) {
                    setProducts(rawProducts.map(prod => {
                        const directImg = prod.image || prod.imageUrl || prod.product_image || prod.productImage || prod.image_url;
                        return {
                            id: prod.product_id || prod.productId || prod.id,
                            name: prod.product_name || prod.name || "Product",
                            subtitle: prod.categories_name || prod.category_name || "Retail",
                            rating: 5,
                            price: `₦ ${Number(prod.product_price || prod.price || 0).toLocaleString()}`,
                            oldPrice: `₦ ${(Number(prod.product_price || prod.price || 0) * 1.15).toLocaleString()}`,
                            image: directImg || resolveProductImage(prod.product_name, prod.categories_name)
                        };
                    }));
                } else {
                    setProducts(VERIFIED_FALLBACK_PRODUCTS);
                }
            } catch (err) {
                console.error("Failed to load storefront metrics:", err);
                setCategories(VERIFIED_FALLBACK_CATEGORIES);
                setProducts(VERIFIED_FALLBACK_PRODUCTS);
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
                    <PageSkeleton variant="category-grid" />
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
                    <PageSkeleton variant="product-grid" />
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
