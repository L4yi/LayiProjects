const CART_STORAGE_KEY = "tradeflow_cart";

// Cross-tab synchronization: broadcast localStorage changes to active window
if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
        if (e.key === CART_STORAGE_KEY) {
            try {
                const items = e.newValue ? JSON.parse(e.newValue) : [];
                window.dispatchEvent(new CustomEvent("tradeflow_cart_update", { detail: items }));
            } catch (err) {
                // Ignore parse errors from concurrent writes
            }
        }
    });
}

// Safely normalize prices that may arrive as strings ("₦14,500", "12.50") or numbers
export function parsePrice(val) {
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    if (!val) return 0;
    // Strip HTML tags first to neutralize markup and handler injection
    const tagFree = String(val).replace(/<[^>]*>/g, "").trim();
    const cleaned = tagFree.replace(/[^0-9.-]+/g, "");
    if (!cleaned) return 0;
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

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
    const existingIndex = currentItems.findIndex(i => String(i.id) === String(product.id));

    const unitPrice = parsePrice(product.price);
    const oldPrice = parsePrice(product.oldPrice || (unitPrice * 1.15));

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
            id: String(product.id),
            name: product.name,
            categoryId: product.categoryId || "",
            categoryName: product.categoryName || "",
            variation: product.variation || (product.subtitle ? product.subtitle.split("/")[0].trim() : "Standard Edition"),
            price: unitPrice,
            oldPrice: oldPrice,
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
        if (String(item.id) === String(productId)) {
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
    const updatedItems = currentItems.filter(item => String(item.id) !== String(productId));
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
    const rawTotal = items.reduce((acc, item) => acc + (parsePrice(item.price) * (item.quantity || 1)), 0);
    return Math.round(rawTotal * 100) / 100;
}
