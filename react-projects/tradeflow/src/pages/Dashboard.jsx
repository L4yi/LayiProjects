import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MetricCard, LoadingSpinner } from "../components/common";
import staffService from "../services/staffService";
import categoryService from "../services/categoryService";
import productService from "../services/productService";
import orderService from "../services/orderService";
import customerService from "../services/customerService";
import transactionService from "../services/transactionService";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        staffCount: 0,
        categoryCount: 0,
        productCount: 0,
        orderCount: 0,
        customerCount: 0,
        recentTransactions: [],
        topProducts: []
    });
    const [searchProd, setSearchProd] = useState("");

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const [staffRes, catRes, prodRes, ordRes, custRes, txnRes] = await Promise.allSettled([
                    staffService.fetchAllStaff(),
                    categoryService.fetchAllCategories(),
                    productService.fetchAllProducts(),
                    orderService.fetchAllOrders(),
                    customerService.fetchAllCustomers(),
                    transactionService.fetchAllTransactions()
                ]);

                const nextData = {
                    staffCount: (staffRes.status === "fulfilled" && staffRes.value?.success && Array.isArray(staffRes.value?.data))
                        ? staffRes.value.data.length
                        : 0,
                    categoryCount: (catRes.status === "fulfilled" && catRes.value?.success && Array.isArray(catRes.value?.data))
                        ? catRes.value.data.length
                        : 0,
                    productCount: (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data))
                        ? prodRes.value.data.length
                        : 0,
                    orderCount: (ordRes.status === "fulfilled" && ordRes.value?.success && Array.isArray(ordRes.value?.data))
                        ? ordRes.value.data.length
                        : 0,
                    customerCount: (custRes.status === "fulfilled" && custRes.value?.success && Array.isArray(custRes.value?.data))
                        ? custRes.value.data.length
                        : 0,
                    topProducts: (prodRes.status === "fulfilled" && prodRes.value?.success && Array.isArray(prodRes.value?.data))
                        ? prodRes.value.data.map(p => ({
                            id: p.product_id || p.productId,
                            name: p.product_name || p.productName,
                            code: p.product_id || p.productId,
                            price: p.product_price || p.productPrice,
                            img: p.image || null
                        }))
                        : [],
                    recentTransactions: (txnRes.status === "fulfilled" && txnRes.value?.success && Array.isArray(txnRes.value?.data))
                        ? txnRes.value.data.slice(0, 5).map(t => ({
                            id: t.id,
                            code: t.code,
                            date: t.date || "Recent",
                            status: t.status,
                            statusDot: t.status === "Refunded" ? "red" : "green",
                            amount: t.amount || 0
                        }))
                        : []
                };

                setDashboardData(nextData);
            } catch (e) {
                console.error("Dashboard metrics load error:", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const filteredProducts = dashboardData.topProducts.filter((prod) =>
        (prod.name || "").toLowerCase().includes(searchProd.toLowerCase()) ||
        (prod.code || "").toLowerCase().includes(searchProd.toLowerCase())
    );

    return (
        <div className="dashboard-body">
            {isLoading ? (
                <LoadingSpinner variant="dashboard" />
            ) : (
                <>
                    <div className="metric-cards-grid">
                        <MetricCard
                            title="Active Staff Members"
                            timeSubtitle="Staff Accounts"
                            statNumber={String(dashboardData.staffCount)}
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
                            statNumber={String(dashboardData.categoryCount)}
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
                                left: { label: "Products", value: String(dashboardData.productCount), sub: "In Catalog" },
                                right: { label: "Orders", value: String(dashboardData.orderCount), isNegative: false }
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

                            {dashboardData.recentTransactions.length === 0 ? (
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
                                            {dashboardData.recentTransactions.map((tx, idx) => (
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
