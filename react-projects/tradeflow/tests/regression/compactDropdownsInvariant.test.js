import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Regression Invariant: Compact Dropdowns & Universal Search", () => {
    test("CustomerLayout.jsx defines compact dropdown groups (Shop, Orders, Account, Notif)", () => {
        const layoutCode = fs.readFileSync(path.resolve("src/components/CustomerLayout.jsx"), "utf-8");
        
        assert.ok(layoutCode.includes("cust-header-dropdown-wrap"), "Must render compact dropdown wrapper");
        assert.ok(layoutCode.includes("toggleDropdown(\"shop\""), "Must contain Shop dropdown toggle");
        assert.ok(layoutCode.includes("toggleDropdown(\"orders\""), "Must contain Orders dropdown toggle");
        assert.ok(layoutCode.includes("toggleDropdown(\"account\""), "Must contain Account dropdown toggle");
        assert.ok(layoutCode.includes("customer-notif-dropdown-menu"), "Must render bell notifications dropdown");
    });

    test("CustomerLayout.jsx implements collapsible sidebar accordions", () => {
        const layoutCode = fs.readFileSync(path.resolve("src/components/CustomerLayout.jsx"), "utf-8");
        
        assert.ok(layoutCode.includes("sidebar-accordion-group"), "Must contain sidebar accordion groups");
        assert.ok(layoutCode.includes("toggleAccordion(\"catalog\")"), "Must toggle catalog accordion");
        assert.ok(layoutCode.includes("toggleAccordion(\"orders\")"), "Must toggle orders accordion");
        assert.ok(layoutCode.includes("toggleAccordion(\"preferences\")"), "Must toggle preferences accordion");
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
