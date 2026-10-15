import React from "react";

/**
 * Reusable PageHeader Component
 * Provides standard module top badge, breadcrumb, and title bar with action slots.
 */
export default function PageHeader({
    badgeIcon,
    badgeTitle,
    breadcrumb,
    title,
    countSubtitle,
    actions,
    className = ""
}) {
    return (
        <div className={`common-page-header-container ${className}`}>
            {(badgeIcon || badgeTitle || breadcrumb) && (
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        {badgeIcon && <i className={badgeIcon}></i>}
                        {badgeTitle && <span>{badgeTitle}</span>}
                    </div>
                    {breadcrumb && <div className="module-breadcrumb">{breadcrumb}</div>}
                </div>
            )}

            {(title || actions) && (
                <div className="module-header-bar">
                    <div className="header-left">
                        {title && <h2 className="module-main-title">{title}</h2>}
                        {countSubtitle && <span className="module-count-subtitle">{countSubtitle}</span>}
                    </div>
                    {actions && <div className="header-right">{actions}</div>}
                </div>
            )}
        </div>
    );
}
