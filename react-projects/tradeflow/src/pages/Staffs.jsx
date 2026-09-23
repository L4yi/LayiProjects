import React from "react";

export default function Staffs() {
    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-person-badge"></i>
                        <span>Staffs</span>
                    </div>
                    <div className="module-breadcrumb">
                        Admin &rarr; Manage staff accounts, roles, and access across the institute.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Staffs</h2>
                        <span className="module-count-subtitle">15 staff members</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select className="filter-dropdown-select" title="Filter by Role" defaultValue="">
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                                <option value="manager">Manager</option>
                                <option value="support">Support</option>
                            </select>
                        </div>
                        <button type="button" className="btn-add-entity">
                            <i className="bi bi-plus-lg"></i> Add Staff
                        </button>
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>User Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Role <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Last Login <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="col-sn">1</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-forest">AW</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Alexander Wright</span>
                                                <span className="staff-id">#STF-01</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">System Administrator</td>
                                    <td className="col-date">2026-09-02 08:30 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">2</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-pine">SM</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Sophia Martinez</span>
                                                <span className="staff-id">#STF-02</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Store Manager</td>
                                    <td className="col-date">2026-09-01 04:15 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">3</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-emerald">DS</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Daniel Sterling</span>
                                                <span className="staff-id">#STF-03</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Support Agent</td>
                                    <td className="col-date">2026-08-28 11:20 AM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">4</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-moss">OC</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Olivia Chen</span>
                                                <span className="staff-id">#STF-04</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Inventory Officer</td>
                                    <td className="col-date">2026-08-31 02:40 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">5</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-sage">MJ</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Marcus Johnson</span>
                                                <span className="staff-id">#STF-05</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Finance Analyst</td>
                                    <td className="col-date">2026-09-03 09:10 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">6</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-olive">ER</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Emma Richardson</span>
                                                <span className="staff-id">#STF-06</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Operations Lead</td>
                                    <td className="col-date">2026-09-04 10:05 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">7</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-forest">LT</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Lucas Taylor</span>
                                                <span className="staff-id">#STF-07</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Quality Assurance</td>
                                    <td className="col-date">2026-08-25 01:14 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">8</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-pine">AB</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Amelia Brown</span>
                                                <span className="staff-id">#STF-08</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">HR Coordinator</td>
                                    <td className="col-date">2026-08-19 06:45 PM</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">9</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-emerald">NH</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Noah Henderson</span>
                                                <span className="staff-id">#STF-09</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Logistics Supervisor</td>
                                    <td className="col-date">2026-09-05 11:30 AM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td><button type="button" className="action-pill-btn">View</button></td>
                                </tr>
                                <tr>
                                    <td className="col-sn">10</td>
                                    <td>
                                        <div className="staff-user-cell">
                                            <div className="staff-avatar bg-moss">IG</div>
                                            <div className="staff-text-group">
                                                <span className="staff-name">Isabella Garcia</span>
                                                <span className="staff-id">#STF-10</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-role">Marketing Specialist</td>
                                    <td className="col-date">2026-09-02 03:22 PM</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
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
