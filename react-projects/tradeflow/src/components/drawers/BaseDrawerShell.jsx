import React, { useEffect } from "react";
import {
    Drawer,
    DrawerBackdrop,
    DrawerContent,
    DrawerTitle,
    DrawerDescription
} from "@ui-sdk/react/drawer";

// Reusable drawer shell component powered by @ui-sdk/react headless primitives.
// Retains TradeFlow's design system: dark backdrop overlay, slide-in panel,
// header gradient, responsive mobile layout, error banner, and docked bottom footer.
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
    saveButtonText = "Save Changes",
    readOnly = false
}) {
    // Keyboard Escape listener as an accessible fallback
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <Drawer
            open={isOpen}
            side="right"
            onOpenChange={(open) => {
                if (!open) {
                    onClose?.();
                }
            }}
        >
            <DrawerBackdrop className="drawer-overlay" onClick={onClose} />
            <DrawerContent className="admin-slide-drawer">
                {/* Top header bar with gradient and close button */}
                <div className="drawer-header-gradient">
                    <div className="drawer-header-left">
                        <div className="drawer-header-icon">
                            <i className={icon}></i>
                        </div>
                        <DrawerTitle className="drawer-title" style={{ margin: 0 }}>
                            {title}
                        </DrawerTitle>
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
                    <DrawerDescription asChild>
                        <p style={{ margin: 0 }}>
                            You are {readOnly ? "viewing" : "about to modify"} <strong>{entityType}</strong>. {subtitle}
                        </p>
                    </DrawerDescription>
                </div>

                {/* Optional error banner */}
                {errorMessage && (
                    <div className="drawer-error-alert">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Form container with scrollable body and docked bottom footer */}
                <form
                    className="drawer-main-form"
                    noValidate
                    onSubmit={readOnly ? (e) => { e.preventDefault(); onClose?.(); } : onSubmit}
                >
                    <div className="drawer-body-scroll">
                        {children}
                    </div>

                    {/* Bottom docked action buttons */}
                    <div className="drawer-footer-actions">
                        <button
                            type="button"
                            className="btn-drawer-cancel"
                            onClick={onClose}
                        >
                            {readOnly ? "Close" : "Cancel"}
                        </button>
                        {!readOnly && (
                            <button
                                type="submit"
                                className={`btn-drawer-save ${isSaving ? "is-saving" : ""}`}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <span>
                                        <i className="bi bi-arrow-repeat spin drawer-spin-icon"></i>
                                        Saving...
                                    </span>
                                ) : (
                                    <span>
                                        <i className="bi bi-check2-circle"></i> {saveButtonText}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
