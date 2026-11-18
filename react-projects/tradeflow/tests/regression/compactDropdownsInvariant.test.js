import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getWishlistCount } from "../../src/utils/wishlist.js";

describe("Regression Invariant: Compact Dropdowns & Universal Search", () => {
    test("CustomerLayout.jsx defines compact dropdown groups (Shop, Orders, Account, Notif)", () => {
        const layoutCode = fs.readFileSync(path.resolve("src/components/CustomerLayout.jsx"), "utf-8");
        
        assert.ok(layoutCode.includes("cust-header-dropdown-wrap"), "Must render compact dropdown wrapper");
        assert.ok(layoutCode.includes("toggleDropdown(\"shop\""), "Must contain Shop dropdown toggle");
        assert.ok(layoutCode.includes("toggleDropdown(\"orders\""), "Must contain Orders dropdown toggle");
        assert.ok(layoutCode.includes("toggleDropdown(\"account\""), "Must contain Account dropdown toggle");
        assert.ok(layoutCode.includes("customer-notif-dropdown-menu"), "Must render bell notifications dropdown");
    });

    test("CustomerLayout.jsx implements collapsible sidebar accordions defaulting to closed", () => {
        const layoutCode = fs.readFileSync(path.resolve("src/components/CustomerLayout.jsx"), "utf-8");
        
        assert.ok(layoutCode.includes("sidebar-accordion-group"), "Must contain sidebar accordion groups");
        assert.ok(layoutCode.includes("catalog: false"), "Catalog accordion must default to false/closed");
        assert.ok(layoutCode.includes("orders: false"), "Orders accordion must default to false/closed");
        assert.ok(layoutCode.includes("preferences: false"), "Preferences accordion must default to false/closed");
    });

    test("CustomerLayout.jsx removes redundant My Profile nav from sidebar bottom and leaves only Log-Out", () => {
        const layoutCode = fs.readFileSync(path.resolve("src/components/CustomerLayout.jsx"), "utf-8");
        
        assert.equal(layoutCode.includes("cust-my-profile-nav"), false, "Must not render redundant cust-my-profile-nav");
        assert.ok(layoutCode.includes("logout-item"), "Must retain clean logout item");
    });

    test("CustomerLayout.jsx places Wishlist directly under My Cart with dynamic count badge", () => {
        const layoutCode = fs.readFileSync(path.resolve("src/components/CustomerLayout.jsx"), "utf-8");
        
        const cartIndex = layoutCode.indexOf("to=\"/customer/cart\"");
        const wishlistIndex = layoutCode.indexOf("to=\"/customer/wishlist\"");
        assert.ok(cartIndex !== -1 && wishlistIndex !== -1, "Both cart and wishlist must exist in sidebar");
        assert.ok(wishlistIndex > cartIndex, "Wishlist must be positioned after My Cart");
        assert.ok(layoutCode.includes("getWishlistCount"), "Must use getWishlistCount");
        assert.equal(typeof getWishlistCount(), "number");
    });

    test("TopHeader.jsx implements live debounced search and autocomplete for admin", () => {
        const headerCode = fs.readFileSync(path.resolve("src/components/TopHeader.jsx"), "utf-8");
        
        assert.ok(headerCode.includes("admin-search-wrapper"), "Must contain admin search wrapper");
        assert.ok(headerCode.includes("admin-search-dropdown-popup"), "Must contain admin search popup");
        assert.ok(headerCode.includes("productService.searchProduct"), "Must query backend for search");
        assert.ok(headerCode.includes("navigate(`/orders?search="), "Must offer shortcut to orders search");
        assert.ok(headerCode.includes("navigate(`/customers?search="), "Must offer shortcut to customers search");
    });

    test("Orders.jsx synchronizes search query from URL search params", () => {
        const ordersCode = fs.readFileSync(path.resolve("src/pages/Orders.jsx"), "utf-8");
        
        assert.ok(ordersCode.includes("useSearchParams"), "Orders.jsx must import useSearchParams");
        assert.ok(ordersCode.includes("searchParams.get(\"search\")"), "Orders.jsx must read search query param");
    });

    test("Sidebar.jsx does not render redundant shop-btn under user profile widget", () => {
        const sidebarCode = fs.readFileSync(path.resolve("src/components/Sidebar.jsx"), "utf-8");
        
        assert.equal(sidebarCode.includes("className=\"shop-btn\""), false, "Sidebar.jsx must eliminate redundant shop-btn");
    });
});
