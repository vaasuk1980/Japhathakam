import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import "./Sheet.css";

/**
 * Side sheet (a full-screen sheet on phones) for editing without
 * leaving the page. Closes on Esc, the X button, or a click on the
 * scrim. Never prints.
 */
function Sheet({ title, onClose, children }) {

    const panelRef = useRef(null);

    useEffect(() => {

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        panelRef.current?.focus();

        return () => document.removeEventListener("keydown", handleKeyDown);

    }, [onClose]);

    return (
        <div className="jp-sheet no-print">
            <div className="jp-sheet__scrim" onClick={onClose} />

            <aside
                className="jp-sheet__panel"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                ref={panelRef}
            >
                <header className="jp-sheet__header">
                    <h2 className="jp-sheet__title">{title}</h2>

                    <button
                        type="button"
                        className="jp-sheet__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="jp-sheet__body">{children}</div>
            </aside>
        </div>
    );

}

export default Sheet;
