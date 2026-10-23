import React, { useState, useEffect } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import categoryService, { inferCategoryIcon } from "../services/categoryService";

export default function Categories() {
    const [categoriesList, setCategoriesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Category");
    const [drawerError, setDrawerError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

    const loadCategories = async () => {
        setIsLoading(true);
        setHasNetworkError(false);
        try {
            const result = await categoryService.fetchAllCategories();
            if (result?.success && Array.isArray(result?.data)) {
                const mapped = result.data.map((cat, idx) => ({
                    id: cat.categories_id || cat.categoryId || `cat-${idx}`,
                    code: cat.categories_id || cat.categoryId || `#CAT-${idx + 101}`,
                    name: cat.categories_name || cat.categoryName || "Untitled Category",
                    status: cat.status_name || (String(cat.status_id) === "1" ? "ACTIVE" : "INACTIVE"),
                    description: cat.description || "",
                    icon: inferCategoryIcon(cat.categories_name || cat.categoryName),
                    itemCount: "Catalog Item",
                    createdAt: cat.created_at,
                    updatedAt: cat.updated_at
                }));
                setCategoriesList(mapped);
            } else {
                if (result?.success === false) {
                    setHasNetworkError(true);
                }
                setCategoriesList([]);
            }
        } catch {
            setHasNetworkError(true);
            setCategoriesList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleSearchChange = async (val) => {
        setSearchQuery(val);
        const query = val.trim();
        if (!query) {
            loadCategories();
            return;
        }

        setIsLoading(true);
        try {
            const result = await categoryService.searchCategory(query);
            if (result?.success && Array.isArray(result?.data)) {
                const mapped = result.data.map((cat, idx) => ({
                    id: cat.categories_id || cat.categoryId || `cat-${idx}`,
                    code: cat.categories_id || cat.categoryId || `#CAT-${idx + 101}`,
                    name: cat.categories_name || cat.categoryName || "Untitled Category",
                    status: cat.status_name || (String(cat.status_id) === "1" ? "ACTIVE" : "INACTIVE"),
                    description: cat.description || "",
                    icon: inferCategoryIcon(cat.categories_name || cat.categoryName),
                    itemCount: "Catalog Item",
                    createdAt: cat.created_at,
                    updatedAt: cat.updated_at
                }));
                setCategoriesList(mapped);
            } else {
                setCategoriesList([]);
            }
        } catch {
            setCategoriesList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenEdit = (cat) => {
        setSelectedCat({ ...cat });
        setDrawerTitle(cat ? `Edit Category - ${cat.name}` : "Create New Category");
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedCat({
            name: "",
            categoryName: "",
            code: "",
            icon: "bi bi-tag",
            status: "ACTIVE",
            description: "",
            itemCount: "Catalog Item"
        });
        setDrawerTitle("Create New Category");
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleSaveCategory = async (categoryData) => {
        setIsSaving(true);
        setDrawerError("");

        const catName = categoryData.name || categoryData.categoryName || "";
        const isUpdate = Boolean(categoryData.id || categoryData.categoryId || categoryData.categories_id);

        let result;
        if (isUpdate) {
            result = await categoryService.updateCategory(categoryData);
        } else {
            result = await categoryService.createCategory(categoryData);
        }
        setIsSaving(false);

        if (result?.success) {
            setDrawerOpen(false);
            await loadCategories();
            setModalData({
                type: "success",
                title: isUpdate ? "CATEGORY UPDATED SUCCESSFULLY!" : "CATEGORY CREATED SUCCESSFULLY!",
                message: isUpdate
                    ? (result.message || `Category "${catName}" has been updated successfully.`)
                    : (result.message || `Category "${catName}" has been created successfully.`)
            });
            setShowSuccessModal(true);
        } else {
            setDrawerError(result?.message || "Unable to save category. Please fill in all required fields.");
        }
    };

    const handleDeleteCategory = async (cat) => {
        const catId = cat.id || cat.code || cat.categoryId;
        if (!catId) return;

        if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

        const result = await categoryService.deleteCategory(catId);
        if (result?.success) {
            setModalData({
                type: "success",
                title: "CATEGORY DELETED SUCCESSFULLY!",
                message: result.message || `Category "${cat.name}" was removed successfully.`
            });
            setShowSuccessModal(true);
            await loadCategories();
        } else {
            setModalData({
                type: "error",
                title: "DELETE FAILED",
                message: result?.message || "Unable to delete category from database."
            });
            setShowSuccessModal(true);
        }
    };

    const displayCats = categoriesList.filter((c) => {
        const matchesStatus = !statusFilter || c.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = !searchQuery ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.code && c.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

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
                            <div className="filter-select-wrap" style={{ position: "relative", minWidth: "220px", display: "flex", alignItems: "center" }}>
                                <i className="bi bi-search" style={{ position: "absolute", left: "12px", color: "#718096", pointerEvents: "none" }}></i>
                                <input
                                    type="text"
                                    className="filter-dropdown-select"
                                    style={{ paddingLeft: "34px", paddingRight: searchQuery ? "30px" : "12px", width: "100%", height: "38px" }}
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => handleSearchChange("")}
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            background: "transparent",
                                            border: "none",
                                            color: "#a0aec0",
                                            cursor: "pointer",
                                            padding: 0,
                                            fontSize: "0.95rem"
                                        }}
                                        title="Clear search"
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                )}
                            </div>

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

                {isLoading ? (
                    <LoadingSpinner />
                ) : hasNetworkError ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "12px", border: "1px dashed #feb2b2", margin: "20px 0" }}>
                        <i className="bi bi-wifi-off" style={{ fontSize: "2.8rem", color: "#e53e3e", display: "block", marginBottom: "12px" }}></i>
                        <h3 style={{ color: "#2d3748", marginBottom: "8px", fontSize: "1.2rem" }}>Network / Connection Issue</h3>
                        <p style={{ color: "#718096", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 20px" }}>
                            Unable to load categories from the server. Please check your internet connection and try again.
                        </p>
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={loadCategories}
                            style={{ display: "inline-flex" }}
                        >
                            <i className="bi bi-arrow-clockwise"></i> Retry Connection
                        </button>
                    </div>
                ) : (
                    <TableCard
                        title="Category Catalog"
                        subtitle="Active and archived categories in the catalog"
                        isEmpty={displayCats.length === 0}
                        emptyMessage="No categories match the selected criteria."
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
                                                <div>
                                                    <span className="cat-title">{cat.name}</span>
                                                    {cat.description && (
                                                        <div style={{ fontSize: "0.78rem", color: "#718096", maxWidth: "340px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {cat.description}
                                                        </div>
                                                    )}
                                                </div>
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
                                                    title="Edit Category"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-pill-btn"
                                                    onClick={() => handleOpenEdit(cat)}
                                                    title="View Category"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-edit"
                                                    style={{ color: "#e53e3e", borderColor: "#feb2b2", background: "#fff5f5" }}
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    title="Delete Category"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableCard>
                )}
            </div>

            <AdminSlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle="Please complete the form below to configure category taxonomy."
                icon="bi bi-tags-fill"
                entityType="Category"
                initialData={selectedCat || {}}
                isSaving={isSaving}
                errorMessage={drawerError}
                onSave={handleSaveCategory}
            />

            <StatusModal
                isOpen={showSuccessModal}
                type={modalData.type || "success"}
                title={modalData.title}
                message={modalData.message}
                buttonText="Okay, Continue"
                onConfirm={() => setShowSuccessModal(false)}
            />
        </>
    );
}
