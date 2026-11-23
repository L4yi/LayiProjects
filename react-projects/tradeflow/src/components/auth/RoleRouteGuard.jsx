import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSessionUser } from "../../utils/session";

/**
 * Protects a route based on authentication and an optional permission predicate function.
 * If authentication fails, redirects safely to /signin (or /customer/signin).
 * If permission fails, redirects safely to /403.
 */
export default function RoleRouteGuard({ 
    permissionCheck, 
    children, 
    requireAuth = true, 
    authRedirect, 
    fallbackTo = "/403" 
}) {
    const location = useLocation();
    const user = getSessionUser();
    const isAuth = Boolean(user && user.isAuthenticated === true && user.role !== "GUEST" && (user.id || user.customerId || user.staffId));

    if (requireAuth && !isAuth) {
        const targetRedirect = authRedirect || (location.pathname.startsWith("/customer") ? "/customer/signin" : "/signin");
        return <Navigate to={targetRedirect} replace />;
    }

    const hasAccess = typeof permissionCheck === "function" ? permissionCheck(user) : true;

    if (!hasAccess) {
        return <Navigate to={fallbackTo} replace />;
    }

    return children;
}
