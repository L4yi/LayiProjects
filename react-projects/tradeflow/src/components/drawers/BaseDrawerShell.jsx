import React from "react";

// Reusable drawer shell component.
// Provides the dark overlay backdrop, animated drawer panel, header gradient,
// close button, error banner, and bottom Cancel/Save action buttons.
export default function BaseDrawerShell({
    isOpen,
    onClose,
    title = "Edit Details",
    subtitle = "Please complete the form below with accurate details.",
    icon = "bi bi-pencil-square",
    entityType = "Item",
    isSaving = false,
    errorMessage = "",
    onSubmit,
    children,
    saveButtonText = "Save Changes"
}) {
    if (!isOpen) return null;

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="admin-slide-drawer" onClick={(e) => e.stopPropagation()}>
                {/* Top header bar with gradient and close button */}
                <div className="drawer-header-gradient">
                    <div className="drawer-header-left">
                        <div className="drawer-header-icon">
                            <i className={icon}></i>
                        </div>
                        <h3 className="drawer-title">{title}</h3>
                    </div>
                    <button
                        type="button"
                        className="drawer-close-btn"
                        onClick={onClose}
                        title="Close Drawer"
                    >
                        <i className="bi bi-x-lg"></i> Close
                    </button>
                </div>

                {/* Subtitle helper bar */}
                <div className="drawer-subtitle-bar">
                    <p>
                        You are about to modify <strong>{entityType}</strong>. {subtitle}
                    </p>
                </div>

                {/* Optional error banner */}
                {errorMessage && (
                    <div
                        style={{
                            margin: "12px 20px 0",
                            background: "#fee2e2",
                            border: "1px solid #f87171",
                            color: "#991b1b",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            fontSize: "0.88rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Scrollable form body */}
                <form className="drawer-body-scroll" onSubmit={onSubmit}>
                    {children}

                    {/* Bottom action buttons */}
                    <div className="drawer-footer-actions">
                        <button
                            type="button"
                            className="btn-drawer-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-drawer-save"
                            disabled={isSaving}
                            style={{ opacity: isSaving ? 0.75 : 1, cursor: isSaving ? "not-allowed" : "pointer" }}
                        >
                            {isSaving ? (
                                <span>
                                    <i className="bi bi-arrow-repeat spin" style={{ marginRight: "6px" }}></i>
                                    Saving...
                                </span>
                            ) : (
                                <span>
                                    <i className="bi bi-check2-circle"></i> {saveButtonText}
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
