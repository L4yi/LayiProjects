import React, { useState } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { STORE_PRODUCTS } from "../data/storeData";

export default function Products() {
    const [productsList, setProductsList] = useState(STORE_PRODUCTS);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProd, setSelectedProd] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Product");
    const [categoryFilter, setCategoryFilter] = useState("");

    const handleOpenEdit = (prod) => {
        setSelectedProd({ ...prod });
        setDrawerTitle(prod ? `Edit Product - ${prod.name}` : "Create New Product");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedProd({
            id: `prd-new-${Date.now()}`,
            name: "",
            code: `#PRD-00${productsList.length + 1}`,
            categoryName: "Mobile Devices & Phones",
            status: "ACTIVE",
            price: 50000,
            notes: ""
        });
        setDrawerTitle("Add New Product");
        setDrawerOpen(true);
    };

    const handleSaveProduct = (updatedProd) => {
        setProductsList(prev => {
            const exists = prev.some(p => p.id === updatedProd.id);
            if (exists) {
                return prev.map(p => p.id === updatedProd.id ? { ...p, ...updatedProd } : p);
            } else {
                return [
                    {
                        ...updatedProd,
                        image: updatedProd.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
                    },
                    ...prev
                ];
            }
        });
    };

    const filteredProds = productsList.filter(p =>
        !categoryFilter || p.categoryId === categoryFilter
    );

    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-box-seam"></i>
                        <span>Products</span>
                    </div>
                    <div className="module-breadcrumb">
                        Inventory &rarr; Manage store catalogue, pricing, and stock levels.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Products</h2>
                        <span className="module-count-subtitle">{filteredProds.length} items in stock</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select
                                className="filter-dropdown-select"
                                title="Filter by Category"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="mobile-devices">Mobile Devices</option>
                                <option value="footwear">Footwear</option>
                                <option value="apparel">Apparel</option>
                                <option value="accessories">Accessories</option>
                                <option value="wearable">Wearable Tech</option>
                                <option value="audio">Audio Devices</option>
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
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
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
                                    <tr key={prod.id}>
                                        <td className="col-sn">{idx + 1}</td>
                                        <td>
                                            <div className="product-table-cell">
                                                <img
                                                    src={prod.image}
                                                    alt={prod.name}
                                                    className="prod-tbl-thumb"
                                                    style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px", maxWidth: "44px", maxHeight: "44px", objectFit: "contain", borderRadius: "6px" }}
                                                />
                                                <div className="prod-tbl-info">
                                                    <span className="prod-tbl-title">{prod.name}</span>
                                                    <span className="prod-tbl-sub">{prod.subtitle}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-prod-id">{prod.code}</td>
                                        <td className="col-category">{prod.categoryName}</td>
                                        <td className="col-price">₦ {prod.price.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge-pill ${prod.status.toLowerCase()}`}>
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
                    </div>
                </div>
            </div>

            {/* Slide-Over Edit Drawer */}
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
