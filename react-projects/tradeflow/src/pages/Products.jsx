import React, { useState, useEffect } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { PageHeader, TableCard } from "../components/common";
import categoryService from "../services/categoryService";

export default function Products() {
    const [productsList, setProductsList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProd, setSelectedProd] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Product");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            const res = await categoryService.fetchAllCategories();
            if (res?.success && Array.isArray(res?.data)) {
                setCategories(res.data);
            }
        };
        loadCategories();
    }, []);

    const handleOpenEdit = (prod) => {
        setSelectedProd({ ...prod });
        setDrawerTitle(prod ? `Edit Product - ${prod.name}` : "Create New Product");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedProd({
            id: `prd-new-${Date.now()}`,
            name: "",
            code: `#PRD-0${productsList.length + 1}`,
            categoryId: categories[0]?.categories_id || "general",
            categoryName: categories[0]?.categories_name || "General Category",
            brand: "",
            subtitle: "",
            status: "ACTIVE",
            price: 0,
            oldPrice: 0,
            inStock: 0,
            image: "",
            description: ""
        });
        setDrawerTitle("Add New Product");
        setDrawerOpen(true);
    };

    const handleSaveProduct = (updatedProd) => {
        setProductsList(prev => {
            const exists = prev.some(p => p.id === updatedProd.id || (updatedProd.code && p.code === updatedProd.code));
            if (exists) {
                return prev.map(p => (p.id === updatedProd.id || (updatedProd.code && p.code === updatedProd.code)) ? { ...p, ...updatedProd } : p);
            } else {
                return [
                    {
                        ...updatedProd,
                        id: updatedProd.id || `prd-new-${Date.now()}`,
                        price: Number(updatedProd.price) || 0,
                        inStock: Number(updatedProd.inStock) || 0
                    },
                    ...prev
                ];
            }
        });
        setDrawerOpen(false);
    };

    const filteredProds = productsList.filter(p =>
        !categoryFilter || p.categoryId === categoryFilter || p.categoryName === categoryFilter
    );

    return (
        <>
            <div className="dashboard-body">
                <PageHeader
                    badgeIcon="bi bi-box-seam"
                    badgeTitle="Products"
                    breadcrumb="Inventory → Manage store catalogue, pricing, and stock levels."
                    title="All Products"
                    countSubtitle={`${filteredProds.length} items cataloged`}
                    actions={
                        <>
                            <div className="filter-select-wrap">
                                <i className="bi bi-funnel"></i>
                                <select
                                    className="filter-dropdown-select"
                                    title="Filter by Category"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categories_id || cat.categoryId} value={cat.categories_id || cat.categoryId}>
                                            {cat.categories_name || cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                className="btn-add-entity"
                                onClick={handleOpenAdd}
                                title="Add Product"
                            >
                                <i className="bi bi-plus-lg"></i> Add Product
                            </button>
                        </>
                    }
                />

                <TableCard
                    title="Product Catalog"
                    subtitle="Live inventory records and stock statuses"
                    isEmpty={filteredProds.length === 0}
                    emptyMessage="No products cataloged yet in database."
                >
                    <table className="solara-data-table">
                        <thead>
                            <tr>
                                <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                <th>Product Name <span className="sort-icon">&uarr;&darr;</span></th>
                                <th>ID <span className="sort-icon">&uarr;&darr;</span></th>
                                <th>Category <span className="sort-icon">&uarr;&darr;</span></th>
                                <th>Price (₦) <span className="sort-icon">&uarr;&darr;</span></th>
                                <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProds.map((prod, idx) => (
                                <tr key={prod.id || idx}>
                                    <td className="col-sn">{idx + 1}</td>
                                    <td>
                                        <div className="product-table-cell">
                                            {prod.image ? (
                                                <img
                                                    src={prod.image}
                                                    alt={prod.name}
                                                    className="prod-tbl-thumb"
                                                    style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", maxWidth: "44px", maxHeight: "44px", objectFit: "contain", borderRadius: "6px" }}
                                                    onError={(e) => { e.target.style.display = "none"; }}
                                                />
                                            ) : (
                                                <div style={{ width: "44px", height: "44px", minWidth: "44px", borderRadius: "6px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                                                    <i className="bi bi-box"></i>
                                                </div>
                                            )}
                                            <div className="prod-tbl-info">
                                                <span className="prod-tbl-title">{prod.name}</span>
                                                <span className="prod-tbl-sub">{prod.subtitle}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">{prod.code}</td>
                                    <td className="col-category">{prod.categoryName}</td>
                                    <td className="col-price">₦ {Number(prod.price || 0).toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge-pill ${(prod.status || "active").toLowerCase()}`}>
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button
                                                type="button"
                                                className="btn-edit"
                                                onClick={() => handleOpenEdit(prod)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="action-pill-btn"
                                                onClick={() => handleOpenEdit(prod)}
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
                subtitle="Please complete the form below to configure inventory and pricing details."
                icon="bi bi-box-seam-fill"
                entityType="Store Product"
                initialData={selectedProd || {}}
                onSave={handleSaveProduct}
            />
        </>
    );
}
