import React from "react";

export default function TableCard({
    title,
    subtitle,
    headerActions,
    children,
    footer,
    isEmpty = false,
    emptyIcon = "bi-inbox",
    emptyMessage = "No records found",
    className = "",
    style = {},
}) {
    return (
        <div className={`common-table-card ${className}`} style={style}>
            {(title || headerActions) && (
                <div className="common-table-header">
                    <div>
                        {title && <h3 className="common-table-title">{title}</h3>}
                        {subtitle && <p className="common-table-subtitle">{subtitle}</p>}
                    </div>
                    {headerActions && <div className="common-table-actions">{headerActions}</div>}
                </div>
            )}

            <div className="common-table-body">
                {isEmpty ? (
                    <div className="common-table-empty">
                        <i className={`bi ${emptyIcon} common-table-empty-icon`}></i>
                        <p>{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="common-table-responsive">{children}</div>
                )}
            </div>

            {footer && <div className="common-table-footer">{footer}</div>}
        </div>
    );
}
