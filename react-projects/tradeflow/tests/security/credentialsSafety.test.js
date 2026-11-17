import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { initTestEnv } from "../setup.js";

const env = initTestEnv();

const { setSessionUser, getSessionUser } = await import("../../src/utils/session.js");

describe("Security: Sensitive Data & Credentials Leak Prevention", () => {
    beforeEach(() => {
        env.clear();
    });

    test("passwords and raw hashes are never retained in persistent user session cache", () => {
        setSessionUser({
            id: "USR-SAFE",
            name: "John Doe",
            email: "john@tradeflow.com",
            password: "PlaintextSecretPassword123!",
            confirmPassword: "PlaintextSecretPassword123!"
        });

        const storedRaw = localStorage.getItem("tradeflow_active_user");
        assert.ok(storedRaw);

        // Verify password was not persisted in stored user session
        const parsed = JSON.parse(storedRaw);
        assert.equal(parsed.password, undefined, "Plaintext password must never be persisted in localStorage session");
        assert.equal(parsed.confirmPassword, undefined, "Confirm password must never be persisted in localStorage session");
    });
});
