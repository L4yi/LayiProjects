import { INITIAL_CART_ITEMS } from "../data/storeData";

const CART_STORAGE_KEY = "tradeflow_cart";

/**
 * Get all cart items from localStorage or fallback to default
 */
export function getCartItems() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to read cart from localStorage:", e);
    }
    return INITIAL_CART_ITEMS;
}

/**
 * Save cart items to localStorage and notify listeners
 */
export function setCartItems(items) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
    }
    window.dispatchEvent(new CustomEvent("tradeflow_cart_update", { detail: items }));
}

/**
 * Add a product to the cart with specified quantity
 */
export function addToCart(product, quantity = 1) {
    const currentItems = getCartItems();
    const existingIndex = currentItems.findIndex(i => i.id === product.id);

    let updatedItems;
    if (existingIndex > -1) {
        updatedItems = currentItems.map((item, idx) => {
            if (idx === existingIndex) {
                return {
                    ...item,
                    quantity: item.quantity + quantity
                };
            }
            return item;
        });
    } else {
        const newItem = {
            id: product.id,
            name: product.name,
            categoryId: product.categoryId || "mobile-devices",
            categoryName: product.categoryName || "Mobile Devices",
            variation: product.variation || (product.subtitle ? product.subtitle.split("/")[0].trim() : "Standard Retail Edition"),
            price: product.price,
            oldPrice: product.oldPrice,
            discountPercent: product.discountPercent || 0,
            quantity: quantity,
            inStock: true,
            express: product.express !== undefined ? product.express : true,
            image: product.image
        };
        updatedItems = [newItem, ...currentItems];
    }

    setCartItems(updatedItems);
    return updatedItems;
}

/**
 * Update quantity for a cart item (+1 or -1)
 */
export function updateCartQuantity(productId, delta) {
    const currentItems = getCartItems();
    const updatedItems = currentItems.map(item => {
        if (item.id === productId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
        }
        return item;
    });
    setCartItems(updatedItems);
    return updatedItems;
}

/**
 * Remove an item from the cart
 */
export function removeCartItem(productId) {
    const currentItems = getCartItems();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    return updatedItems;
}

/**
 * Clear the entire cart
 */
export function clearCart() {
    setCartItems([]);
}

/**
 * Get total quantity count across all items
 */
export function getCartCount() {
    const items = getCartItems();
    return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
}

/**
 * Get subtotal price for all cart items
 */
export function getCartSubtotal() {
    const items = getCartItems();
    return items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
}
