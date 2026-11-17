import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Performance: Production Bundle Budget & Asset Chunking", () => {
    test("entry chunk index-*.js does not exceed strict 150 kB performance budget", () => {
        const assetsDir = path.resolve("dist/assets");
        assert.ok(fs.existsSync(assetsDir), "dist/assets directory must exist (run build first)");

        const files = fs.readdirSync(assetsDir);
        const indexJs = files.find(f => f.startsWith("index-") && f.endsWith(".js"));
        assert.ok(indexJs, "Production index-*.js chunk must exist");

        const stats = fs.statSync(path.join(assetsDir, indexJs));
        const sizeInKb = stats.size / 1024;

        // Strict performance budget: entry bundle must be under 150 kB
        assert.ok(
            sizeInKb < 150, 
            `Entry chunk size (${sizeInKb.toFixed(2)} kB) exceeds 150 kB budget! Code-splitting required.`
        );
    });

    test("vendor libraries are cleanly isolated in react-vendor chunk", () => {
        const assetsDir = path.resolve("dist/assets");
        const files = fs.readdirSync(assetsDir);
        const vendorChunk = files.find(f => f.startsWith("react-vendor-") && f.endsWith(".js"));

        assert.ok(vendorChunk, "Vendor chunk react-vendor-*.js must be isolated");
    });
});
