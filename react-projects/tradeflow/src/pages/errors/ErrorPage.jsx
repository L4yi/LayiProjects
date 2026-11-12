import React, { useState } from "react";
import { Link, useNavigate, useParams, useRouteError } from "react-router-dom";
import { 
    AlertCircle, 
    ShieldAlert, 
    FileQuestion, 
    ServerCrash, 
    CloudOff, 
    ArrowLeft, 
    Home, 
    RotateCcw, 
    HelpCircle,
    ExternalLink,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { getSessionUser } from "../../utils/session";
import { BrandLogo } from "../../components/common";

const ERROR_CONFIGS = {
    400: {
        code: "400",
        badge: "Bad Request",
        title: "Invalid Request Format",
        subtitle: "The server could not understand your request due to malformed parameters, invalid payload, or expired session state.",
        icon: AlertCircle,
        accentColor: "#d97706",
        badgeBg: "#fef3c7"
    },
    403: {
        code: "403",
        badge: "Access Denied",
        title: "Permission Denied",
        subtitle: "You do not have the required role or authorization level to access this protected TradeFlow resource.",
        icon: ShieldAlert,
        accentColor: "#dc2626",
        badgeBg: "#fee2e2"
    },
    404: {
        code: "404",
        badge: "Page Not Found",
        title: "Lost in the Flow?",
        subtitle: "The page or destination you are looking for doesn't exist, was removed, or the link has changed.",
        icon: FileQuestion,
        accentColor: "#143526",
        badgeBg: "#ecfdf5"
    },
    500: {
        code: "500",
        badge: "Internal Server Error",
        title: "Unexpected Server Error",
        subtitle: "Something went wrong on the server while executing your request. Our technical team has logged this incident.",
        icon: ServerCrash,
        accentColor: "#dc2626",
        badgeBg: "#fee2e2"
    },
    503: {
        code: "503",
        badge: "Service Unavailable",
        title: "System Maintenance",
        subtitle: "TradeFlow services are temporarily undergoing maintenance or experiencing network congestion. Please check back shortly.",
        icon: CloudOff,
        accentColor: "#4f46e5",
        badgeBg: "#e0e7ff"
    }
};

export default function ErrorPage({ code: propCode, title: propTitle, subtitle: propSubtitle }) {
    const navigate = useNavigate();
    const routeParams = useParams();
    const routeError = useRouteError();
    const [showDetails, setShowDetails] = useState(false);

    const sessionUser = getSessionUser();
    const isCustomer = sessionUser?.role === "Customer" || String(sessionUser?.roleId) === "19";
    const homeRoute = isCustomer ? "/customer/dashboard" : "/dashboard";

    // Determine target HTTP status code
    const rawCode = propCode || routeParams.code || (routeError?.status) || 404;
    const config = ERROR_CONFIGS[rawCode] || ERROR_CONFIGS[404];

    const displayCode = config.code;
    const displayBadge = config.badge;
    const displayTitle = propTitle || config.title;
    const displaySubtitle = propSubtitle || routeError?.statusText || config.subtitle;
    const IconComponent = config.icon;

    // Technical error message if thrown by React Router or JS exception
    const technicalDetails = routeError?.data?.message || routeError?.message || (routeError && String(routeError));

    return (
        <div className="tradeflow-error-page">
            {/* Top Brand Header */}
            <header className="error-page-header">
                <BrandLogo to={homeRoute} />
                <div className="error-header-right">
                    <span className="system-status-indicator">
                        <span className="status-dot"></span> System Online
                    </span>
                </div>
            </header>

            {/* Error Body Card */}
            <main className="error-page-content">
                <div className="error-card">
                    {/* Visual Code & Icon Graphic */}
                    <div className="error-visual-wrap">
                        <div className="error-code-bg-watermark">{displayCode}</div>
                        <div 
                            className="error-icon-badge"
                            style={{ 
                                backgroundColor: config.badgeBg, 
                                color: config.accentColor,
                                borderColor: `${config.accentColor}33`
                            }}
                        >
                            <IconComponent size={44} strokeWidth={2.2} />
                        </div>
                    </div>

                    {/* Status Pill */}
                    <div 
                        className="error-status-pill"
                        style={{ color: config.accentColor, backgroundColor: config.badgeBg }}
                    >
                        HTTP {displayCode} &bull; {displayBadge}
                    </div>

                    {/* Headings */}
                    <h1 className="error-title">{displayTitle}</h1>
                    <p className="error-subtitle">{displaySubtitle}</p>

                    {/* Action Buttons */}
                    <div className="error-action-buttons">
                        <button 
                            type="button" 
                            className="btn-error-primary"
                            onClick={() => navigate(homeRoute)}
                        >
                            <Home size={16} />
                            <span>{isCustomer ? "Go to Store Home" : "Back to Dashboard"}</span>
                        </button>

                        <button 
                            type="button" 
                            className="btn-error-secondary"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={16} />
                            <span>Previous Page</span>
                        </button>

                        <button 
                            type="button" 
                            className="btn-error-ghost"
                            onClick={() => window.location.reload()}
                            title="Refresh this page"
                        >
                            <RotateCcw size={16} />
                            <span>Reload</span>
                        </button>
                    </div>

                    {/* Technical Stack / Exception Toggle */}
                    {technicalDetails && (
                        <div className="error-debug-section">
                            <button 
                                type="button" 
                                className="error-debug-toggle"
                                onClick={() => setShowDetails(prev => !prev)}
                            >
                                <span>Technical Diagnostics</span>
                                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            {showDetails && (
                                <pre className="error-debug-code">
                                    {technicalDetails}
                                </pre>
                            )}
                        </div>
                    )}

                    {/* Help & Fast Links */}
                    <div className="error-footer-links">
                        <span className="links-label">Quick Links:</span>
                        <Link to="/customer/products" className="quick-nav-link">Catalog Products</Link>
                        <span className="dot-divider">&bull;</span>
                        <Link to={isCustomer ? "/customer/orders" : "/orders"} className="quick-nav-link">Order Fulfillment</Link>
                        <span className="dot-divider">&bull;</span>
                        <Link to="/profile" className="quick-nav-link">Account Settings</Link>
                    </div>
                </div>
            </main>

            {/* Bottom Footer Note */}
            <footer className="error-page-footer">
                <p>&copy; {new Date().getFullYear()} TradeFlow Enterprise Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}
