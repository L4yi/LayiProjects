import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MetricCard } from "../components/common";
import iphoneImg from "../assets/all-images/product-images/iphone-13.png";
import jordanImg from "../assets/all-images/product-images/nike-air-jordan.png";
import tshirtImg from "../assets/all-images/product-images/tshirt.png";
import bagImg from "../assets/all-images/product-images/cross-bag.png";

const RECENT_TRANSACTIONS = [
    { no: "1.", id: "#6545", date: "01 Oct | 11:29 am", status: "Paid", statusDot: "green", amount: "$64" },
    { no: "2.", id: "#5412", date: "01 Oct | 11:29 am", status: "Pending", statusDot: "yellow", amount: "$557" },
    { no: "3.", id: "#6622", date: "01 Oct | 11:29 am", status: "Paid", statusDot: "green", amount: "$156" },
    { no: "4.", id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", statusDot: "green", amount: "$265" },
    { no: "5.", id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", statusDot: "green", amount: "$265" },
];

const TOP_PRODUCTS = [
    { id: 1, img: iphoneImg, name: "Apple iPhone 13", code: "Item: #FXZ-4567", price: "$999.00" },
    { id: 2, img: jordanImg, name: "Nike Air Jordan", code: "Item: #FXZ-4567", price: "$72.40" },
    { id: 3, img: tshirtImg, name: "T-shirt", code: "Item: #FXZ-4567", price: "$35.40" },
    { id: 4, img: bagImg, name: "Assorted Cross Bag", code: "Item: #FXZ-4567", price: "$80.00" },
];

export default function Dashboard() {
    const [searchProd, setSearchProd] = useState("");

    const filteredProducts = TOP_PRODUCTS.filter((prod) =>
        prod.name.toLowerCase().includes(searchProd.toLowerCase()) ||
        prod.code.toLowerCase().includes(searchProd.toLowerCase())
    );

    return (
        <div className="dashboard-body">
            {/* Reusable Metric Cards Grid */}
            <div className="metric-cards-grid">
                <MetricCard
                    title="Total Sales"
                    timeSubtitle="Last 7 days"
                    statNumber="$350K"
                    statTag="Sales"
                    trend="10.4%"
                    trendUp={true}
                    compareText="Previous 7days"
                    compareVal="$235"
                    detailsLink="/transactions"
                />

                <MetricCard
                    title="Total Orders"
                    timeSubtitle="Last 7 days"
                    statNumber="10.7K"
                    statTag="order"
                    trend="14.4%"
                    trendUp={true}
                    compareText="Previous 7days"
                    compareVal="7.6k"
                    detailsLink="/orders"
                />

                <MetricCard
                    title="Pending & Canceled"
                    timeSubtitle="Last 7 days"
                    isSplit={true}
                    splitData={{
                        left: { label: "Pending", value: "509", sub: "user 204" },
                        right: { label: "Canceled", value: "94", trend: "14.4%", isNegative: true }
                    }}
                    detailsLink="/orders"
                />
            </div>

            {/* Main Content Grid: Transactions & Top Products */}
            <div className="dashboard-main-grid">
                {/* Transaction Card */}
                <div className="dashboard-card transaction-card">
                    <div className="dash-card-header">
                        <h3 className="dash-card-title">Transaction</h3>
                        <button type="button" className="btn-filter-solid">
                            <i className="bi bi-filter"></i>
                            <span>Filter</span>
                        </button>
                    </div>

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
                                {RECENT_TRANSACTIONS.map((tx) => (
                                    <tr key={tx.no}>
                                        <td className="col-no">{tx.no}</td>
                                        <td className="col-cust-id">{tx.id}</td>
                                        <td className="col-date">{tx.date}</td>
                                        <td>
                                            <div className="dash-status-dot-cell">
                                                <span className={`status-dot ${tx.statusDot}`}></span>
                                                <span>{tx.status}</span>
                                            </div>
                                        </td>
                                        <td className="col-dash-amt">{tx.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="dash-card-footer">
                        <Link to="/transactions" className="card-outline-btn">
                            Details
                        </Link>
                    </div>
                </div>

                {/* Top Products Card */}
                <div className="dashboard-card top-products-card">
                    <div className="dash-card-header">
                        <h3 className="dash-card-title">Top Products</h3>
                        <Link to="/products" className="link-all-product">
                            All product
                        </Link>
                    </div>

                    <div className="top-prod-search-wrap">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            className="top-prod-search-input"
                            placeholder="Search"
                            value={searchProd}
                            onChange={(e) => setSearchProd(e.target.value)}
                        />
                    </div>

                    <div className="top-products-list">
                        {filteredProducts.map((prod) => (
                            <div key={prod.id} className="top-prod-item">
                                <div className="prod-left">
                                    <img src={prod.img} alt={prod.name} className="top-prod-img" />
                                    <div className="prod-text">
                                        <span className="prod-name">{prod.name}</span>
                                        <span className="prod-item-code">{prod.code}</span>
                                    </div>
                                </div>
                                <span className="prod-price">{prod.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
