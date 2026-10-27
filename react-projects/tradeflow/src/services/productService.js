import api from "../api/axios";

export function getProductErrorMessage(error, defaultMsg = "An unexpected error occurred") {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (typeof error.response?.data === "string" && error.response.data.trim()) {
        const text = error.response.data.trim();
        if (text.startsWith("<")) {
            const titleMatch = text.match(/<title>(.*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
                return titleMatch[1].trim();
            }
            const stripped = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
            if (stripped && stripped.length < 200) {
                return stripped;
            }
        } else {
            return text;
        }
    }
    if (error.response?.status) {
        const status = error.response.status;
        const statusText = error.response.statusText || "";
        return `Server Error (${status})${statusText ? ": " + statusText : ""}`;
    }
    if (error.message) {
        return error.message;
    }
    return defaultMsg;
}

function normalizeResponse(resData, defaultSuccessMsg = "Success") {
    if (typeof resData === "object" && resData !== null) {
        const isSuccess = resData.success === true || resData.success === "true";
        return {
            ...resData,
            success: isSuccess,
            message: resData.message || (isSuccess ? defaultSuccessMsg : "Request could not be completed.")
        };
    }
    return {
        success: false,
        message: String(resData || "Empty response from server.")
    };
}

export const productService = {
    async fetchAllProducts() {
        try {
            const response = await api.post("admin/product/fetch-all-products.php", new FormData());
            return normalizeResponse(response.data, "Products fetched successfully.");
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

    async createProduct(productData) {
        try {
            const formData = new FormData();
            const catId = productData.categoryId || productData.categories_id || "";
            const name = productData.productName || productData.name || "";
            const price = productData.productPrice || productData.price || 0;
            const qty = productData.quantity ?? productData.inStock ?? 1;
            const desc = productData.description || `${name} - retail product`;
            const statusId = productData.statusId || (
                String(productData.status).toUpperCase() === "INACTIVE" ? "2" :
                String(productData.status).toUpperCase() === "PENDING" ? "3" : "1"
            );

            formData.append("categoryId", catId);
            formData.append("productName", name);
            formData.append("productPrice", String(price));
            formData.append("quantity", String(qty));
            formData.append("description", desc);
            formData.append("statusId", String(statusId));

            const response = await api.post("admin/product/create-product.php", formData);
            return normalizeResponse(response.data, "PRODUCT CREATED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getProductErrorMessage(error, "Failed to create product on server.")
            };
        }
    },

    async updateProduct(productData) {
        try {
            const formData = new FormData();
            const prodId = productData.productId || productData.product_id || productData.id || productData.code || "";
            const catId = productData.categoryId || productData.categories_id || "";
            const name = productData.productName || productData.name || "";
            const price = productData.productPrice || productData.price || 0;
            const qty = productData.quantity ?? productData.inStock ?? 1;
            const desc = productData.description || `${name} - retail product`;
            const statusId = productData.statusId || (
                String(productData.status).toUpperCase() === "INACTIVE" ? "2" :
                String(productData.status).toUpperCase() === "PENDING" ? "3" : "1"
            );

            formData.append("productId", prodId);
            formData.append("categoryId", catId);
            formData.append("productName", name);
            formData.append("productPrice", String(price));
            formData.append("quantity", String(qty));
            formData.append("description", desc);
            formData.append("statusId", String(statusId));

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
            const formData = new FormData();
            formData.append("searchContent", (searchContent || "").trim());
            const response = await api.post("admin/product/search-product.php", formData);
            return normalizeResponse(response.data, "PRODUCTS SEARCHED SUCCESSFULLY");
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
