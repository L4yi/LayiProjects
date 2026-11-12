import React from "react";
import { Navigate } from "react-router-dom";
import { getSessionUser } from "../../utils/session";

/**
 * Protects a route based on a permission predicate function.
 * If permission fails, redirects safely to /dashboard.
 */
export default function RoleRouteGuard({ permissionCheck, children, fallbackTo = "/dashboard" }) {
    const user = getSessionUser();

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    const hasAccess = typeof permissionCheck === "function" ? permissionCheck(user) : true;

    if (!hasAccess) {
        return <Navigate to={fallbackTo} replace />;
    }

    return children;
}
