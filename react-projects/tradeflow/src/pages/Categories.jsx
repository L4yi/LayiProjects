import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { STORE_CATEGORIES } from "../data/storeData";
import { PageHeader, TableCard } from "../components/common";

export default function Categories() {
    const [categoriesList, setCategoriesList] = useState(STORE_CATEGORIES);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Category");
    const [statusFilter, setStatusFilter] = useState("");

    const handleOpenEdit = (cat) => {
        setSelectedCat({ ...cat });
        setDrawerTitle(cat ? `Edit Category - ${cat.name}` : "Create New Category");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedCat({
            name: "",
            code: `#CAT-${100 + categoriesList.length + 1}`,
            icon: "bi bi-tag",
            status: "ACTIVE",
            description: "",
            itemCount: "0 Models"
        });
        setDrawerTitle("Create New Category");
        setDrawerOpen(true);
    };

    const handleSaveCategory = (categoryData) => {
        setCategoriesList(prev => {
            const exists = prev.some(c => (categoryData.id && c.id === categoryData.id) || (categoryData.code && c.code === categoryData.code));
            if (exists) {
                return prev.map(c => ((categoryData.id && c.id === categoryData.id) || (categoryData.code && c.code === categoryData.code)) ? { ...c, ...categoryData } : c);
            } else {
                const newCat = {
                    ...categoryData,
                    id: categoryData.id || `cat-${Date.now()}`,
                    code: categoryData.code || `#CAT-${100 + prev.length + 1}`,
                    icon: categoryData.icon || "bi bi-tag",
                    status: categoryData.status || "ACTIVE",
                    itemCount: categoryData.itemCount || "0 Models"
                };
                return [newCat, ...prev];
            }
        });
        setDrawerOpen(false);
    };

    const displayCats = categoriesList.filter(c =>
        !statusFilter || c.status.toLowerCase() === statusFilter.toLowerCase()
    );

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-tags"
                    badgeTitle="Categories"
                    breadcrumb="Admin → Organize store inventory and product taxonomy."
                    title="All Categories"
                    countSubtitle={`${displayCats.length} categories available`}
                    actions={
                        <>
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
                        </>
                    }
                />

                <TableCard
                    title="Category Catalog"
                    subtitle="Active and archived categories in the catalog"
                    isEmpty={displayCats.length === 0}
                    emptyMessage="No categories match the selected filter."
                >
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
                                <tr key={cat.id || idx}>
                                    <td className="col-sn">{idx + 1}</td>
                                    <td>
                                        <div className="category-name-cell">
                                            <div className="category-icon-box">
                                                <i className={cat.icon || "bi bi-tag"}></i>
                                            </div>
                                            <span className="cat-title">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="col-cat-id">{cat.code}</td>
                                    <td>
                                        <span className={`status-badge-pill ${(cat.status || "active").toLowerCase()}`}>
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
                </TableCard>
            </div>

            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below to configure category taxonomy."
                icon="bi bi-tags-fill"
                entityType="Product Category"
                initialData={selectedCat || {}}
                onSave={handleSaveCategory}
            />
        </>
    );
}
