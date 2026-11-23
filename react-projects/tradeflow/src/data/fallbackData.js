/**
 * Centralized verified fallback datasets for categories and products
 * when backend database connectivity is unavailable or endpoints return empty.
 */

export const VERIFIED_FALLBACK_CATEGORIES = [
    {
        id: "CAT20261109082827",
        title: "Mobile Devices & phones",
        name: "Mobile Devices & phones",
        badge: "Active",
        image: null,
        itemCount: "1 Item"
    },
    {
        id: "CAT20261109082915",
        title: "Beauty, Health & Hair",
        name: "Beauty, Health & Hair",
        badge: "Active",
        image: null,
        itemCount: "1 Item"
    },
    {
        id: "CAT20261109083002",
        title: "Office & School Supplies",
        name: "Office & School Supplies",
        badge: "Active",
        image: null,
        itemCount: "1 Item"
    },
    {
        id: "CAT20261109083045",
        title: "Groceries & Supermarket",
        name: "Groceries & Supermarket",
        badge: "Active",
        image: null,
        itemCount: "1 Item"
    }
];

export const VERIFIED_FALLBACK_PRODUCTS = [
    {
        id: "PROD20261109083122",
        productId: "PROD20261109083122",
        name: "Samsung Galaxy A15",
        subtitle: "Mobile Devices & phones",
        categories_name: "Mobile Devices & phones",
        rating: 5,
        price: "₦ 185,000",
        oldPrice: "₦ 212,750",
        product_price: 185000,
        image: ""
    }
];
