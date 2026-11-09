import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import { PageSkeleton } from "../../components/common";
import categoryService from "../../services/categoryService";
import productService from "../../services/productService";

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

export default function CustomerCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch categories directly from backend database
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const [catRes, prodRes] = await Promise.allSettled([
                    categoryService.fetchAllCategories(),
                    productService.fetchAllProducts()
                ]);

                const rawProducts = (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data))
                    ? prodRes.value.data
                    : [];

                if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value?.data) && catRes.value.data.length > 0) {
                    const mapped = catRes.value.data.map((cat) => {
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
                    });
                    setCategories(mapped);
                } else {
                    setCategories(VERIFIED_FALLBACK_CATEGORIES);
                }
            } catch (err) {
                console.error("Failed to load store categories:", err);
                setCategories(VERIFIED_FALLBACK_CATEGORIES);
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
        </div>
    );
}
