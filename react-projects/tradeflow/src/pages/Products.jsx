import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductSlideDrawer } from "../components/drawers";
import { PageHeader, TableCard, StatusModal, LoadingSpinner } from "../components/common";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import setupService from "../services/setupService";

function ProductTableThumb({ src, alt }) {
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={alt}
                className="table-product-thumb"
                onError={() => setFailed(true)}
            />
        );
    }
    return (
        <div className="table-product-thumb-placeholder">
            <i className="bi bi-box-seam"></i>
        </div>
    );
}

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
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
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", type: "success" });
    const [prodToDelete, setProdToDelete] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Sync search query from URL search parameters
    useEffect(() => {
        const urlSearch = searchParams.get("search");
        if (urlSearch !== null) {
            setSearchQuery(urlSearch);
        }
    }, [searchParams]);

    const mapProducts = (items = []) => {
        return items.map((prod, idx) => {
            const prodName = prod.product_name || prod.productName || prod.name || "Untitled Product";
            const catName = prod.categories_name || prod.categoryName || "General Category";
            return {
                id: prod.product_id || prod.productId || `prod-${idx}`,
                code: prod.product_id || prod.productId || `#PRD-0${idx + 1}`,
                name: prodName,
                price: Number(prod.product_price || prod.productPrice || prod.price || 0),
                inStock: Number(prod.quantity ?? prod.inStock ?? 0),
                categoryId: String(prod.categories_id || prod.categoryId || ""),
                categoryName: catName,
                statusId: String(prod.status_id || prod.statusId || ""),
                status: prod.status_name || (String(prod.status_id) === "2" ? "INACTIVE" : String(prod.status_id) === "3" ? "PENDING" : "ACTIVE"),
                description: prod.description || "",
                rawImage: prod.image || prod.imageUrl || prod.product_image || prod.productImage || prod.image_url || "",
                image: prod.image || prod.imageUrl || prod.product_image || prod.productImage || prod.image_url || "",
                createdAt: prod.created_at,
                updatedAt: prod.updated_at
            };
        });
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

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        if (val.trim()) {
            setSearchParams({ search: val.trim() });
        } else {
            setSearchParams({});
        }
    };

    const handleOpenEdit = (prod) => {
        const rawImg = prod.rawImage || prod.image || "";
        setSelectedProd({
            ...prod,
            productId: prod.id || prod.code,
            productName: prod.name,
            productPrice: prod.price,
            quantity: prod.inStock,
            categoryId: prod.categoryId,
            image: rawImg,
            imageUrl: rawImg
        });
        setDrawerTitle(prod ? `Edit Product - ${prod.name}` : "Create New Product");
        setDrawerError("");
        setDrawerOpen(true);
    };

    const handleOpenAdd = () => {
        setSelectedProd({
            productId: "",
            name: "",
            productName: "",
            code: "",
            categoryId: "",
            categoryName: "",
            brand: "",
            subtitle: "",
            status: "",
            statusId: "",
            price: "",
            productPrice: "",
            inStock: "",
            quantity: "",
            image: "",
            imageUrl: "",
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

    const handleRequestDelete = (prod) => {
        setProdToDelete(prod);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!prodToDelete) return;
        const prodId = prodToDelete.id || prodToDelete.code || prodToDelete.productId;
        const name = prodToDelete.name || "this product";

        setShowDeleteConfirm(false);
        const res = await productService.deleteProduct(prodId);
        if (res?.success) {
            setModalData({
                type: "success",
                title: "PRODUCT DELETED SUCCESSFULLY!",
                message: res.message || `Product "${name}" was removed from database.`
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
        setProdToDelete(null);
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
                            <div className="filter-select-wrap table-filter-search-wrap">
                                <i className="bi bi-search table-filter-search-icon"></i>
                                <input
                                    type="text"
                                    className="table-filter-search-input"
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
                        <table className="solara-data-table products-table">
                            <thead>
                                <tr>
                                    <th className="th-sn">SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th className="th-name">Product Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th className="th-id">ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th className="th-category">Category <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th className="th-price">Price (₦) <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th className="th-stock">Stock <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th className="th-status">Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th className="th-action">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProds.map((prod, idx) => (
                                    <tr key={prod.id || idx}>
                                        <td className="col-sn">{idx + 1}</td>
                                        <td className="col-prod-name">
                                            <div className="product-table-cell">
                                                <ProductTableThumb src={prod.image} alt={prod.name} />
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
                                        <td className="col-stock">{prod.inStock}</td>
                                        <td className="col-status">
                                            <span className={`status-badge-pill ${(prod.status || "active").toLowerCase()}`}>
                                                {prod.status}
                                            </span>
                                        </td>
                                        <td className="col-action">
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
                                                    className="btn-edit btn-table-action-delete"
                                                    onClick={() => handleRequestDelete(prod)}
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

            {/* Custom Delete Confirmation Modal */}
            <StatusModal
                isOpen={showDeleteConfirm}
                type="delete"
                title="Delete Product?"
                message={`Are you sure you want to permanently delete product "${prodToDelete?.name || 'this product'}"? This action cannot be undone.`}
                showCancel={true}
                cancelButtonText="Cancel"
                confirmButtonText="Yes, Delete"
                confirmVariant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setProdToDelete(null);
                }}
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
