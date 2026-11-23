import { parsePrice } from "./cart.js";
const WISHLIST_STORAGE_KEY = "tradeflow_wishlist";

// Cross-tab synchronization: broadcast localStorage changes to active window
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === WISHLIST_STORAGE_KEY) {
            try {
                const items = e.newValue ? JSON.parse(e.newValue) : [];
                window.dispatchEvent(new CustomEvent("tradeflow_wishlist_update", { detail: items }));
            } catch (err) {
                // Ignore parse errors from concurrent writes
            }
        }
    });
}

// Retrieve user's wishlist from localStorage (returns empty array if none saved)
export function getWishlistItems() {
    try {
        if (typeof localStorage !== "undefined") {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) return parsed;
            }
        }
    } catch (e) {
        console.error("Failed to read wishlist from localStorage:", e);
    }
    return [];
}

// Persist wishlist items to localStorage and notify listeners
export function setWishlistItems(items) {
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        }
    } catch (e) {
        console.error("Failed to save wishlist to localStorage:", e);
    }
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("tradeflow_wishlist_update", { detail: items }));
    }
}

// Add a real product to the wishlist
export function addToWishlist(product) {
    if (!product || !product.id) return getWishlistItems();
    const current = getWishlistItems();
    const existingIndex = current.findIndex(i => String(i.id) === String(product.id));

    if (existingIndex === -1) {
        const unitPrice = parsePrice(product.price || product.product_price);
        const oldPrice = parsePrice(product.oldPrice || (unitPrice * 1.15));
        const item = {
            id: String(product.id),
            name: product.name || product.product_name || "Product",
            price: unitPrice,
            oldPrice: oldPrice,
            discountPercent: product.discountPercent || 15,
            image: product.image || null,
            categoryId: product.categoryId || product.category_id || "",
            categoryName: product.categoryName || product.category_name || "Catalog"
        };
        const updated = [item, ...current];
        setWishlistItems(updated);
        return updated;
    }
    return current;
}

// Remove an item from the wishlist
export function removeFromWishlist(productId) {
    const current = getWishlistItems();
    const updated = current.filter(i => String(i.id) !== String(productId));
    setWishlistItems(updated);
    return updated;
}

// Clear all items from the wishlist
export function clearWishlist() {
    setWishlistItems([]);
    return [];
}

// Check if a product exists in user's wishlist
export function isInWishlist(productId) {
    if (!productId) return false;
    const current = getWishlistItems();
    return current.some(i => String(i.id) === String(productId));
}

// Retrieve current item count in wishlist
export function getWishlistCount() {
    return getWishlistItems().length;
}
