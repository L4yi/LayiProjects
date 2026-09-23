import { Link } from "react-router-dom";
import iphoneImg from "../assets/all-images/product-images/iphone-13.png";
import jordanImg from "../assets/all-images/product-images/nike-air-jordan.png";
import tshirtImg from "../assets/all-images/product-images/tshirt.png";
import bagImg from "../assets/all-images/product-images/cross-bag.png";

export default function Dashboard() {
    return (
        <>
            <div className="dashboard-body">
                <div className="metric-cards-grid">
                    <div className="metric-card">
                        <div className="card-top">
                            <div className="title-group">
                                <h3>Total Sales</h3>
                                <span className="time-subtitle">Last 7 days</span>
                            </div>
                            <button type="button" className="menu-dots-btn">
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                        </div>

                        <div className="stat-row">
                            <span className="stat-number">$350K</span>
                            <span className="stat-tag">Sales</span>
                            <span className="trend-badge trend-up">
                                <i className="bi bi-arrow-up-short"></i> 10.4%
                            </span>
                        </div>

                        <div className="card-bottom">
                            <span className="compare-text">
                                Previous 7days <span className="val-blue">($235)</span>
                            </span>
                            <Link to="/transactions" className="card-outline-btn">
                                Details
                            </Link>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="card-top">
                            <div className="title-group">
                                <h3>Total Orders</h3>
                                <span className="time-subtitle">Last 7 days</span>
                            </div>
                            <button type="button" className="menu-dots-btn">
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                        </div>

                        <div className="stat-row">
                            <span className="stat-number">10.7K</span>
                            <span className="stat-tag">order</span>
                            <span className="trend-badge trend-up">
                                <i className="bi bi-arrow-up-short"></i> 14.4%
                            </span>
                        </div>

                        <div className="card-bottom">
                            <span className="compare-text">
                                Previous 7days <span className="val-blue">(7.6k)</span>
                            </span>
                            <Link to="/orders" className="card-outline-btn">
                                Details
                            </Link>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="card-top">
                            <div className="title-group">
                                <h3>Pending &amp; Canceled</h3>
                                <span className="time-subtitle">Last 7 days</span>
                            </div>
                            <button type="button" className="menu-dots-btn">
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>
                        </div>

                        <div className="pending-canceled-row">
                            <div className="split-col">
                                <span className="col-label">Pending</span>
                                <div className="stat-val-group">
                                    <span className="val-num">509</span>
                                    <span className="sub-user-tag">user 204</span>
                                </div>
                            </div>
                            <div className="split-divider"></div>
                            <div className="split-col">
                                <span className="col-label">Canceled</span>
                                <div className="stat-val-group">
                                    <span className="val-num val-red">94</span>
                                    <span className="trend-red">
                                        <i className="bi bi-arrow-down-short"></i> 14.4%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="card-bottom justify-end">
                            <Link to="/orders" className="card-outline-btn">
                                Details
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main-grid">
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
                                    <tr>
                                        <td className="col-no">1.</td>
                                        <td className="col-cust-id">#6545</td>
                                        <td className="col-date">01 Oct | 11:29 am</td>
                                        <td>
                                            <div className="dash-status-dot-cell">
                                                <span className="status-dot green"></span>
                                                <span>Paid</span>
                                            </div>
                                        </td>
                                        <td className="col-dash-amt">$64</td>
                                    </tr>
                                    <tr>
                                        <td className="col-no">2.</td>
                                        <td className="col-cust-id">#5412</td>
                                        <td className="col-date">01 Oct | 11:29 am</td>
                                        <td>
                                            <div className="dash-status-dot-cell">
                                                <span className="status-dot yellow"></span>
                                                <span>Pending</span>
                                            </div>
                                        </td>
                                        <td className="col-dash-amt">$557</td>
                                    </tr>
                                    <tr>
                                        <td className="col-no">3.</td>
                                        <td className="col-cust-id">#6622</td>
                                        <td className="col-date">01 Oct | 11:29 am</td>
                                        <td>
                                            <div className="dash-status-dot-cell">
                                                <span className="status-dot green"></span>
                                                <span>Paid</span>
                                            </div>
                                        </td>
                                        <td className="col-dash-amt">$156</td>
                                    </tr>
                                    <tr>
                                        <td className="col-no">4.</td>
                                        <td className="col-cust-id">#6462</td>
                                        <td className="col-date">01 Oct | 11:29 am</td>
                                        <td>
                                            <div className="dash-status-dot-cell">
                                                <span className="status-dot green"></span>
                                                <span>Paid</span>
                                            </div>
                                        </td>
                                        <td className="col-dash-amt">$265</td>
                                    </tr>
                                    <tr>
                                        <td className="col-no">5.</td>
                                        <td className="col-cust-id">#6462</td>
                                        <td className="col-date">01 Oct | 11:29 am</td>
                                        <td>
                                            <div className="dash-status-dot-cell">
                                                <span className="status-dot green"></span>
                                                <span>Paid</span>
                                            </div>
                                        </td>
                                        <td className="col-dash-amt">$265</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="dash-card-footer">
                            <Link to="/transactions" className="card-outline-btn">
                                Details
                            </Link>
                        </div>
                    </div>

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
                            />
                        </div>

                        <div className="top-products-list">
                            <div className="top-prod-item">
                                <div className="prod-left">
                                    <img src={iphoneImg} alt="Apple iPhone 13" className="top-prod-img" />
                                    <div className="prod-text">
                                        <span className="prod-name">Apple iPhone 13</span>
                                        <span className="prod-item-code">Item: #FXZ-4567</span>
                                    </div>
                                </div>
                                <span className="prod-price">$999.00</span>
                            </div>

                            <div className="top-prod-item">
                                <div className="prod-left">
                                    <img src={jordanImg} alt="Nike Air Jordan" className="top-prod-img" />
                                    <div className="prod-text">
                                        <span className="prod-name">Nike Air Jordan</span>
                                        <span className="prod-item-code">Item: #FXZ-4567</span>
                                    </div>
                                </div>
                                <span className="prod-price">$72.40</span>
                            </div>

                            <div className="top-prod-item">
                                <div className="prod-left">
                                    <img src={tshirtImg} alt="T-shirt" className="top-prod-img" />
                                    <div className="prod-text">
                                        <span className="prod-name">T-shirt</span>
                                        <span className="prod-item-code">Item: #FXZ-4567</span>
                                    </div>
                                </div>
                                <span className="prod-price">$35.40</span>
                            </div>

                            <div className="top-prod-item">
                                <div className="prod-left">
                                    <img src={bagImg} alt="Assorted Cross Bag" className="top-prod-img" />
                                    <div className="prod-text">
                                        <span className="prod-name">Assorted Cross Bag</span>
                                        <span className="prod-item-code">Item: #FXZ-4567</span>
                                    </div>
                                </div>
                                <span className="prod-price">$80.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
