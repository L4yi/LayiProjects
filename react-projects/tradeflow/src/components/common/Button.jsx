import React from "react";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    onClick,
    disabled = false,
    isLoading = false,
    loadingText,
    icon,
    iconRight,
    className = "",
    style = {},
    ...rest
}) {
    const variantClass = `common-btn-${variant}`;
    const sizeClass = `common-btn-${size}`;
    const loadingClass = isLoading ? "is-loading" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`common-btn ${variantClass} ${sizeClass} ${loadingClass} ${className}`}
            style={style}
            {...rest}
        >
            {isLoading ? (
                <>
                    <span className="common-btn-spinner" aria-hidden="true"></span>
                    <span>{loadingText || children}</span>
                </>
            ) : (
                <>
                    {icon && <i className={`${icon} common-btn-icon-left`}></i>}
                    {children}
                    {iconRight && <i className={`${iconRight} common-btn-icon-right`}></i>}
                </>
            )}
        </button>
    );
}
