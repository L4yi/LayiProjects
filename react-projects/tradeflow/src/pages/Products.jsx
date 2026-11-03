import React, { useState, useEffect } from "react";
import { ProductSlideDrawer } from "../components/drawers";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import setupService from "../services/setupService";

export default function Products() {
    const [productsList, setProductsList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [statusesList, setStatusesList] = useState(() => setupService.getProductStatuses(setupService.getCachedStatuses()));
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
            categoryId: String(prod.categories_id || prod.categoryId || ""),
            categoryName: prod.categories_name || prod.categoryName || "General Category",
            statusId: String(prod.status_id || prod.statusId || ""),
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
                setProductsList([]);
                const msg = String(res?.message || "").toLowerCase();
                const isRealNetworkError = msg.includes("failed to fetch") || msg.includes("network") || msg.includes("timeout") || msg.includes("server error");
                if (isRealNetworkError) {
                    setHasNetworkError(true);
                }
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
        // Load product inventory and catalog statuses from backend setup
        setupService.fetchAllStatus().then(res => {
            if (res.success && Array.isArray(res.data)) {
                setStatusesList(setupService.getProductStatuses(res.data));
            }
        });
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
        // Compare p.categoryId with categoryFilter, and p.statusId with statusFilter
        const matchesCategory = !categoryFilter || String(p.categoryId) === String(categoryFilter);
        const matchesStatus = !statusFilter || String(p.statusId) === String(statusFilter);
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
                            <div className="table-filter-search-wrap">
                                <i className="bi bi-search table-filter-search-icon"></i>
                                <input
                                    type="text"
                                    className="filter-dropdown-select table-filter-search-input"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => handleSearchChange("")}
                                        className="table-filter-clear-btn"
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
                                    {statusesList.map(s => (
                                        <option key={s.status_id} value={s.status_id}>{s.status_name}</option>
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

                {isLoading ? (
                    <LoadingSpinner variant="table" columns={["SN", "Product Name", "ID", "Category", "Price (₦)", "Stock", "Status", "Action"]} />
                ) : hasNetworkError ? (
                    <div className="connection-error-box">
                        <i className="bi bi-wifi-off connection-error-icon"></i>
                        <h3 className="connection-error-title">Network / Connection Issue</h3>
                        <p className="connection-error-text">
                            Unable to load products from the server. Please check your internet connection and try again.
                        </p>
                        <button
                            type="button"
                            className="btn-add-entity"
                            onClick={loadProducts}
                        >
                            <i className="bi bi-arrow-clockwise"></i> Retry Connection
                        </button>
                    </div>
                ) : (
                    <TableCard
                        title="Product Catalog"
                        subtitle="Live inventory records and stock statuses"
                        isEmpty={filteredProds.length === 0}
                        emptyMessage="No products cataloged yet."
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
                                                        className="table-product-thumb"
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <div className="table-product-thumb-placeholder">
                                                        <i className="bi bi-box"></i>
                                                    </div>
                                                )}
                                                <div className="prod-tbl-info">
                                                    <span className="prod-tbl-title">{prod.name}</span>
                                                    {prod.description && (
                                                        <span className="prod-tbl-sub table-cell-ellipsis-sub">
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

            <ProductSlideDrawer
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
