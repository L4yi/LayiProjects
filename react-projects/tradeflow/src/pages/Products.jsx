import React, { useState, useEffect } from "react";
import AdminSlideDrawer from "../components/AdminSlideDrawer";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

export default function Products() {
    const [productsList, setProductsList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasNetworkError, setHasNetworkError] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProd, setSelectedProd] = useState(null);
    const [drawerTitle, setDrawerTitle] = useState("Edit Product");
    const [drawerError, setDrawerError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });

    const mapProducts = (items = []) => {
        return items.map((prod, idx) => ({
            id: prod.product_id || prod.productId || `prod-${idx}`,
            code: prod.product_id || prod.productId || `#PRD-0${idx + 1}`,
            name: prod.product_name || prod.productName || "Untitled Product",
            price: Number(prod.product_price || prod.productPrice || prod.price || 0),
            inStock: Number(prod.quantity ?? prod.inStock ?? 0),
            categoryId: prod.categories_id || prod.categoryId || "",
            categoryName: prod.categories_name || prod.categoryName || "General Category",
            status: prod.status_name || (String(prod.status_id) === "2" ? "INACTIVE" : String(prod.status_id) === "3" ? "PENDING" : "ACTIVE"),
            description: prod.description || "",
            image: prod.image || "",
            createdAt: prod.created_at,
            updatedAt: prod.updated_at
        }));
    };

    const loadProducts = async () => {
        setIsLoading(true);
        setHasNetworkError(false);
        try {
            const res = await productService.fetchAllProducts();
            if (res?.success && Array.isArray(res?.data)) {
                setProductsList(mapProducts(res.data));
            } else {
                if (res?.success === false) {
                    setHasNetworkError(true);
                }
                setProductsList([]);
            }
        } catch {
            setHasNetworkError(true);
            setProductsList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        const res = await categoryService.fetchAllCategories();
        if (res?.success && Array.isArray(res?.data)) {
            setCategories(res.data);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const handleSearchChange = async (val) => {
        setSearchQuery(val);
        const query = val.trim();
        if (!query) {
            loadProducts();
            return;
        }

        setIsLoading(true);
        try {
            const res = await productService.searchProduct(query);
            if (res?.success && Array.isArray(res?.data)) {
                setProductsList(mapProducts(res.data));
            } else {
                setProductsList([]);
            }
        } catch {
            setProductsList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenEdit = (prod) => {
        setSelectedProd({
            ...prod,
            productId: prod.id || prod.code,
            productName: prod.name,
            productPrice: prod.price,
            quantity: prod.inStock,
            categoryId: prod.categoryId
        });
        setDrawerTitle(prod ? `Edit Product - ${prod.name}` : "Create New Product");
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        const defaultCat = categories[0];
        setSelectedProd({
            productId: "",
            name: "",
            productName: "",
            code: "",
            categoryId: defaultCat?.categories_id || defaultCat?.categoryId || "",
            categoryName: defaultCat?.categories_name || defaultCat?.categoryName || "",
            brand: "",
            subtitle: "",
            status: "ACTIVE",
            price: "",
            productPrice: "",
            inStock: "",
            quantity: "",
            image: "",
            description: ""
        });
        setDrawerTitle("Add New Product");
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleSaveProduct = async (productData) => {
        setIsSaving(true);
        setDrawerError("");

        const isUpdate = Boolean(productData.productId || productData.product_id || productData.id);
        const prodName = productData.productName || productData.name || "";

        let result;
        if (isUpdate) {
            result = await productService.updateProduct(productData);
        } else {
            result = await productService.createProduct(productData);
        }
        setIsSaving(false);

        if (result?.success) {
            setDrawerOpen(false);
            await loadProducts();
            setModalData({
                type: "success",
                title: isUpdate ? "PRODUCT UPDATED SUCCESSFULLY!" : "PRODUCT CREATED SUCCESSFULLY!",
                message: isUpdate
                    ? (result.message || `Product "${prodName}" has been updated successfully.`)
                    : (result.message || `Product "${prodName}" has been registered into inventory.`)
            });
            setShowSuccessModal(true);
        } else {
            setDrawerError(result?.message || "Unable to save product. Please check all required fields.");
        }
    };

    const handleDeleteProduct = async (prod) => {
        const prodId = prod.id || prod.code || prod.productId;
        if (!prodId) return;

        if (!window.confirm(`Are you sure you want to delete product "${prod.name}"?`)) return;

        const res = await productService.deleteProduct(prodId);
        if (res?.success) {
            setModalData({
                type: "success",
                title: "PRODUCT DELETED SUCCESSFULLY!",
                message: res.message || `Product "${prod.name}" was removed from database.`
            });
            setShowSuccessModal(true);
            await loadProducts();
        } else {
            setModalData({
                type: "error",
                title: "DELETE FAILED",
                message: res?.message || "Unable to delete product."
            });
            setShowSuccessModal(true);
        }
    };

    const filteredProds = productsList.filter(p => {
        const matchesCategory = !categoryFilter || p.categoryId === categoryFilter || p.categoryName === categoryFilter;
        const matchesStatus = !statusFilter || (p.status || "").toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesStatus && matchesSearch;
    });

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
                            <div className="filter-select-wrap" style={{ position: "relative", minWidth: "220px", display: "flex", alignItems: "center" }}>
                                <i className="bi bi-search" style={{ position: "absolute", left: "12px", color: "#718096", pointerEvents: "none" }}></i>
                                <input
                                    type="text"
                                    className="filter-dropdown-select"
                                    style={{ paddingLeft: "34px", paddingRight: searchQuery ? "30px" : "12px", width: "100%", height: "38px" }}
                                    placeholder="Search products..."
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
                                    title="Filter by Category"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categories_id || cat.categoryId || cat.id} value={cat.categories_id || cat.categoryId || cat.id}>
                                            {cat.categories_name || cat.categoryName || cat.name}
                                        </option>
                                    ))}
                                </select>
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
                                    <option value="pending">Pending</option>
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

                {isLoading ? (
                    <LoadingSpinner />
                ) : hasNetworkError ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "12px", border: "1px dashed #feb2b2", margin: "20px 0" }}>
                        <i className="bi bi-wifi-off" style={{ fontSize: "2.8rem", color: "#e53e3e", display: "block", marginBottom: "12px" }}></i>
                        <h3 style={{ color: "#2d3748", marginBottom: "8px", fontSize: "1.2rem" }}>Network / Connection Issue</h3>
                        <p style={{ color: "#718096", fontSize: "0.9rem", maxWidth: "420px", margin: "0 auto 20px" }}>
                            Unable to load products from the server. Please check your internet connection and try again.
                        </p>
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={loadProducts}
                            style={{ display: "inline-flex" }}
                        >
                            <i className="bi bi-arrow-clockwise"></i> Retry Connection
                        </button>
                    </div>
                ) : (
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
                                    <th>Stock <span className="sort-icon">&uarr;&darr;</span></th>
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
                                                    {prod.description && (
                                                        <span className="prod-tbl-sub" style={{ maxWidth: "280px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                                                            {prod.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-prod-id">{prod.code}</td>
                                        <td className="col-category">{prod.categoryName}</td>
                                        <td className="col-price">₦ {Number(prod.price || 0).toLocaleString()}</td>
                                        <td>{prod.inStock}</td>
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
                                                <button
                                                    type="button"
                                                    className="btn-edit"
                                                    style={{ color: "#e53e3e", borderColor: "#feb2b2", background: "#fff5f5" }}
                                                    onClick={() => handleDeleteProduct(prod)}
                                                    title="Delete Product"
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
                subtitle="Please complete the form below to configure inventory and pricing details."
                icon="bi bi-box-seam-fill"
                entityType="Store Product"
                initialData={selectedProd || {}}
                categoriesList={categories}
                isSaving={isSaving}
                errorMessage={drawerError}
                onSave={handleSaveProduct}
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
