import React from "react";
import { Link } from "react-router-dom";

/**
 * Modern, bespoke TradeFlow vector logo mark:
 * An interlocking dynamic monogram of the letters "T" and "F" formed by continuous fluid trade paths,
 * symbolizing seamless flow, commerce fulfillment, and modern financial exchange.
 */
export function TradeFlowIcon({ size = 22, className = "" }) {
    return (
        <svg
            viewBox="0 0 32 32"
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="tfGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="tfGradWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
            </defs>

            {/* Top Trade Bar (The bold horizontal crossbeam of the "T") */}
            <path
                d="M4.5 9.5C4.5 7.84315 5.84315 6.5 7.5 6.5H24.5C26.1569 6.5 27.5 7.84315 27.5 9.5C27.5 11.1569 26.1569 12.5 24.5 12.5H7.5C5.84315 12.5 4.5 11.1569 4.5 9.5Z"
                fill="url(#tfGradEmerald)"
            />

            {/* Continuous Vertical Fluid Stem (forming the body of T and looping into the return flow) */}
            <path
                d="M13 12.5V20.5C13 23.2614 15.2386 25.5 18 25.5C20.7614 25.5 23 23.2614 23 20.5V19.5"
                stroke="url(#tfGradWhite)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Flow Forward Branch (forming the central crossbar of "F" with energetic forward motion) */}
            <path
                d="M13 17.5H22.5C23.8807 17.5 25 18.6193 25 20C25 21.3807 23.8807 22.5 22.5 22.5H19"
                stroke="url(#tfGradEmerald)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Geometric Accent Node */}
            <circle cx="8" cy="9.5" r="1.5" fill="#143526" />
        </svg>
    );
}

export default function BrandLogo({
    to = "/dashboard",
    onClick,
    showText = true,
    className = "",
    subtitle = ""
}) {
    return (
        <Link to={to} className={`solara-logo ${className}`} onClick={onClick}>
            <div className="brand-logo-icon">
                <TradeFlowIcon size={22} />
            </div>
            {showText && (
                <div className="brand-text-wrap" style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                    <span className="brand-title">TradeFlow</span>
                    {subtitle && (
                        <span
                            className="brand-sub-badge"
                            style={{
                                fontSize: "10px",
                                color: "#64748b",
                                fontWeight: 600,
                                letterSpacing: "0.4px",
                                textTransform: "uppercase",
                                marginTop: "2px"
                            }}
                        >
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}
