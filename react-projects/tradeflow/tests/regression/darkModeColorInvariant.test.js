import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

describe("Regression Invariant: Comprehensive Dark Mode UI Colors & Contrast", () => {
    it("contants.css defines authoritative dark mode root variables for Slate 950/900 palette", () => {
        const constantsPath = path.join(projectRoot, "src/assets/styles/contants.css");
        const constantsCss = fs.readFileSync(constantsPath, "utf-8");

        assert.match(constantsCss, /\[data-theme="dark"\]/, "contants.css must contain [data-theme='dark'] selector");
        assert.match(constantsCss, /--dashboard-bg:\s*#0b1120/, "contants.css must define #0b1120 as dark dashboard bg");
        assert.match(constantsCss, /--card-bg-color:\s*#0f172a/, "contants.css must define #0f172a as dark card surface");
        assert.match(constantsCss, /--sidebar-bg:\s*#0f172a/, "contants.css must define #0f172a as dark sidebar bg");
        assert.match(constantsCss, /--primary-color:\s*#10b981/, "contants.css must define #10b981 as primary emerald accent in dark mode");
        assert.match(constantsCss, /--success-color:\s*#34d399/, "contants.css must define #34d399 as vibrant emerald success in dark mode");
    });

    it("MainStyle.css overrides customer-order-card and receipt modal in dark mode", () => {
        const mainStylePath = path.join(projectRoot, "src/assets/styles/MainStyle.css");
        const mainCss = fs.readFileSync(mainStylePath, "utf-8");

        // Customer Order Card Dark Rules
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.customer-order-card[\s\S]*?#0f172a/, "customer-order-card must have #0f172a surface in dark mode");
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.order-dest-chip[\s\S]*?#1e293b/, "order-dest-chip must have elevated dark slate background");
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.btn-view-order-receipt[\s\S]*?#1e293b/, "btn-view-order-receipt must have dark elevated background");
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.order-total-amount[\s\S]*?#34d399/, "order-total-amount must have #34d399 vibrant emerald color in dark mode");

        // Receipt Modal Dark Rules
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.receipt-modal-card[\s\S]*?#0f172a/, "receipt-modal-card must be styled in dark mode");
    });

    it("MainStyle.css overrides profile identity card, form container, and addresses in dark mode", () => {
        const mainStylePath = path.join(projectRoot, "src/assets/styles/MainStyle.css");
        const mainCss = fs.readFileSync(mainStylePath, "utf-8");

        assert.match(mainCss, /\[data-theme="dark"\]\s+\.profile-identity-card[\s\S]*?#0f172a/, "profile-identity-card must have dark background");
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.profile-form-container-card[\s\S]*?#0f172a/, "profile-form-container-card must have dark background");
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.address-item-card[\s\S]*?#0f172a/, "address-item-card must have dark background");
        assert.match(mainCss, /\[data-theme="dark"\]\s+\.bank-details-grid[\s\S]*?#1e293b/, "bank-details-grid must have dark elevated background");
    });

    it("MainStyle.css & components.css style admin drawers, tables, and modals in dark mode", () => {
        const mainStylePath = path.join(projectRoot, "src/assets/styles/MainStyle.css");
        const mainCss = fs.readFileSync(mainStylePath, "utf-8");
        const componentsPath = path.join(projectRoot, "src/assets/styles/components.css");
        const componentsCss = fs.readFileSync(componentsPath, "utf-8");

        assert.match(mainCss, /\[data-theme="dark"\]\s+\.admin-slide-drawer[\s\S]*?#0f172a/, "admin-slide-drawer must have dark surface");
        assert.match(componentsCss, /\[data-theme="dark"\]\s+\.common-table-card[\s\S]*?#0f172a/, "common-table-card must have dark surface in components.css");
        assert.match(componentsCss, /\[data-theme="dark"\]\s+\.status-modal-card[\s\S]*?#0f172a/, "status-modal-card must have dark surface in components.css");
    });

    it("skeleton.css styles skeleton placeholders with dark slate gradients in dark mode", () => {
        const skeletonPath = path.join(projectRoot, "src/assets/styles/skeleton.css");
        const skeletonCss = fs.readFileSync(skeletonPath, "utf-8");

        assert.match(skeletonCss, /\[data-theme="dark"\]\s+\.skeleton-box[\s\S]*?#1e293b/, "skeleton-box must shimmer with dark slate gradients in dark mode");
        assert.match(skeletonCss, /\[data-theme="dark"\]\s+\.skeleton-metric-card[\s\S]*?#0f172a/, "skeleton cards must have dark surface");
    });
});
