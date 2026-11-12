import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/tradeflow-logo.png";
import markImg from "../../assets/tradeflow-mark.png";

/**
 * Official TradeFlow vector mark icon
 */
export function TradeFlowIcon({ size = 26, className = "" }) {
    return (
        <img
            src={markImg}
            alt="TradeFlow Mark"
            width={size}
            height={size}
            className={`tradeflow-brand-mark ${className}`}
            style={{ objectFit: "contain", display: "inline-block" }}
        />
    );
}

/**
 * Official TradeFlow brand logo lockup:
 * Uses the exact bespoke brand mark and custom typography supplied by TradeFlow.
 */
export default function BrandLogo({
    to = "/dashboard",
    onClick,
    showText = true,
    className = "",
    variant = "full", // "full" or "mark"
    height = 30
}) {
    if (variant === "mark" || !showText) {
        return (
            <Link to={to} className={`solara-logo tradeflow-brand-link ${className}`} onClick={onClick}>
                <img
                    src={markImg}
                    alt="TradeFlow"
                    style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
                    className="tradeflow-brand-mark-img"
                />
            </Link>
        );
    }

    return (
        <Link to={to} className={`solara-logo tradeflow-brand-link ${className}`} onClick={onClick}>
            <img
                src={logoImg}
                alt="TradeFlow"
                style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
                className="tradeflow-brand-logo-img"
            />
        </Link>
    );
}
