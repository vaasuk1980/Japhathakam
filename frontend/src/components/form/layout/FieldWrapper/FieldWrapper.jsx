/*
==================================================================
    Japhathakam Enterprise Form Framework
    Field Wrapper
------------------------------------------------------------------
    Shared layout wrapper for all form controls.

    Responsibilities
    ----------------
    • Label
    • Required indicator
    • Helper text
    • Error message
    • Accessibility container

    Does NOT manage:
    • Form state
    • Validation
    • Input rendering
==================================================================
*/

import "./FieldWrapper.css";

export default function FieldWrapper({
    label,
    required = false,
    hasError = false,
    helperText = "",
    error = "",
    inputId,
    helperId,
    children,
}) {
    return (
        <div
            className={`jp-field-wrapper ${
                hasError
                    ? "jp-field-wrapper--error"
                    : ""
            }`}
        >
            {label && (
                <label
                    htmlFor={inputId}
                    className="jp-field-wrapper__label"
                >
                    {label}

                    {required && (
                        <span className="jp-field-wrapper__required">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="jp-field-wrapper__control">
                {children}
            </div>

            <div
                id={helperId}
                className={`jp-field-wrapper__helper ${
                    hasError
                        ? "jp-field-wrapper__helper--error"
                        : ""
                }`}
            >
                {hasError ? error : helperText}
            </div>
        </div>
    );
}