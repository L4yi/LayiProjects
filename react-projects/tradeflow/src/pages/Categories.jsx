import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { STORE_CATEGORIES } from "../data/storeData";

export default function Categories() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Category");
    const [statusFilter, setStatusFilter] = useState("");

    const handleOpenEdit = (cat) => {
        setSelectedCat(cat);
        setDrawerTitle(cat ? `Edit Category - ${cat.name}` : "Create New Category");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedCat({
            name: "",
            code: "#CAT-107",
            status: "ACTIVE",
            role: "Category",
            notes: ""
        });
        setDrawerTitle("Create New Category");
        setDrawerOpen(true);
    };

    const displayCats = STORE_CATEGORIES.filter(c =>
        !statusFilter || c.status.toLowerCase() === statusFilter.toLowerCase()
    );

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
                        <span className="module-count-subtitle">{displayCats.length} categories available</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select
                                className="filter-dropdown-select"
                                title="Filter by Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={handleOpenAdd}
                        >
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
                                {displayCats.map((cat, idx) => (
                                    <tr key={cat.id}>
                                        <td className="col-sn">{idx + 1}</td>
                                        <td>
                                            <div className="category-name-cell">
                                                <div className="category-icon-box">
                                                    <i className={cat.icon}></i>
                                                </div>
                                                <span className="cat-title">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="col-cat-id">{cat.code}</td>
                                        <td>
                                            <span className={`status-badge-pill ${cat.status.toLowerCase()}`}>
                                                {cat.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btn-group">
                                                <button
                                                    type="button"
                                                    className="btn-edit"
                                                    onClick={() => handleOpenEdit(cat)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-pill-btn"
                                                    onClick={() => handleOpenEdit(cat)}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-Over Edit Drawer */}
            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below to configure category taxonomy."
                icon="bi bi-tags-fill"
                entityType="Product Category"
                initialData={selectedCat || {}}
            />
        </>
    );
}
