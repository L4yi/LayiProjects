import React from "react";

export default function Customers() {
    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-people"></i>
                        <span>Customers</span>
                    </div>
                    <div className="module-breadcrumb">
                        Users &rarr; View customer accounts, activity logs, and status.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Customers</h2>
                        <span className="module-count-subtitle">25 registered customers</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select className="filter-dropdown-select" title="Filter by Status" defaultValue="">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        <button type="button" className="btn-add-entity">
                            <i className="bi bi-plus-lg"></i> Add Customer
                        </button>
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Email Address <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Last Login <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-forest">AW</div>
                                            <span className="cust-text">Alexander Wright</span>
                                        </div>
                                    </td>
                                    <td>alexander.w@example.com</td>
                                    <td>2026-09-02 08:30 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-pine">SM</div>
                                            <span className="cust-text">Sophia Martinez</span>
                                        </div>
                                    </td>
                                    <td>sophia.m@example.com</td>
                                    <td>2026-09-01 04:15 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-emerald">DS</div>
                                            <span className="cust-text">Daniel Sterling</span>
                                        </div>
                                    </td>
                                    <td>daniel.s@example.com</td>
                                    <td>2026-08-28 11:20 AM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-moss">OC</div>
                                            <span className="cust-text">Olivia Chen</span>
                                        </div>
                                    </td>
                                    <td>olivia.c@example.com</td>
                                    <td>2026-08-31 02:40 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-sage">MJ</div>
                                            <span className="cust-text">Marcus Johnson</span>
                                        </div>
                                    </td>
                                    <td>marcus.j@example.com</td>
                                    <td>2026-09-03 09:10 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-olive">ER</div>
                                            <span className="cust-text">Emma Richardson</span>
                                        </div>
                                    </td>
                                    <td>emma.r@example.com</td>
                                    <td>2026-09-04 10:05 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-forest">LT</div>
                                            <span className="cust-text">Lucas Taylor</span>
                                        </div>
                                    </td>
                                    <td>lucas.t@example.com</td>
                                    <td>2026-08-25 01:14 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-pine">AB</div>
                                            <span className="cust-text">Amelia Brown</span>
                                        </div>
                                    </td>
                                    <td>amelia.b@example.com</td>
                                    <td>2026-08-19 06:45 PM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-emerald">NH</div>
                                            <span className="cust-text">Noah Henderson</span>
                                        </div>
                                    </td>
                                    <td>noah.h@example.com</td>
                                    <td>2026-09-05 11:30 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-moss">IG</div>
                                            <span className="cust-text">Isabella Garcia</span>
                                        </div>
                                    </td>
                                    <td>isabella.g@example.com</td>
                                    <td>2026-09-02 03:22 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-sage">EW</div>
                                            <span className="cust-text">Ethan Walker</span>
                                        </div>
                                    </td>
                                    <td>ethan.w@example.com</td>
                                    <td>2026-08-30 08:50 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-olive">MA</div>
                                            <span className="cust-text">Mia Adams</span>
                                        </div>
                                    </td>
                                    <td>mia.a@example.com</td>
                                    <td>2026-08-22 05:10 PM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-forest">BS</div>
                                            <span className="cust-text">Benjamin Scott</span>
                                        </div>
                                    </td>
                                    <td>benjamin.s@example.com</td>
                                    <td>2026-09-06 09:40 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-pine">CE</div>
                                            <span className="cust-text">Charlotte Evans</span>
                                        </div>
                                    </td>
                                    <td>charlotte.e@example.com</td>
                                    <td>2026-09-05 02:18 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-emerald">HC</div>
                                            <span className="cust-text">Henry Collins</span>
                                        </div>
                                    </td>
                                    <td>henry.c@example.com</td>
                                    <td>2026-08-29 10:55 AM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-moss">AM</div>
                                            <span className="cust-text">Ava Morgan</span>
                                        </div>
                                    </td>
                                    <td>ava.m@example.com</td>
                                    <td>2026-09-07 08:12 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-sage">JC</div>
                                            <span className="cust-text">Jack Campbell</span>
                                        </div>
                                    </td>
                                    <td>jack.c@example.com</td>
                                    <td>2026-09-06 04:30 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-olive">CM</div>
                                            <span className="cust-text">Chloe Mitchell</span>
                                        </div>
                                    </td>
                                    <td>chloe.m@example.com</td>
                                    <td>2026-08-27 07:25 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-forest">WR</div>
                                            <span className="cust-text">William Reed</span>
                                        </div>
                                    </td>
                                    <td>william.r@example.com</td>
                                    <td>2026-09-04 12:44 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-pine">GT</div>
                                            <span className="cust-text">Grace Turner</span>
                                        </div>
                                    </td>
                                    <td>grace.t@example.com</td>
                                    <td>2026-08-21 03:15 PM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-emerald">JP</div>
                                            <span className="cust-text">James Parker</span>
                                        </div>
                                    </td>
                                    <td>james.p@example.com</td>
                                    <td>2026-09-07 11:05 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-moss">HR</div>
                                            <span className="cust-text">Harper Ross</span>
                                        </div>
                                    </td>
                                    <td>harper.r@example.com</td>
                                    <td>2026-09-03 01:50 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-sage">SB</div>
                                            <span className="cust-text">Samuel Bell</span>
                                        </div>
                                    </td>
                                    <td>samuel.b@example.com</td>
                                    <td>2026-08-26 09:35 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-olive">EH</div>
                                            <span className="cust-text">Ella Hughes</span>
                                        </div>
                                    </td>
                                    <td>ella.h@example.com</td>
                                    <td>2026-09-08 10:20 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="customer-name-box">
                                            <div className="cust-avatar bg-forest">LF</div>
                                            <span className="cust-text">Leo Foster</span>
                                        </div>
                                    </td>
                                    <td>leo.f@example.com</td>
                                    <td>2026-08-24 04:10 PM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
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
