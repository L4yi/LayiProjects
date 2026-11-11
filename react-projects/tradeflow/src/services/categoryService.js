import setupService from './setupService';
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
    if (n.includes("beauty") || n.includes("health") || n.includes("skincare") || n.includes("cosmetic")) return "bi bi-heart-pulse";
    if (n.includes("office") || n.includes("supplies") || n.includes("stationery")) return "bi bi-briefcase";
    if (n.includes("grocer") || n.includes("food") || n.includes("fruit") || n.includes("beverage")) return "bi bi-basket";
    if (n.includes("electronic") || n.includes("gadget") || n.includes("hardware")) return "bi bi-cpu";
    if (n.includes("foot") || n.includes("shoe") || n.includes("boot") || n.includes("sneaker")) return "bi bi-boot";
    if (n.includes("apparel") || n.includes("cloth") || n.includes("wear") || n.includes("shirt") || n.includes("fashion")) return "bi bi-person-standing";
    if (n.includes("bag") || n.includes("accessori") || n.includes("wallet") || n.includes("backpack")) return "bi bi-bag";
    if (n.includes("audio") || n.includes("sound") || n.includes("headphone") || n.includes("speaker")) return "bi bi-headphones";
    if (n.includes("watch") || n.includes("smartwatch") || n.includes("wearable")) return "bi bi-smartwatch";
    if (n.includes("laptop") || n.includes("computer") || n.includes("pc")) return "bi bi-laptop";
    if (n.includes("tv") || n.includes("screen") || n.includes("display")) return "bi bi-tv";
    if (n.includes("game") || n.includes("gaming") || n.includes("console")) return "bi bi-controller";
    if (n.includes("camera") || n.includes("photo")) return "bi bi-camera";
    return "bi bi-tag";
}

const CATEGORY_IMAGES_STORAGE_KEY = "tradeflow_category_images";

export function getStoredCategoryImages() {
    try {
        const stored = localStorage.getItem(CATEGORY_IMAGES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

export function getStoredCategoryImage(catId, catName = "") {
    if (!catId && !catName) return "";
    const images = getStoredCategoryImages();
    if (catId && images[String(catId)]) return images[String(catId)];
    if (catName) {
        const key = String(catName).toLowerCase().trim();
        if (images[key]) return images[key];
    }
    return "";
}

export function setStoredCategoryImage(catId, catName, imageUrl) {
    if (!catId && !catName) return;
    try {
        const images = getStoredCategoryImages();
        const cleanUrl = (imageUrl || "").trim();
        if (catId) images[String(catId)] = cleanUrl;
        if (catName) images[String(catName).toLowerCase().trim()] = cleanUrl;
        localStorage.setItem(CATEGORY_IMAGES_STORAGE_KEY, JSON.stringify(images));
        window.dispatchEvent(new CustomEvent("tradeflow_category_images_updated", { detail: images }));
    } catch (e) {
        console.warn("Could not save category image to localStorage:", e);
    }
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
    // Fetches all categories from database (supports customer and admin endpoints)
    async fetchAllCategories() {
        try {
            let response;
            try {
                response = await api.post("customer/category/fetch-all-category.php", new FormData());
                if (!response?.data?.success) {
                    throw new Error("Customer category endpoint returned unsuccessful");
                }
            } catch (err) {
                // Fall back directly to admin category endpoint
                response = await api.post("admin/categories/fetch-all-category.php", new FormData());
            }

            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                const enriched = resData.data.map(cat => {
                    const id = cat.categories_id || cat.categoryId || cat.id;
                    const name = cat.categories_name || cat.categoryName || cat.name;
                    const storedImg = getStoredCategoryImage(id, name);
                    const finalImg = (cat.image_url || cat.image || cat.imageUrl || storedImg || "").trim();
                    return {
                        ...cat,
                        image_url: finalImg || null,
                        image: finalImg,
                        imageUrl: finalImg
                    };
                });
                return {
                    ...resData,
                    data: enriched
                };
            }
            const msg = String(resData?.message || "").toUpperCase();
            if (msg.includes("NO CATEGOR") || msg.includes("NOT FOUND") || msg.includes("EMPTY")) {
                return {
                    success: true,
                    data: [],
                    message: resData?.message || "No categories found."
                };
            }
            return normalizeResponse(resData, "Categories fetched successfully.");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to fetch categories from server."),
                data: []
            };
        }
    },

    async fetchEachCategory(categoryId) {
        try {
            const formData = new FormData();
            formData.append("categoryId", categoryId);
            const response = await api.post("admin/categories/fetch-each-category.php", formData);
            const resData = response.data;
            if (resData?.success === true && resData?.data) {
                const cat = resData.data;
                const id = cat.categories_id || cat.categoryId || categoryId;
                const name = cat.categories_name || cat.categoryName;
                const storedImg = getStoredCategoryImage(id, name);
                const finalImg = (cat.image_url || cat.image || cat.imageUrl || storedImg || "").trim();
                return {
                    ...resData,
                    data: {
                        ...cat,
                        image_url: finalImg || null,
                        image: finalImg,
                        imageUrl: finalImg
                    }
                };
            }
            return normalizeResponse(resData, "Category fetched successfully.");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to load category details.")
            };
        }
    },

    // Adds a new product category to the database
    async createCategory(categoryData) {
        try {
            const formData = new FormData();
            const name = categoryData.categoryName || categoryData.name || "";
            const desc = categoryData.description || categoryData.notes || name || "Category description";
            const statusId = categoryData.statusId || setupService.getStatusId(categoryData.status);
            const image = (categoryData.image || categoryData.imageUrl || categoryData.categoryImage || categoryData.category_image || "").trim();

            formData.append("categoryName", name);
            formData.append("description", desc);
            formData.append("statusId", String(statusId));
            if (image) {
                formData.append("image", image);
                formData.append("imageUrl", image);
                formData.append("categoryImage", image);
                formData.append("category_image", image);
            }

            const response = await api.post("admin/categories/create-category.php", formData);
            const resData = response.data;
            if (resData?.success) {
                const newId = resData.data?.categoryId || resData.data?.categories_id || "";
                if (image) {
                    setStoredCategoryImage(newId, name, image);
                }
            }
            return normalizeResponse(resData, "CATEGORY CREATED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Failed to create category on server.")
            };
        }
    },

    // Updates an existing category's name, description, and status
    async updateCategory(categoryData) {
        try {
            const formData = new FormData();
            const id = categoryData.categoryId || categoryData.categories_id || categoryData.id || categoryData.code || "";
            const name = categoryData.categoryName || categoryData.name || "";
            const desc = categoryData.description || categoryData.notes || name || "Category description";
            const statusId = categoryData.statusId || setupService.getStatusId(categoryData.status);
            const image = (categoryData.image || categoryData.imageUrl || categoryData.categoryImage || categoryData.category_image || "").trim();

            formData.append("categoryId", id);
            formData.append("categoryName", name);
            formData.append("description", desc);
            formData.append("statusId", String(statusId));
            if (image) {
                formData.append("image", image);
                formData.append("imageUrl", image);
                formData.append("categoryImage", image);
                formData.append("category_image", image);
                setStoredCategoryImage(id, name, image);
            }

            const response = await api.post("admin/categories/update-category.php", formData);
            const resData = response.data;
            if (resData?.success && image) {
                setStoredCategoryImage(id, name, image);
            }
            return normalizeResponse(resData, "CATEGORY UPDATED SUCCESSFULLY");
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
            const resData = response.data;
            if (resData?.success === true && Array.isArray(resData?.data)) {
                const enriched = resData.data.map(cat => {
                    const id = cat.categories_id || cat.categoryId || cat.id;
                    const name = cat.categories_name || cat.categoryName || cat.name;
                    const storedImg = getStoredCategoryImage(id, name);
                    const finalImg = (cat.image_url || cat.image || cat.imageUrl || storedImg || "").trim();
                    return {
                        ...cat,
                        image_url: finalImg || null,
                        image: finalImg,
                        imageUrl: finalImg
                    };
                });
                return {
                    ...resData,
                    data: enriched
                };
            }
            return normalizeResponse(resData, "CATEGORIES SEARCHED SUCCESSFULLY");
        } catch (error) {
            return {
                success: false,
                message: getCategoryErrorMessage(error, "Search request failed.")
            };
        }
    }
};

export default categoryService;
