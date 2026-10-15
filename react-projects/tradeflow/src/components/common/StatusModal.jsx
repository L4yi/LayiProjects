import React, { useEffect } from "react";

export default function StatusModal({
    isOpen,
    onClose,
    type = "success",
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
                <div className={`status-modal-icon-circle ${type}`}>
                    {type === "success" && <i className="bi bi-check-lg"></i>}
                    {type === "error" && <i className="bi bi-x-lg"></i>}
                    {type === "warning" && <i className="bi bi-exclamation-lg"></i>}
                    {type === "info" && <i className="bi bi-info-lg"></i>}
                </div>

                <h3 className="status-modal-title">{title}</h3>

                {message && <p className="status-modal-message">{message}</p>}

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
