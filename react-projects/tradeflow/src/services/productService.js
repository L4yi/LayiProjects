import setupService from './setupService';
import api from "../api/axios";
import { normalizeResponse, extractErrorMessage } from "../utils/apiResponse";

export const getProductErrorMessage = extractErrorMessage;

// Product image helper: preserves user-provided images with no hardcoded presets.
export function resolveProductImage(name = "", category = "") {
    return "";
}



export const productService = {
    // Fetches all products from database (supports customer and admin endpoints)
    async fetchAllProducts() {
        try {
            let response;
            try {
                response = await api.post("customer/product/fetch-all-products.php", new FormData());
                if (!response?.data?.success) {
                    throw new Error("Customer product endpoint returned unsuccessful");
                }
            } catch (err) {
                // Fall back directly to admin product endpoint
                response = await api.post("admin/product/fetch-all-products.php", new FormData());
            }

            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                return resData;
            }
            // If backend returns NO PRODUCTS FOUND or empty response from server
            const msg = String(resData?.message || "").toUpperCase();
            if (msg.includes("NO PRODUCT") || msg.includes("NOT FOUND") || msg.includes("EMPTY")) {
                return {
                    success: true,
                    data: [],
                    message: resData?.message || "No products found in database."
                };
            }
            return normalizeResponse(resData, "Products fetched successfully.");
        } catch (error) {
            return {
                success: false,
                message: getProductErrorMessage(error, "Failed to fetch products from server."),
                data: []
            };
        }
    },

    async fetchEachProduct(productId) {
        try {
            const formData = new FormData();
            formData.append("productId", String(productId).trim());
            const response = await api.post("admin/product/fetch-each-product.php", formData);
            return normalizeResponse(response.data, "Product details loaded.");
        } catch (error) {
            return {
                success: false,
                message: getProductErrorMessage(error, "Failed to load product details.")
            };
        }
    },

    // Adds a new product to the catalog.
    // Packs product details, category ID, price, and status ID into FormData for PHP backend.
    async createProduct(productData) {
        try {
            const formData = new FormData();
            const catId = productData.categoryId || productData.categories_id || "";
            const name = productData.productName || productData.name || "";
            const price = productData.productPrice || productData.price || 0;
            const qty = productData.quantity ?? productData.inStock ?? 1;
            const desc = productData.description || `${name} - retail product`;
            const statusId = productData.statusId || setupService.getStatusId(productData.status);
            const image = (productData.image || productData.imageUrl || productData.productImage || "").trim();

            formData.append("categoryId", catId);
            formData.append("productName", name);
            formData.append("productPrice", String(price));
            formData.append("quantity", String(qty));
            formData.append("description", desc);
            formData.append("statusId", String(statusId));
            if (image) {
                formData.append("image", image);
                formData.append("imageUrl", image);
                formData.append("productImage", image);
            }

            const response = await api.post("admin/product/create-product.php", formData);
            return normalizeResponse(response.data, "PRODUCT CREATED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getProductErrorMessage(error, "Failed to create product on server.")
            };
        }
    },

    // Updates an existing product in the database by its product ID
    async updateProduct(productData) {
        try {
            const formData = new FormData();
            const prodId = productData.productId || productData.product_id || productData.id || productData.code || "";
            const catId = productData.categoryId || productData.categories_id || "";
            const name = productData.productName || productData.name || "";
            const price = productData.productPrice || productData.price || 0;
            const qty = productData.quantity ?? productData.inStock ?? 1;
            const desc = productData.description || `${name} - retail product`;
            const statusId = productData.statusId || setupService.getStatusId(productData.status);
            const image = (productData.image || productData.imageUrl || productData.productImage || "").trim();

            formData.append("productId", prodId);
            formData.append("categoryId", catId);
            formData.append("productName", name);
            formData.append("productPrice", String(price));
            formData.append("quantity", String(qty));
            formData.append("description", desc);
            formData.append("statusId", String(statusId));
            if (image) {
                formData.append("image", image);
                formData.append("imageUrl", image);
                formData.append("productImage", image);
            }

            const response = await api.post("admin/product/update-product.php", formData);
            return normalizeResponse(response.data, "PRODUCT UPDATED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getProductErrorMessage(error, "Failed to update product on server.")
            };
        }
    },

    async deleteProduct(productId) {
        try {
            const formData = new FormData();
            formData.append("productId", String(productId).trim());
            const response = await api.post("admin/product/delete-product.php", formData);
            return normalizeResponse(response.data, "PRODUCT DELETED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getProductErrorMessage(error, "Failed to delete product from server.")
            };
        }
    },

    async searchProduct(searchContent) {
        try {
            const trimmed = (searchContent || "").trim();
            if (!trimmed) {
                return {
                    success: true,
                    message: "EMPTY_SEARCH",
                    data: []
                };
            }
            const formData = new FormData();
            formData.append("searchContent", trimmed);
            const response = await api.post("admin/product/search-product.php", formData);
            const norm = normalizeResponse(response.data, "PRODUCTS SEARCHED SUCCESSFULLY");
            return {
                ...norm,
                data: Array.isArray(norm.data) ? norm.data : []
            };
        } catch (error) {
            return {
                success: false,
                message: getProductErrorMessage(error, "Search request failed."),
                data: []
            };
        }
    }
};

export default productService;
