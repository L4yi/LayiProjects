import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductItemCard from "../../components/ProductItemCard";
import { PageSkeleton } from "../../components/common";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

export default function CustomerProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("featured");

    // Sync search query whenever URL search params change
    useEffect(() => {
        const urlSearch = searchParams.get("search");
        if (urlSearch !== null) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                const [prodRes, catRes] = await Promise.allSettled([
                    productService.fetchAllProducts(),
                    categoryService.fetchAllCategories()
                ]);

                if (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data)) {
                    setProducts(prodRes.value.data.map(p => {
                        const directImg = p.image || p.imageUrl || p.product_image || p.productImage || p.image_url;
                        const priceNum = Number(p.product_price || p.price || 0);
                        return {
                            id: String(p.product_id || p.productId || p.id),
                            name: p.product_name || p.name || "Product",
                            categoryId: String(p.categories_id || p.category_id || p.categoryId || ""),
                            categoryName: p.categories_name || p.category_name || "Catalog",
                            priceNum,
                            price: `₦ ${priceNum.toLocaleString()}`,
                            oldPrice: priceNum > 0 ? `₦ ${Math.round(priceNum * 1.15).toLocaleString()}` : "",
                            rating: 5,
                            reviewsCount: 12,
                            image: directImg || "",
                            badge: "In Stock"
                        };
                    }));
                }

                if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value?.data)) {
                    setCategories(catRes.value.data.map(c => ({
                        id: String(c.categories_id || c.categoryId || c.id),
                        name: c.categories_name || c.category_name || c.name || "Category"
                    })));
                }
            } catch (err) {
                console.error("Failed to load products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCatalog();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by category
        if (selectedCategory !== "all") {
            result = result.filter(p => p.categoryId === selectedCategory || p.categoryName.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.categoryName.toLowerCase().includes(q)
            );
        }

        // Sort
        if (sortBy === "price_asc") {
            result.sort((a, b) => a.priceNum - b.priceNum);
        } else if (sortBy === "price_desc") {
            result.sort((a, b) => b.priceNum - a.priceNum);
        } else if (sortBy === "name_asc") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [products, selectedCategory, searchQuery, sortBy]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSortBy("featured");
        setSearchParams({});
    };

    return (
        <div className="customer-page-container">
            {/* Breadcrumb Navigation */}
            <div className="product-breadcrumb-bar">
                <Link to="/customer/dashboard">Home</Link>
                <span>&gt;</span>
                <span className="current-crumb">All Products</span>
            </div>

            {/* Header & Controls Card */}
            <div className="customer-panel-card">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-box-seam"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Explore All Products</h2>
                            <p className="panel-subtitle">
                                Browse {products.length} live product{products.length === 1 ? "" : "s"} across all catalog categories
                            </p>
                        </div>
                    </div>

                    <div className="catalog-search-sort-group">
                        <div className="catalog-search-wrap">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="catalog-search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="clear-search-btn"
                                    onClick={() => setSearchQuery("")}
                                    title="Clear search"
                                >
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                            )}
                        </div>

                        <div className="catalog-sort-wrap">
                            <label htmlFor="catalogSortSelect">Sort by:</label>
                            <select
                                id="catalogSortSelect"
                                className="catalog-sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Category Filter Pills Bar */}
                <div className="category-pills-filter-bar">
                    <button
                        type="button"
                        className={`cat-pill-btn ${selectedCategory === "all" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("all")}
                    >
                        <span>All Products</span>
                        <span className="pill-count">({products.length})</span>
                    </button>
                    {categories.map((cat) => {
                        const count = products.filter(p => p.categoryId === cat.id).length;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                className={`cat-pill-btn ${selectedCategory === cat.id ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <span>{cat.name}</span>
                                {count > 0 && <span className="pill-count">({count})</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <PageSkeleton variant="product-grid" />
                ) : filteredProducts.length > 0 ? (
                    <div className="customer-products-grid">
                        {filteredProducts.map((prod) => (
                            <ProductItemCard
                                key={prod.id}
                                id={prod.id}
                                name={prod.name}
                                subtitle={prod.categoryName}
                                rating={prod.rating}
                                price={prod.price}
                                oldPrice={prod.oldPrice}
                                image={prod.image}
                                badge={prod.badge}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="no-products-state">
                        <div className="no-products-icon">
                            <i className="bi bi-search"></i>
                        </div>
                        <h3>No matching products found</h3>
                        <p>We couldn't find any products matching your current filters or search term.</p>
                        <button
                            type="button"
                            className="btn-reset-filters"
                            onClick={handleClearFilters}
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
