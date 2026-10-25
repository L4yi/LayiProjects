import React from "react";
import { Link } from "react-router-dom";
import CustomerUserBanner from "../../components/CustomerUserBanner";
import CategoryCard from "../../components/CategoryCard";
import ProductItemCard from "../../components/ProductItemCard";
import { STORE_CATEGORIES, STORE_PRODUCTS } from "../../data/storeData";

export default function CustomerDashboard() {
    return (
        <div className="customer-dashboard-container">
            {/* User Profile Banner matching Image 1 */}
            <CustomerUserBanner
                buttonText="Make New Suggestion"
                buttonLink="/customer/categories"
            />

            {/* Product Categories Section matching Image 1 & 2 */}
            <div className="customer-panel-card mt-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-grid-1x2-fill"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Product Categories</h2>
                            <p className="panel-subtitle">
                                Explore suggested product categories grouped with our top products
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

                {/* Compact 4-Column / Responsive Category Group Grid */}
                <div className="customer-categories-grid">
                    {STORE_CATEGORIES.map((cat) => (
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
            </div>

            {/* Top Sales Products Section matching Image 3 */}
            <div className="customer-panel-card mt-24">
                <div className="panel-card-header">
                    <div className="panel-title-group">
                        <div className="panel-accent-icon green-accent">
                            <i className="bi bi-box-seam"></i>
                        </div>
                        <div>
                            <h2 className="panel-title">Top Sales Products</h2>
                            <p className="panel-subtitle">
                                Most popular items ordered by customers this week
                            </p>
                        </div>
                    </div>

                    <div className="panel-header-actions">
                        <Link to="/customer/category/mobile-devices" className="btn-view-all-categories green-btn">
                            <span>See All Deals</span>
                            <i className="bi bi-chevron-right"></i>
                        </Link>
                    </div>
                </div>

                {/* Compact 4-Column / Responsive Products Grid */}
                <div className="customer-products-grid">
                    {STORE_PRODUCTS.map((prod) => (
                        <ProductItemCard
                            key={prod.id}
                            id={prod.id}
                            name={prod.name}
                            subtitle={prod.subtitle}
                            rating={prod.rating}
                            price={`₦ ${prod.price.toLocaleString()}`}
                            oldPrice={`₦ ${prod.oldPrice.toLocaleString()}`}
                            image={prod.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
