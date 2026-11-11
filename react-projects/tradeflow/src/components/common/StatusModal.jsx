import React, { useEffect } from "react";

export default function StatusModal({
    isOpen,
    onClose,
    type = "success",
    title = "Operation Successful!",
    message = "",
    buttonText = "Okay, Continue",
    onConfirm,
    autoCloseDelay = null,
    closeOnOverlayClick = false,
    showCancel = false,
    cancelButtonText = "Cancel",
    confirmButtonText = "",
    onCancel,
    confirmVariant = "primary"
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

    const handleCancel = () => {
        if (onCancel) onCancel();
        else if (onClose) onClose();
    };

    const isDelete = type === "delete" || confirmVariant === "danger";

    return (
        <div
            className="status-modal-overlay"
            onClick={closeOnOverlayClick ? (onClose || handleAction) : undefined}
        >
            <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className={`status-modal-icon-circle ${type}`}>
                    {type === "success" && <i className="bi bi-check-lg"></i>}
                    {type === "error" && <i className="bi bi-x-lg"></i>}
                    {type === "warning" && <i className="bi bi-exclamation-lg"></i>}
                    {type === "info" && <i className="bi bi-info-lg"></i>}
                    {type === "delete" && <i className="bi bi-trash3-fill"></i>}
                </div>

                <h3 className="status-modal-title">{title}</h3>

                {message && <p className="status-modal-message">{message}</p>}

                {showCancel ? (
                    <div className="status-modal-actions-row">
                        <button
                            type="button"
                            className="status-modal-btn-cancel"
                            onClick={handleCancel}
                        >
                            {cancelButtonText}
                        </button>
                        <button
                            type="button"
                            className={`status-modal-btn ${isDelete ? "status-modal-btn-danger" : ""}`}
                            onClick={handleAction}
                        >
                            {confirmButtonText || buttonText || "Confirm"}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className={`status-modal-btn ${isDelete ? "status-modal-btn-danger" : ""}`}
                        onClick={handleAction}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
}
