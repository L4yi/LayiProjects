import React from "react";
import { Link } from "react-router-dom";

/**
 * Modern, bold TradeFlow vector logo mark:
 * A distinctive "TF" lettermark in crisp white and radiant mint with forward trade motion,
 * unmistakably representing TradeFlow.
 */
export function TradeFlowIcon({ size = 22, className = "" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Letter 'T' in crisp pure white */}
            <rect x="2.5" y="4.5" width="8.5" height="2.8" rx="1.4" style={{ fill: "#FFFFFF" }} />
            <rect x="5.35" y="4.5" width="2.8" height="15" rx="1.4" style={{ fill: "#FFFFFF" }} />

            {/* Letter 'F' in radiant mint with forward trade motion */}
            <rect x="13" y="4.5" width="2.8" height="15" rx="1.4" style={{ fill: "#34D399" }} />
            <rect x="13" y="4.5" width="8.5" height="2.8" rx="1.4" style={{ fill: "#34D399" }} />
            {/* Middle crossbar with dynamic forward trade arrow */}
            <path d="M13 10.8H18.2L20.8 12.15L18.2 13.5H13V10.8Z" style={{ fill: "#34D399" }} />
        </svg>
    );
}

export default function BrandLogo({
    to = "/dashboard",
    onClick,
    showText = true,
    className = ""
}) {
    return (
        <Link to={to} className={`solara-logo ${className}`} onClick={onClick}>
            <div className="brand-logo-icon">
                <TradeFlowIcon size={22} />
            </div>
            {showText && <span className="brand-title">TradeFlow</span>}
        </Link>
    );
}
