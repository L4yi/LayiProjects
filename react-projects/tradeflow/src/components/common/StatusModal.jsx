import React, { useEffect } from "react";

/**
 * Reusable StatusModal Component (Matching Image 2 design)
 * Features:
 * - Centered dialog over dark backdrop
 * - Circular success/error icon (green checkmark for success)
 * - Bold uppercase status headline
 * - Optional descriptive subtext
 * - Pill-shaped action button with project theme colors ("Okay, Thanks")
 * - Optional auto-close timer
 */
export default function StatusModal({
    isOpen,
    onClose,
    type = "success", // "success" | "error" | "warning" | "info"
    title = "Operation Successful!",
    message = "",
    buttonText = "Okay, Thanks",
    onConfirm,
    autoCloseDelay = null
}) {
    useEffect(() => {
        if (!isOpen || !autoCloseDelay) return;
        const timer = setTimeout(() => {
            if (onConfirm) onConfirm();
            else if (onClose) onClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
    }, [isOpen, autoCloseDelay, onConfirm, onClose]);

    if (!isOpen) return null;

    const handleAction = () => {
        if (onConfirm) onConfirm();
        else if (onClose) onClose();
    };

    return (
        <div className="status-modal-overlay" onClick={onClose}>
            <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Big Circular Icon */}
                <div className={`status-modal-icon-circle ${type}`}>
                    {type === "success" && <i className="bi bi-check-lg"></i>}
                    {type === "error" && <i className="bi bi-x-lg"></i>}
                    {type === "warning" && <i className="bi bi-exclamation-lg"></i>}
                    {type === "info" && <i className="bi bi-info-lg"></i>}
                </div>

                {/* Bold Headline */}
                <h3 className="status-modal-title">{title}</h3>

                {/* Optional Message */}
                {message && <p className="status-modal-message">{message}</p>}

                {/* Pill Button styled with Project Colors */}
                <button
                    type="button"
                    className="status-modal-btn"
                    onClick={handleAction}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
