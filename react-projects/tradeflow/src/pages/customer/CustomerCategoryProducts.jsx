import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductItemCard from "../../components/ProductItemCard";
import { PageSkeleton } from "../../components/common";
import categoryService, { getStoredCategoryImage } from "../../services/categoryService";
import productService from "../../services/productService";

const VERIFIED_FALLBACK_CATEGORIES = [
    {
        id: "CAT20261109082827",
        title: "Mobile Devices & phones",
        name: "Mobile Devices & phones",
        badge: "ACTIVE",
        description: "Mobile Devices & phones",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
    },
    {
        id: "CAT20261109082647",
        title: "Health & Beauty",
        name: "Health & Beauty",
        badge: "ACTIVE",
        description: "Personal care products including skincare, haircare, supplements and hygiene essentials.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
    },
    {
        id: "CAT20261109082603",
        title: "Office Supplies",
        name: "Office Supplies",
        badge: "ACTIVE",
        description: "Stationery, printing materials, office furniture and equipment.",
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80"
    },
    {
        id: "CAT20261109082511",
        title: "Clothing & Apparel",
        name: "Clothing & Apparel",
        badge: "ACTIVE",
        description: "Men and women fashion items including tops, trousers, shoes, bags and accessories.",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
    },
    {
        id: "CAT20261109082439",
        title: "Groceries",
        name: "Groceries",
        badge: "ACTIVE",
        description: "Everyday food items and household consumables.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
    },
    {
        id: "CAT20261109082340",
        title: "Electronics",
        name: "Electronics",
        badge: "ACTIVE",
        description: "Devices and gadgets including phones, laptops, and accessories.",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
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
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
    }
];

export default function CustomerCategoryProducts() {
    const { categoryId } = useParams();
    const [sortBy, setSortBy] = useState("popular");
    const [searchKeyword, setSearchKeyword] = useState("");
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
                        const id = String(cat.categories_id || cat.categoryId || cat.id);
                        const name = cat.categories_name || cat.category_name || cat.name || "Category";
                        const storedImg = getStoredCategoryImage(id, name);
                        const finalImg = (cat.image_url || cat.image || cat.imageUrl || storedImg || "").trim();
                        return {
                            id,
                            title: name,
                            name,
                            badge: cat.status_name || "Active",
                            description: cat.description || "Verified catalog collection",
                            image: finalImg || null
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
                        image: prod.image || prod.imageUrl || prod.product_image || prod.productImage || prod.image_url || ""
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

    const cleanCategoryName = (currentCat.name || currentCat.title || "Category").trim();
    const cleanCategoryDesc = (currentCat.description || "").trim();
    const isDuplicateDesc = !cleanCategoryDesc || cleanCategoryDesc.toLowerCase() === cleanCategoryName.toLowerCase();
    const displayCategoryDesc = isDuplicateDesc
        ? `Explore verified products, official manufacturer warranties, and authentic catalog deals in ${cleanCategoryName}.`
        : cleanCategoryDesc;

    // Filter by category and search keyword
    const categoryMatchedProducts = products.filter(
        p => String(p.categoryId) === String(currentCat.id)
    );

    const baseProducts = categoryMatchedProducts.length > 0 ? categoryMatchedProducts : products;

    const searchedProducts = baseProducts.filter(p => {
        if (!searchKeyword.trim()) return true;
        const q = searchKeyword.trim().toLowerCase();
        return (
            (p.name || "").toLowerCase().includes(q) ||
            (p.subtitle || "").toLowerCase().includes(q)
        );
    });

    const displayProducts = [...searchedProducts].sort((a, b) => {
        if (sortBy === "low-high") return a.price - b.price;
        if (sortBy === "high-low") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
    });

    return (
        <div className="customer-category-catalog-container">
            {/* Breadcrumb Header */}
            <div className="catalog-breadcrumb-bar">
                <div className="cat-breadcrumb-links">
                    <Link to="/customer/dashboard">Dashboard</Link>
                    <span>/</span>
                    <Link to="/customer/categories">Categories</Link>
                    <span>/</span>
                    <span className="current-page">{cleanCategoryName}</span>
                </div>
            </div>

            {/* Category Hero Banner */}
            <div className="category-hero-card">
                <div className="hero-text-side">
                    <span className="hero-badge-tag">{currentCat.badge || "ACTIVE"}</span>
                    <h2 className="hero-category-title">{cleanCategoryName}</h2>
                    <p className="hero-category-desc">{displayCategoryDesc}</p>
                    <div className="hero-meta-stats">
                        <span className="meta-pill"><i className="bi bi-box-seam"></i> {displayProducts.length} Verified Items</span>
                        <span className="meta-pill"><i className="bi bi-truck"></i> Fast Delivery</span>
                        <span className="meta-pill"><i className="bi bi-shield-check"></i> 100% Genuine</span>
                    </div>
                </div>
                <div className="hero-image-side">
                    {currentCat.image && (
                        <img
                            src={currentCat.image}
                            alt={cleanCategoryName}
                            className="hero-cat-img"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
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
                        Showing <strong>{displayProducts.length}</strong> {displayProducts.length === 1 ? "item" : "items"} in <strong>{cleanCategoryName}</strong>
                    </span>
                    <div className="catalog-toolbar-actions">
                        <div className="cat-search-input-wrap">
                            <i className="bi bi-search cat-search-icon"></i>
                            <input
                                type="text"
                                placeholder={`Search in ${cleanCategoryName}...`}
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="cat-inpage-search-input"
                            />
                            {searchKeyword && (
                                <button
                                    type="button"
                                    className="cat-search-clear-btn"
                                    onClick={() => setSearchKeyword("")}
                                    title="Clear filter"
                                >
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                            )}
                        </div>
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
                </div>

                {isLoading ? (
                    <div className="mt-16">
                        <PageSkeleton variant="product-grid" />
                    </div>
                ) : displayProducts.length === 0 ? (
                    <div className="empty-catalog-state p-24 text-center bg-white rounded-12 mt-16 border border-slate-200">
                        <i className="bi bi-search text-slate-400 text-3xl mb-3 block"></i>
                        <h4 className="text-base font-semibold text-slate-700 mb-1">No products found</h4>
                        <p className="text-sm text-slate-500 mb-4">
                            No products in {cleanCategoryName} match "{searchKeyword}".
                        </p>
                        <button
                            type="button"
                            className="btn-action-primary px-4 py-2 text-sm"
                            onClick={() => setSearchKeyword("")}
                        >
                            Reset Search Filter
                        </button>
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
