import { useEffect } from "react";

import Button from "../Button";

import "./ConfirmDialog.css";

/**
 * Blocking confirmation modal for destructive/consequential actions
 * (Delete, Save, Reset) — replaces raw window.confirm() with a
 * styled dialog matching the rest of the app, since a bare browser
 * popup reads as unfinished in an enterprise product.
 */
function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "primary",
    isProcessing = false,
    onConfirm,
    onCancel,
}) {

    // Escape closes it like any modal, but only while it's actually
    // open — otherwise this would swallow Escape app-wide.
    useEffect(() => {

        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onCancel();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);

    }, [isOpen, onCancel]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="confirm-dialog__overlay"
            onClick={onCancel}
            role="presentation"
        >
            <div
                className="confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="confirm-dialog-title" className="confirm-dialog__title">
                    {title}
                </h2>

                <p id="confirm-dialog-message" className="confirm-dialog__message">
                    {message}
                </p>

                <div className="confirm-dialog__actions">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        {cancelLabel}
                    </Button>

                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Please wait..." : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );

}

export default ConfirmDialog;
