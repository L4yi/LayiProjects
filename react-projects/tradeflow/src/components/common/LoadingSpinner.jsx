import React from "react";

export default function LoadingSpinner({ padding = "80px 0" }) {
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
