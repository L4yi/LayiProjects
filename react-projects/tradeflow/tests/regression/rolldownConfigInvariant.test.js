import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Regression Invariant: Vite & Rolldown Bundler manualChunks Signature", () => {
    test("vite.config.js declares manualChunks as a function rather than an object map", () => {
        const viteConfig = fs.readFileSync(path.resolve("vite.config.js"), "utf-8");
        
        // Rolldown strictly requires manualChunks(id) as a function
        const isFunctionalChunking = viteConfig.includes("manualChunks(id)") || viteConfig.includes("manualChunks: (id)");
        assert.equal(isFunctionalChunking, true, "vite.config.js must use functional manualChunks(id) for Rolldown compatibility");
    });
});
