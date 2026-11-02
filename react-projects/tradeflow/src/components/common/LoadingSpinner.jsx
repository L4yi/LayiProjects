import React from "react";
import PageSkeleton from "./PageSkeleton";

// Upgraded Loading component.
// By default, it renders a layout-accurate, shimmering PageSkeleton matching
// the structure of the page (metric cards, tables, or staff grid).
// If a circular spinner is explicitly requested (variant="spinner"), it falls back to the spinner.
export default function LoadingSpinner({
    variant = "table",
    viewMode = "grid",
    columns,
    rowCount = 7,
    padding = "80px 0"
}) {
    if (variant === "spinner") {
        return (
            <div style={{ textAlign: "center", padding }}>
                <i
                    className="bi bi-arrow-repeat"
                    style={{
                        fontSize: "2.5rem",
                        color: "#143526",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite"
                    }}
                />
            </div>
        );
    }

    return (
        <PageSkeleton
            variant={variant}
            viewMode={viewMode}
            columns={columns}
            rowCount={rowCount}
        />
    );
}
