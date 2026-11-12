const SESSION_USER_KEY = "tradeflow_active_user";

export function getInitials(name = "") {
    if (!name) return "SU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getSessionUser() {
    try {
        const stored = sessionStorage.getItem(SESSION_USER_KEY) || localStorage.getItem(SESSION_USER_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const name = parsed.name || `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || parsed.email || "Staff User";

            // Authoritative role & customer identity normalization:
            // 1: STAFF, 2: ADMIN, 3: SUPER ADMIN, 19: Customer
            const rId = String(parsed.roleId || parsed.role_id || "").trim();
            const rName = String(parsed.role || parsed.roleName || "").toUpperCase().trim();
            const hasCustomerId = Boolean(parsed.customerId || parsed.customer_id);
            const isCustomer = hasCustomerId || parsed.isCustomer === true || rId === "19" || rName.includes("CUSTOMER");

            let role = "STAFF";
            let roleId = "1";

            if (isCustomer) {
                role = "Customer";
                roleId = "19";
            } else if (rId === "3" || rName.includes("SUPER")) {
                role = "SUPER ADMIN";
                roleId = "3";
            } else if (rId === "2" || rName.includes("ADMIN")) {
                role = "ADMIN";
                roleId = "2";
            } else {
                role = "STAFF";
                roleId = "1";
            }

            // Restore persistent profile photo from user cache if available
            const userId = parsed.customerId || parsed.customer_id || parsed.staffId || parsed.staff_id || parsed.id || parsed.email;
            let cachedPhoto = null;
            if (userId) {
                try {
                    cachedPhoto = localStorage.getItem(`tradeflow_photo_${userId}`);
                } catch {
                    // Ignore localStorage read errors
                }
            }

            const profileImage = parsed.profileImage || parsed.avatar || parsed.avatarUrl || parsed.image || cachedPhoto || null;

            return {
                ...parsed,
                name,
                role,
                roleName: role,
                roleId,
                isCustomer,
                profileImage,
                avatar: profileImage,
                avatarUrl: profileImage,
                initials: parsed.initials || getInitials(name)
            };
        }
    } catch (e) {
        console.warn("Could not read session user:", e);
    }

    return {
        name: "Staff User",
        email: "",
        initials: "SU",
        role: "STAFF",
        roleName: "STAFF",
        roleId: "1",
        isCustomer: false,
        profileImage: null,
        avatar: null
    };
}

export function setSessionUser(userData) {
    if (!userData) return getSessionUser();
    try {
        const name = userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || userData.email || "Staff User";
        const rId = String(userData.roleId || userData.role_id || "").trim();
        const rName = String(userData.role || userData.roleName || "").toUpperCase().trim();
        const hasCustomerId = Boolean(userData.customerId || userData.customer_id);
        const isCustomer = hasCustomerId || userData.isCustomer === true || rId === "19" || rName.includes("CUSTOMER");

        let role = "STAFF";
        let roleId = "1";

        if (isCustomer) {
            role = "Customer";
            roleId = "19";
        } else if (rId === "3" || rName.includes("SUPER")) {
            role = "SUPER ADMIN";
            roleId = "3";
        } else if (rId === "2" || rName.includes("ADMIN")) {
            role = "ADMIN";
            roleId = "2";
        } else {
            role = "STAFF";
            roleId = "1";
        }

        const userId = userData.customerId || userData.customer_id || userData.staffId || userData.staff_id || userData.id || userData.email;
        const profileImage = userData.profileImage || userData.avatar || userData.avatarUrl || userData.image || null;

        if (userId && profileImage) {
            try {
                localStorage.setItem(`tradeflow_photo_${userId}`, profileImage);
            } catch {
                // Ignore localStorage quota limits
            }
        }

        const updated = {
            ...userData,
            name,
            role,
            roleName: role,
            roleId,
            isCustomer,
            profileImage,
            avatar: profileImage,
            avatarUrl: profileImage,
            initials: userData.initials || getInitials(name)
        };
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updated));
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(updated));

        window.dispatchEvent(new Event("tradeflow_session_update"));
        return updated;
    } catch (e) {
        console.warn("Could not save session user:", e);
        return userData;
    }
}

export function clearSessionUser() {
    try {
        sessionStorage.removeItem(SESSION_USER_KEY);
        localStorage.removeItem(SESSION_USER_KEY);
        localStorage.removeItem("accessToken");
        window.dispatchEvent(new Event("tradeflow_session_update"));
    } catch (e) {
        console.warn("Could not clear session user:", e);
    }
}
