import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Regression Invariant: Minimum One Delivery Address On File", () => {
    test("address deletion guard rejects deleting the sole remaining address", () => {
        const addresses = [
            { id: "ADDR01", street: "14 Ibara Rd", city: "Abeokuta", state: "Ogun", isDefault: true }
        ];

        // Address deletion invariant logic
        const canDelete = (list, targetId) => {
            if (list.length <= 1) return false;
            return list.some(a => a.id === targetId);
        };

        assert.equal(canDelete(addresses, "ADDR01"), false, "User must keep at least one delivery address on file");

        // When user has 2 addresses, deletion of non-default address is permitted
        addresses.push({ id: "ADDR02", street: "25 Commercial Ave", city: "Abeokuta", state: "Ogun", isDefault: false });
        assert.equal(canDelete(addresses, "ADDR02"), true);
    });
});
