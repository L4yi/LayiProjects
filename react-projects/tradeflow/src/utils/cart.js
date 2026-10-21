const CART_STORAGE_KEY = "tradeflow_cart";

export function getCartItems() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to read cart from localStorage:", e);
    }
    return [];
}

export function setCartItems(items) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
    }
    window.dispatchEvent(new CustomEvent("tradeflow_cart_update", { detail: items }));
}

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
            categoryId: product.categoryId || "",
            categoryName: product.categoryName || "",
            variation: product.variation || (product.subtitle ? product.subtitle.split("/")[0].trim() : "Standard Edition"),
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

export function removeCartItem(productId) {
    const currentItems = getCartItems();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    return updatedItems;
}

export function clearCart() {
    setCartItems([]);
}

export function getCartCount() {
    const items = getCartItems();
    return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
}

export function getCartSubtotal() {
    const items = getCartItems();
    return items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
}
