import api from "../api/axios";

export function getCategoryErrorMessage(error, defaultMsg = "An unexpected error occurred") {
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

export function inferCategoryIcon(name = "") {
    const n = String(name).toLowerCase();
    if (n.includes("phone") || n.includes("mobile") || n.includes("device")) return "bi bi-phone";
    if (n.includes("foot") || n.includes("shoe") || n.includes("boot") || n.includes("sneaker")) return "bi bi-boot";
    if (n.includes("apparel") || n.includes("cloth") || n.includes("wear") || n.includes("shirt")) return "bi bi-person-standing";
    if (n.includes("bag") || n.includes("accessori") || n.includes("wallet") || n.includes("backpack")) return "bi bi-bag";
    if (n.includes("audio") || n.includes("sound") || n.includes("headphone") || n.includes("speaker")) return "bi bi-headphones";
    if (n.includes("watch") || n.includes("smartwatch") || n.includes("wearable")) return "bi bi-smartwatch";
    if (n.includes("laptop") || n.includes("computer") || n.includes("pc")) return "bi bi-laptop";
    if (n.includes("tv") || n.includes("screen") || n.includes("display")) return "bi bi-tv";
    if (n.includes("game") || n.includes("gaming") || n.includes("console")) return "bi bi-controller";
    if (n.includes("camera") || n.includes("photo")) return "bi bi-camera";
    return "bi bi-tag";
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

export const categoryService = {
    async fetchAllCategories() {
        try {
            const response = await api.post("admin/categories/fetch-all-category.php", new FormData());
            return normalizeResponse(response.data, "Categories fetched successfully.");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to fetch categories from server.")
            };
        }
    },

    async fetchEachCategory(categoryId) {
        try {
            const formData = new FormData();
            formData.append("categoryId", categoryId);
            const response = await api.post("admin/categories/fetch-each-category.php", formData);
            return normalizeResponse(response.data, "Category fetched successfully.");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to load category details.")
            };
        }
    },

    async createCategory(categoryData) {
        try {
            const formData = new FormData();
            const name = categoryData.categoryName || categoryData.name || "";
            const desc = categoryData.description || categoryData.notes || name || "Category description";
            formData.append("categoryName", name);
            formData.append("description", desc);

            const response = await api.post("admin/categories/create-category.php", formData);
            return normalizeResponse(response.data, "CATEGORY CREATED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to create category on server.")
            };
        }
    },

    async updateCategory(categoryData) {
        try {
            const formData = new FormData();
            const id = categoryData.categoryId || categoryData.categories_id || categoryData.id || categoryData.code || "";
            const name = categoryData.categoryName || categoryData.name || "";
            const desc = categoryData.description || categoryData.notes || name || "Category description";
            const statusId = categoryData.statusId || (String(categoryData.status).toUpperCase() === "INACTIVE" ? "2" : "1");

            formData.append("categoryId", id);
            formData.append("categoryName", name);
            formData.append("description", desc);
            formData.append("statusId", String(statusId));

            const response = await api.post("admin/categories/update-category.php", formData);
            return normalizeResponse(response.data, "CATEGORY UPDATED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to update category on server.")
            };
        }
    },

    async deleteCategory(categoryId) {
        try {
            const formData = new FormData();
            formData.append("categoryId", categoryId);
            const response = await api.post("admin/categories/delete-category.php", formData);
            return normalizeResponse(response.data, "CATEGORY DELETED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to delete category from server.")
            };
        }
    },

    async searchCategory(searchContent) {
        try {
            const formData = new FormData();
            formData.append("searchContent", searchContent);
            const response = await api.post("admin/categories/search-category.php", formData);
            return normalizeResponse(response.data, "CATEGORIES SEARCHED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Search request failed.")
            };
        }
    }
};

export default categoryService;
