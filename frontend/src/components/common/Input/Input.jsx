import { forwardRef, useId } from "react";
import "./Input.css";
import FormError from "../FormError";

const Input = forwardRef(function Input(
    {
        id,
        label,
        name,
        type = "text",

        value,
        defaultValue,

        placeholder = "",

        required = false,
        disabled = false,
        readOnly = false,

        autoFocus = false,
        autoComplete,

        maxLength,
        minLength,

        pattern,
        inputMode,

        helperText = "",
        error = "",
        success = "",

        prefix,
        suffix,

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

    const inputId = id || name || generatedId;

    const helperId = helperText
        ? `${inputId}-helper`
        : undefined;

    const errorId = error
        ? `${inputId}-error`
        : undefined;

    const describedBy =
        [helperId, errorId]
            .filter(Boolean)
            .join(" ") || undefined;

    const isControlled = value !== undefined;

    const rootClassName = [
        "jp-input",
        error && "jp-input--error",
        disabled && "jp-input--disabled",
        readOnly && "jp-input--readonly",
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
                    htmlFor={inputId}
                    className="jp-input__label"
                >
                    {label}

                    {required && (
                        <span className="jp-input__required">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="jp-input__wrapper">
                {prefix && (
                    <span className="jp-input__prefix">
                        {prefix}
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    minLength={minLength}
                    pattern={pattern}
                    inputMode={inputMode}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-invalid={!!error}
                    aria-required={required}
                    aria-describedby={describedBy}
                    className="jp-input__field"
                    {...(isControlled
                        ? { value }
                        : { defaultValue })}
                    {...props}
                />

                {suffix && (
                    <span className="jp-input__suffix">
                        {suffix}
                    </span>
                )}
            </div>

            {!error && helperText && (
                <small
                    id={helperId}
                    className="jp-input__helper"
                >
                    {helperText}
                </small>
            )}

            {!error && success && (
                <small className="jp-input__success">
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

Input.displayName = "Input";

export default Input;