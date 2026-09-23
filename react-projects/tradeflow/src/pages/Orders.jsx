import React from "react";

export default function Orders() {
    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-cart-check"></i>
                        <span>Orders</span>
                    </div>
                    <div className="module-breadcrumb">
                        Sales &rarr; Track order fulfillment, customer requests, and items.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Orders</h2>
                        <span className="module-count-subtitle">18 customer orders</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select className="filter-dropdown-select" title="Filter by Status" defaultValue="">
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <button type="button" className="btn-add-entity">
                            <i className="bi bi-plus-lg"></i> New Order
                        </button>
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Order ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Customer Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Product Name &amp; ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="col-sn">1</td>
                                    <td className="col-order-id">#ORD-9821</td>
                                    <td><strong>Alexander Wright</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Apple iPhone 13 Pro</span>
                                            <span className="prod-id">Product ID: #PRD-001</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">2</td>
                                    <td className="col-order-id">#ORD-9822</td>
                                    <td><strong>Sophia Martinez</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Nike Air Jordan High</span>
                                            <span className="prod-id">Product ID: #PRD-002</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">3</td>
                                    <td className="col-order-id">#ORD-9823</td>
                                    <td><strong>Daniel Sterling</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Classic Cotton T-Shirt</span>
                                            <span className="prod-id">Product ID: #PRD-003</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">4</td>
                                    <td className="col-order-id">#ORD-9824</td>
                                    <td><strong>Olivia Chen</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Assorted Leather Cross Bag</span>
                                            <span className="prod-id">Product ID: #PRD-004</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">5</td>
                                    <td className="col-order-id">#ORD-9825</td>
                                    <td><strong>Marcus Johnson</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Smart Fitness Tracker Band</span>
                                            <span className="prod-id">Product ID: #PRD-005</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">6</td>
                                    <td className="col-order-id">#ORD-9826</td>
                                    <td><strong>Emma Richardson</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Noise Canceling Headphones</span>
                                            <span className="prod-id">Product ID: #PRD-006</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">7</td>
                                    <td className="col-order-id">#ORD-9827</td>
                                    <td><strong>Lucas Taylor</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Ultra HD 4K Smart TV</span>
                                            <span className="prod-id">Product ID: #PRD-007</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">8</td>
                                    <td className="col-order-id">#ORD-9828</td>
                                    <td><strong>Amelia Brown</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Ergonomic Office Chair</span>
                                            <span className="prod-id">Product ID: #PRD-008</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">9</td>
                                    <td className="col-order-id">#ORD-9829</td>
                                    <td><strong>Noah Henderson</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Mechanical Gaming Keyboard</span>
                                            <span className="prod-id">Product ID: #PRD-009</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">10</td>
                                    <td className="col-order-id">#ORD-9830</td>
                                    <td><strong>Isabella Garcia</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Wireless Bluetooth Speaker</span>
                                            <span className="prod-id">Product ID: #PRD-010</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">11</td>
                                    <td className="col-order-id">#ORD-9831</td>
                                    <td><strong>Ethan Walker</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Stainless Steel Water Bottle</span>
                                            <span className="prod-id">Product ID: #PRD-011</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">12</td>
                                    <td className="col-order-id">#ORD-9832</td>
                                    <td><strong>Mia Adams</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Designer Polarized Sunglasses</span>
                                            <span className="prod-id">Product ID: #PRD-012</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">13</td>
                                    <td className="col-order-id">#ORD-9833</td>
                                    <td><strong>Benjamin Scott</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Automatic Espresso Coffee Maker</span>
                                            <span className="prod-id">Product ID: #PRD-013</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">14</td>
                                    <td className="col-order-id">#ORD-9834</td>
                                    <td><strong>Charlotte Evans</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Professional DSLR Camera</span>
                                            <span className="prod-id">Product ID: #PRD-014</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">15</td>
                                    <td className="col-order-id">#ORD-9835</td>
                                    <td><strong>Henry Collins</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Compact Portable Power Bank</span>
                                            <span className="prod-id">Product ID: #PRD-015</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">16</td>
                                    <td className="col-order-id">#ORD-9836</td>
                                    <td><strong>Ava Morgan</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Apple iPhone 13 Pro</span>
                                            <span className="prod-id">Product ID: #PRD-001</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">17</td>
                                    <td className="col-order-id">#ORD-9837</td>
                                    <td><strong>Jack Campbell</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Nike Air Jordan High</span>
                                            <span className="prod-id">Product ID: #PRD-002</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill active">Done</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">18</td>
                                    <td className="col-order-id">#ORD-9838</td>
                                    <td><strong>Chloe Mitchell</strong></td>
                                    <td>
                                        <div className="order-product-cell">
                                            <span className="prod-name">Classic Cotton T-Shirt</span>
                                            <span className="prod-id">Product ID: #PRD-003</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge-pill progress">In Progress</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
