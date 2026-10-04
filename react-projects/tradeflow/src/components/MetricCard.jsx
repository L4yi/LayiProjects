import React from "react";

export default function MetricCard({
    icon = "bi-bar-chart",
    label = "Metric",
    value = "0",
    change = "",
    isPositive = true,
    subtext = ""
}) {
    return (
        <div className="metric-card-item">
            <div className="metric-card-top">
                <span className="metric-card-label">{label}</span>
                <div className="metric-card-icon-box">
                    <i className={`bi ${icon}`}></i>
                </div>
            </div>
            <div className="metric-card-body">
                <h3 className="metric-card-value">{value}</h3>
                {(change || subtext) && (
                    <div className="metric-card-footer">
                        {change && (
                            <span className={`metric-trend-badge ${isPositive ? "positive" : "negative"}`}>
                                <i className={`bi ${isPositive ? "bi-arrow-up-short" : "bi-arrow-down-short"}`}></i>
                                {change}
                            </span>
                        )}
                        {subtext && <span className="metric-subtext">{subtext}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
