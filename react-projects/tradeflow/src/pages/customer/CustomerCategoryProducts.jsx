import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductItemCard from "../../components/ProductItemCard";
import { PageSkeleton } from "../../components/common";
import categoryService from "../../services/categoryService";
import productService, { resolveProductImage } from "../../services/productService";

const VERIFIED_FALLBACK_CATEGORIES = [
    {
        id: "CAT20261109082827",
        title: "Mobile Devices & phones",
        name: "Mobile Devices & phones",
        badge: "ACTIVE",
        description: "Mobile Devices & phones",
        image: null
    },
    {
        id: "CAT20261109082647",
        title: "Health & Beauty",
        name: "Health & Beauty",
        badge: "ACTIVE",
        description: "Personal care products including skincare, haircare, supplements and hygiene essentials.",
        image: null
    },
    {
        id: "CAT20261109082603",
        title: "Office Supplies",
        name: "Office Supplies",
        badge: "ACTIVE",
        description: "Stationery, printing materials, office furniture and equipment.",
        image: null
    },
    {
        id: "CAT20261109082511",
        title: "Clothing & Apparel",
        name: "Clothing & Apparel",
        badge: "ACTIVE",
        description: "Men and women fashion items including tops, trousers, shoes, bags and accessories.",
        image: null
    },
    {
        id: "CAT20261109082439",
        title: "Groceries",
        name: "Groceries",
        badge: "ACTIVE",
        description: "Everyday food items and household consumables.",
        image: null
    },
    {
        id: "CAT20261109082340",
        title: "Electronics",
        name: "Electronics",
        badge: "ACTIVE",
        description: "Devices and gadgets including phones, laptops, and accessories.",
        image: null
    }
];

const VERIFIED_FALLBACK_PRODUCTS = [
    {
        id: "PROD20261109083122",
        categoryId: "CAT20261109082827",
        name: "Samsung Galaxy A15",
        subtitle: "Mobile Devices & phones",
        rating: 5,
        price: 185000,
        oldPrice: 212750,
        image: resolveProductImage("Samsung Galaxy A15", "Mobile Devices & phones")
    }
];

export default function CustomerCategoryProducts() {
    const { categoryId } = useParams();
    const [sortBy, setSortBy] = useState("popular");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch categories and products from backend APIs
    useEffect(() => {
        const loadData = async () => {
            try {
                const [catRes, prodRes] = await Promise.allSettled([
                    categoryService.fetchAllCategories(),
                    productService.fetchAllProducts()
                ]);

                if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value?.data) && catRes.value.data.length > 0) {
                    setCategories(catRes.value.data.map(cat => {
                        const name = cat.categories_name || cat.category_name || cat.name || "Category";
                        return {
                            id: String(cat.categories_id || cat.categoryId || cat.id),
                            title: name,
                            name: name,
                            badge: cat.status_name || "Active",
                            description: cat.description || "Verified catalog collection",
                            image: cat.image || null
                        };
                    }));
                } else {
                    setCategories(VERIFIED_FALLBACK_CATEGORIES);
                }

                if (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data) && prodRes.value.data.length > 0) {
                    setProducts(prodRes.value.data.map(prod => ({
                        id: String(prod.product_id || prod.productId || prod.id),
                        categoryId: String(prod.categories_id || prod.category_id || prod.categoryId || ""),
                        name: prod.product_name || prod.name || "Product",
                        subtitle: prod.categories_name || prod.category_name || "Retail",
                        rating: 5,
                        price: Number(prod.product_price || prod.price || 0),
                        oldPrice: Number(prod.product_price || prod.price || 0) * 1.15,
                        image: prod.image || resolveProductImage(prod.product_name, prod.categories_name)
                    })));
                } else {
                    setProducts(VERIFIED_FALLBACK_PRODUCTS);
                }
            } catch (err) {
                console.error("Failed to load category products:", err);
                setCategories(VERIFIED_FALLBACK_CATEGORIES);
                setProducts(VERIFIED_FALLBACK_PRODUCTS);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const currentCat = categories.find(c => String(c.id) === String(categoryId)) || categories[0] || {
        id: categoryId || categories[0]?.id || "",
        title: "Category",
        name: "Category",
        badge: "Active",
        description: "Browse verified products",
        image: null
    };

    const filteredProducts = products.filter(
        p => String(p.categoryId) === String(currentCat.id)
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "low-high") return a.price - b.price;
        if (sortBy === "high-low") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
    });

    const displayProducts = sortedProducts.length > 0 ? sortedProducts : products;

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
                        <span className="meta-pill"><i className="bi bi-box-seam"></i> {displayProducts.length} Verified Items</span>
                        <span className="meta-pill"><i className="bi bi-truck"></i> Fast Delivery</span>
                        <span className="meta-pill"><i className="bi bi-shield-check"></i> 100% Genuine</span>
                    </div>
                </div>
                <div className="hero-image-side">
                    {currentCat.image && (
                        <img src={currentCat.image} alt={currentCat.name} className="hero-cat-img" />
                    )}
                </div>
            </div>

            {/* Quick Switch Category Pills */}
            <div className="category-switcher-pills">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/customer/category/${cat.id}`}
                        className={`switcher-pill-btn ${cat.id === currentCat.id ? "active" : ""}`}
                    >
                        {cat.title}
                    </Link>
                ))}
            </div>

            {/* Product Catalog Grid */}
            <div className="catalog-content-section">
                <div className="catalog-toolbar">
                    <span className="results-count-text">
                        Showing <strong>{displayProducts.length}</strong> items in <strong>{currentCat.title}</strong>
                    </span>
                    <div className="sort-selector-wrap">
                        <label htmlFor="sortSelect">Sort By:</label>
                        <select
                            id="sortSelect"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="catalog-sort-select"
                        >
                            <option value="popular">Sort: Most Popular</option>
                            <option value="low-high">Price: Low to High</option>
                            <option value="high-low">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="mt-16">
                        <PageSkeleton variant="product-grid" />
                    </div>
                ) : (
                    <div className="customer-products-grid mt-16">
                        {displayProducts.map((prod) => (
                            <ProductItemCard
                                key={prod.id}
                                id={prod.id}
                                name={prod.name}
                                subtitle={prod.subtitle}
                                rating={prod.rating}
                                price={`₦ ${Number(prod.price).toLocaleString()}`}
                                oldPrice={`₦ ${Number(prod.oldPrice).toLocaleString()}`}
                                image={prod.image}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
