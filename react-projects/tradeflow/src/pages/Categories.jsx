export default function Categories() {
    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-tags"></i>
                        <span>Categories</span>
                    </div>
                    <div className="module-breadcrumb">
                        Admin &rarr; Organize store inventory and product taxonomy.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Categories</h2>
                        <span className="module-count-subtitle">6 categories available</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select className="filter-dropdown-select" title="Filter by Status" defaultValue="">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <button type="button" className="btn-add-entity">
                            <i className="bi bi-plus-lg"></i> Add Category
                        </button>
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="col-sn">1</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <div className="category-icon-box"><i className="bi bi-phone"></i></div>
                                            <span className="cat-title">Mobile Devices & Phones</span>
                                        </div>
                                    </td>
                                    <td className="col-cat-id">#CAT-101</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">2</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <div className="category-icon-box"><i className="bi bi-trophy"></i></div>
                                            <span className="cat-title">Footwear & Athletic Shoes</span>
                                        </div>
                                    </td>
                                    <td className="col-cat-id">#CAT-102</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">3</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <div className="category-icon-box"><i className="bi bi-tag"></i></div>
                                            <span className="cat-title">Apparel & Men Clothing</span>
                                        </div>
                                    </td>
                                    <td className="col-cat-id">#CAT-103</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">4</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <div className="category-icon-box"><i className="bi bi-bag"></i></div>
                                            <span className="cat-title">Handbags & Accessories</span>
                                        </div>
                                    </td>
                                    <td className="col-cat-id">#CAT-104</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">5</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <div className="category-icon-box"><i className="bi bi-smartwatch"></i></div>
                                            <span className="cat-title">Wearable Technology</span>
                                        </div>
                                    </td>
                                    <td className="col-cat-id">#CAT-105</td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">6</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <div className="category-icon-box"><i className="bi bi-headphones"></i></div>
                                            <span className="cat-title">Audio & Premium Sound</span>
                                        </div>
                                    </td>
                                    <td className="col-cat-id">#CAT-106</td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
