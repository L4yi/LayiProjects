import setupService from './setupService';
import api from "../api/axios";

// Resolves a high-quality product image from the frontend based on product name and taxonomy
export function resolveProductImage(name = "", category = "") {
    const text = `${name} ${category}`.toLowerCase();
    if (text.includes("samsung") || text.includes("galaxy") || text.includes("a15") || text.includes("phone") || text.includes("iphone") || text.includes("mobile") || text.includes("pixel") || text.includes("redmi") || text.includes("infinix") || text.includes("tecno")) {
        return "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("macbook") || text.includes("laptop") || text.includes("computer") || text.includes("dell") || text.includes("hp") || text.includes("lenovo")) {
        return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("headphone") || text.includes("earbud") || text.includes("audio") || text.includes("airpod") || text.includes("speaker") || text.includes("sound")) {
        return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("watch") || text.includes("smartwatch") || text.includes("wearable")) {
        return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("shoe") || text.includes("sneaker") || text.includes("boot") || text.includes("footwear") || text.includes("jordan") || text.includes("nike") || text.includes("adidas")) {
        return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("shirt") || text.includes("cloth") || text.includes("pant") || text.includes("jean") || text.includes("dress") || text.includes("hoodie") || text.includes("apparel") || text.includes("wear") || text.includes("jacket") || text.includes("fashion")) {
        return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("beauty") || text.includes("health") || text.includes("skincare") || text.includes("cream") || text.includes("lotion") || text.includes("serum") || text.includes("perfume") || text.includes("cosmetic")) {
        return "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("office") || text.includes("paper") || text.includes("pen") || text.includes("desk") || text.includes("stationery") || text.includes("folder") || text.includes("printer") || text.includes("supplies")) {
        return "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("grocer") || text.includes("food") || text.includes("rice") || text.includes("snack") || text.includes("fruit") || text.includes("oil") || text.includes("tea") || text.includes("coffee") || text.includes("beverage")) {
        return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("tv") || text.includes("screen") || text.includes("monitor") || text.includes("display")) {
        return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("camera") || text.includes("lens") || text.includes("dslr") || text.includes("photo")) {
        return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80";
    }
    if (text.includes("electronic") || text.includes("cable") || text.includes("charger") || text.includes("device") || text.includes("gadget") || text.includes("cpu")) {
        return "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80";
    }
    return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
}

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
