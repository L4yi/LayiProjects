import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable MetricCard Component for Dashboard & Analytics
 * Supports:
 * - Single metric display (stat number, tag, trend badge, comparison text)
 * - Split metric display (e.g. Pending vs Canceled)
 * - Three-dots menu button
 * - Details navigation link
 */
export default function MetricCard({
    title,
    timeSubtitle = "Last 7 days",
    statNumber,
    statTag,
    trend,
    trendUp = true,
    compareText,
    compareVal,
    detailsLink,
    isSplit = false,
    splitData = null,
    onMenuClick,
    children,
    className = ""
}) {
    return (
        <div className={`metric-card ${className}`}>
            <div className="card-top">
                <div className="title-group">
                    <h3>{title}</h3>
                    {timeSubtitle && <span className="time-subtitle">{timeSubtitle}</span>}
                </div>
                <button type="button" className="menu-dots-btn" onClick={onMenuClick} title="Options">
                    <i className="bi bi-three-dots-vertical"></i>
                </button>
            </div>

            {children ? (
                children
            ) : isSplit && splitData ? (
                <div className="pending-canceled-row">
                    <div className="split-col">
                        <span className="col-label">{splitData.left?.label}</span>
                        <div className="stat-val-group">
                            <span className="val-num">{splitData.left?.value}</span>
                            {splitData.left?.sub && <span className="sub-user-tag">{splitData.left.sub}</span>}
                        </div>
                    </div>
                    <div className="split-divider"></div>
                    <div className="split-col">
                        <span className="col-label">{splitData.right?.label}</span>
                        <div className="stat-val-group">
                            <span className={`val-num ${splitData.right?.isNegative ? "val-red" : ""}`}>
                                {splitData.right?.value}
                            </span>
                            {splitData.right?.trend && (
                                <span className={splitData.right?.isNegative ? "trend-red" : "trend-badge trend-up"}>
                                    <i className={`bi bi-arrow-${splitData.right?.isNegative ? "down" : "up"}-short`}></i>
                                    {splitData.right.trend}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="stat-row">
                    {statNumber && <span className="stat-number">{statNumber}</span>}
                    {statTag && <span className="stat-tag">{statTag}</span>}
                    {trend && (
                        <span className={`trend-badge ${trendUp ? "trend-up" : "trend-down"}`}>
                            <i className={`bi bi-arrow-${trendUp ? "up" : "down"}-short`}></i> {trend}
                        </span>
                    )}
                </div>
            )}

            <div className={`card-bottom ${isSplit ? "justify-end" : ""}`}>
                {!isSplit && compareText && (
                    <span className="compare-text">
                        {compareText} {compareVal && <span className="val-blue">({compareVal})</span>}
                    </span>
                )}
                {detailsLink && (
                    <Link to={detailsLink} className="card-outline-btn">
                        Details
                    </Link>
                )}
            </div>
        </div>
    );
}
