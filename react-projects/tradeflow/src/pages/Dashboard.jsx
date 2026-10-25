import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MetricCard, LoadingSpinner } from "../components/common";
import staffService from "../services/staffService";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import orderService from "../services/orderService";
import customerService from "../services/customerService";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [staffCount, setStaffCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [searchProd, setSearchProd] = useState("");

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const [staffRes, catRes, prodRes, ordRes, custRes] = await Promise.allSettled([
                    staffService.fetchAllStaff(),
                    categoryService.fetchAllCategories(),
                    productService.fetchAllProducts(),
                    orderService.fetchAllOrders(),
                    customerService.fetchAllCustomers()
                ]);

                if (staffRes.status === "fulfilled" && staffRes.value?.success && Array.isArray(staffRes.value?.data)) {
                    setStaffCount(staffRes.value.data.length);
                }

                if (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value?.data)) {
                    setCategoryCount(catRes.value.data.length);
                }

                if (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data)) {
                    setProductCount(prodRes.value.data.length);
                    const mapped = prodRes.value.data.map(p => ({
                        id: p.product_id || p.productId,
                        name: p.product_name || p.productName,
                        code: p.product_id || p.productId,
                        price: p.product_price || p.productPrice,
                        img: p.image || null
                    }));
                    setTopProducts(mapped);
                }

                if (ordRes.status === "fulfilled" && ordRes.value?.success && Array.isArray(ordRes.value?.data)) {
                    setOrderCount(ordRes.value.data.length);
                    const mappedTxns = ordRes.value.data.slice(0, 5).map(o => ({
                        id: o.id || o.code,
                        code: o.code || `#ORD-${o.id}`,
                        date: o.date || "Recent",
                        status: o.status || "Paid",
                        statusDot: (o.status || "").toLowerCase().includes("fail") ? "red" : (o.status || "").toLowerCase().includes("pend") ? "yellow" : "green",
                        amount: o.price || o.amount || 0
                    }));
                    setRecentTransactions(mappedTxns);
                }

                if (custRes.status === "fulfilled" && custRes.value?.success && Array.isArray(custRes.value?.data)) {
                    setCustomerCount(custRes.value.data.length);
                }
            } catch (e) {
                console.error("Dashboard metrics load error:", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const filteredProducts = topProducts.filter((prod) =>
        (prod.name || "").toLowerCase().includes(searchProd.toLowerCase()) ||
        (prod.code || "").toLowerCase().includes(searchProd.toLowerCase())
    );

    return (
        <div className="dashboard-body">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="metric-cards-grid">
                        <MetricCard
                            title="Active Staff Members"
                            timeSubtitle="Staff Accounts"
                            statNumber={String(staffCount)}
                            statTag="Staff"
                            trend="Live"
                            trendUp={true}
                            compareText="TradeFlow Admin"
                            compareVal="Active"
                            detailsLink="/staffs"
                        />

                        <MetricCard
                            title="Product Categories"
                            timeSubtitle="Configured taxonomies"
                            statNumber={String(categoryCount)}
                            statTag="Categories"
                            trend="Live"
                            trendUp={true}
                            compareText="Catalog Scope"
                            compareVal="Active"
                            detailsLink="/categories"
                        />

                        <MetricCard
                            title="Catalog & Inventory"
                            timeSubtitle="Live products recorded"
                            isSplit={true}
                            splitData={{
                                left: { label: "Products", value: String(productCount), sub: "In Catalog" },
                                right: { label: "Orders", value: String(orderCount), isNegative: false }
                            }}
                            detailsLink="/products"
                        />
                    </div>

                    <div className="dashboard-main-grid">
                        <div className="dashboard-card transaction-card">
                            <div className="dash-card-header">
                                <h3 className="dash-card-title">Recent Transactions</h3>
                                <Link to="/transactions" className="btn-filter-solid" style={{ textDecoration: "none" }}>
                                    <i className="bi bi-arrow-right"></i>
                                    <span>View All</span>
                                </Link>
                            </div>

                            {recentTransactions.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "50px 20px", color: "#718096" }}>
                                    <i className="bi bi-credit-card-2-front" style={{ fontSize: "2.2rem", color: "#cbd5e1", display: "block", marginBottom: "10px" }}></i>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#2d3748" }}>No recent transactions recorded</p>
                                    <span style={{ fontSize: "0.85rem", color: "#a0aec0" }}>Live customer payment receipts will appear here automatically.</span>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="solara-dash-table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Customer ID</th>
                                                <th>Order Date</th>
                                                <th>Status</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTransactions.map((tx, idx) => (
                                                <tr key={tx.id || idx}>
                                                    <td className="col-no">{idx + 1}</td>
                                                    <td className="col-cust-id">{tx.code || tx.id}</td>
                                                    <td className="col-date">{tx.date}</td>
                                                    <td>
                                                        <div className="dash-status-dot-cell">
                                                            <span className={`status-dot ${tx.statusDot || "green"}`}></span>
                                                            <span>{tx.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="col-dash-amt">₦ {Number(tx.amount || 0).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="dash-card-footer">
                                <Link to="/transactions" className="card-outline-btn">
                                    Transaction Logs
                                </Link>
                            </div>
                        </div>

                        <div className="dashboard-card top-products-card">
                            <div className="dash-card-header">
                                <h3 className="dash-card-title">Top Products</h3>
                                <Link to="/products" className="link-all-product">
                                    All products
                                </Link>
                            </div>

                            <div className="top-prod-search-wrap">
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="top-prod-search-input"
                                    placeholder="Search catalog..."
                                    value={searchProd}
                                    onChange={(e) => setSearchProd(e.target.value)}
                                />
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "50px 20px", color: "#718096" }}>
                                    <i className="bi bi-box-seam" style={{ fontSize: "2.2rem", color: "#cbd5e1", display: "block", marginBottom: "10px" }}></i>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#2d3748" }}>No products cataloged yet</p>
                                    <span style={{ fontSize: "0.85rem", color: "#a0aec0" }}>Products registered in inventory will display here.</span>
                                </div>
                            ) : (
                                <div className="top-products-list">
                                    {filteredProducts.map((prod) => (
                                        <div key={prod.id} className="top-prod-item">
                                            <div className="prod-left">
                                                {prod.img ? (
                                                    <img src={prod.img} alt={prod.name} className="top-prod-img" />
                                                ) : (
                                                    <div style={{ width: "38px", height: "38px", borderRadius: "6px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                                                        <i className="bi bi-box"></i>
                                                    </div>
                                                )}
                                                <div className="prod-text">
                                                    <span className="prod-name">{prod.name}</span>
                                                    <span className="prod-item-code">{prod.code}</span>
                                                </div>
                                            </div>
                                            <span className="prod-price">₦ {Number(prod.price || 0).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
