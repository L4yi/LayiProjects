import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initTestEnv } from "../setup.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = initTestEnv();

const { getSessionUser, setSessionUser, clearSessionUser } = await import("../../src/utils/session.js");
const { getNormalizedRole, canAccessStaffs, isCustomer } = await import("../../src/utils/permissions.js");
const { default: api } = await import("../../src/api/axios.js");
const { default: authService } = await import("../../src/services/authService.js");

describe("Integration: Authentication Lifecycle & RBAC State Transition", () => {
    beforeEach(() => {
        env.clear();
    });

    test("customer auth lifecycle: login -> normalized state -> role verification -> logout", () => {
        // Step 1: Initial unauthenticated state
        let session = getSessionUser();
        assert.equal(session.id, undefined);

        // Step 2: Customer logs in
        setSessionUser({
            customerId: "CUST-104",
            firstName: "Quadri",
            lastName: "Lasisi",
            email: "quadri@tradeflow.com",
            roleId: "19",
            role: "Customer"
        });

        session = getSessionUser();
        assert.equal(session.customerId, "CUST-104");
        assert.equal(session.id, "CUST-104");
        assert.equal(isCustomer(session), true);
        assert.equal(canAccessStaffs(session), false); // Cannot access staff portal

        // Step 3: Logout
        clearSessionUser();
        const postLogout = getSessionUser();
        assert.equal(postLogout.id, undefined);
        assert.equal(postLogout.name, "Guest");
        assert.equal(postLogout.role, "GUEST");
        assert.equal(postLogout.isAuthenticated, false);
    });

    test("admin auth lifecycle: login -> permissions granted -> logout", () => {
        setSessionUser({
            staffId: "STF-99",
            name: "Chief Admin",
            roleId: "2",
            role: "ADMIN"
        });

        const adminSession = getSessionUser();
        assert.equal(getNormalizedRole(adminSession), "ADMIN");
        assert.equal(canAccessStaffs(adminSession), true);

        clearSessionUser();
        assert.equal(getSessionUser().id, undefined);
    });

    test("unified signIn routes matching admin DB credentials to /dashboard and non-admin customer credentials to /customer/dashboard", async () => {
        const origPost = api.post;
        try {
            // 1. Admin DB match
            api.post = async (url) => {
                if (url.includes("admin/auth/sign-in.php")) {
                    return {
                        data: {
                            success: true,
                            data: { staffId: "STF-01", firstName: "Admin", lastName: "One", emailAddress: "admin@tradeflow.com", roleId: "2", roleName: "ADMIN" }
                        }
                    };
                }
                throw new Error("Unexpected endpoint: " + url);
            };

            const adminRes = await authService.signIn("admin@tradeflow.com", "secret123");
            assert.equal(adminRes.success, true);
            assert.equal(adminRes.portal, "admin");
            assert.equal(adminRes.redirectTo, "/dashboard");
            assert.equal(isCustomer(getSessionUser()), false);

            // 2. Not in admin DB -> verified against customer DB -> routes to /customer/dashboard
            clearSessionUser();
            api.post = async (url) => {
                if (url.includes("admin/auth/sign-in.php")) {
                    return { data: { success: false, message: "INVALID LOGIN DETAILS!" } };
                }
                if (url.includes("customer/auth/sign-in.php")) {
                    return {
                        data: {
                            success: true,
                            data: { customerId: "CUST-202", firstName: "Layi", lastName: "Shopper", emailAddress: "layi@shopper.com" }
                        }
                    };
                }
                throw new Error("Unexpected endpoint: " + url);
            };

            const custRes = await authService.signIn("layi@shopper.com", "custpass");
            assert.equal(custRes.success, true);
            assert.equal(custRes.portal, "customer");
            assert.equal(custRes.redirectTo, "/customer/dashboard");
            assert.equal(isCustomer(getSessionUser()), true);
        } finally {
            api.post = origPost;
        }
    });

    test("regression: no dedicated admin login portal or 'Go to Admin Portal' links remain", () => {
        const srcDir = path.resolve(__dirname, "../../src/pages");
        const signInSrc = fs.readFileSync(path.join(srcDir, "SignIn.jsx"), "utf8");
        const signUpSrc = fs.readFileSync(path.join(srcDir, "customer/CustomerSignUp.jsx"), "utf8");
        const appSrc = fs.readFileSync(path.join(srcDir, "App.jsx"), "utf8");

        assert.equal(fs.existsSync(path.join(srcDir, "customer/CustomerSignIn.jsx")), false);
        assert.equal(signInSrc.includes("Staff Sign In"), false);
        assert.equal(signInSrc.includes("Admin Portal"), false);
        assert.equal(signUpSrc.includes("Go to Admin Portal"), false);
        assert.equal(appSrc.includes('Navigate to="/signin"'), true);
    });
});
