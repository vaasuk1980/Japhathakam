import { forwardRef, useId } from "react";

import FormError from "../FormError";

import "./TextArea.css";

const TextArea = forwardRef(function TextArea(
    {
        id,
        label,
        name,

        value,
        defaultValue,

        placeholder = "",

        rows = 4,

        required = false,
        disabled = false,
        readOnly = false,

        autoFocus = false,
        autoComplete,

        maxLength,
        minLength,

        helperText = "",
        error = "",
        success = "",

        className = "",
        style,

        onChange,
        onBlur,
        onFocus,

        ...props
    },
    ref
) {
    const generatedId = useId();

    const textAreaId = id || name || generatedId;

    const helperId = helperText
        ? `${textAreaId}-helper`
        : undefined;

    const errorId = error
        ? `${textAreaId}-error`
        : undefined;

    const describedBy =
        [helperId, errorId]
            .filter(Boolean)
            .join(" ") || undefined;

    const isControlled = value !== undefined;

    const rootClassName = [
        "jp-textarea",
        error && "jp-textarea--error",
        disabled && "jp-textarea--disabled",
        readOnly && "jp-textarea--readonly",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={rootClassName}
            style={style}
        >
            {label && (
                <label
                    htmlFor={textAreaId}
                    className="jp-textarea__label"
                >
                    {label}

                    {required && (
                        <span className="jp-textarea__required">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="jp-textarea__wrapper">
                <textarea
                    ref={ref}
                    id={textAreaId}
                    name={name}
                    rows={rows}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    minLength={minLength}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-invalid={!!error}
                    aria-required={required}
                    aria-describedby={describedBy}
                    className="jp-textarea__field"
                    {...(isControlled
                        ? { value }
                        : { defaultValue })}
                    {...props}
                />
            </div>

            {!error && helperText && (
                <small
                    id={helperId}
                    className="jp-textarea__helper"
                >
                    {helperText}
                </small>
            )}

            {!error && success && (
                <small className="jp-textarea__success">
                    {success}
                </small>
            )}

            {error && (
                <div id={errorId}>
                    <FormError>
                        {error}
                    </FormError>
                </div>
            )}
        </div>
    );
});

TextArea.displayName = "TextArea";

export default TextArea;