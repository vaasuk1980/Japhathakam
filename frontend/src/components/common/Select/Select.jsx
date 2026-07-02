import { forwardRef, useId } from "react";

import FormError from "../FormError";

import "./Select.css";

const Select = forwardRef(function Select(
    {
        id,
        label,
        name,

        value,
        defaultValue,

        options = [],

        placeholder = "Select an option",

        required = false,
        disabled = false,

        autoFocus = false,
        autoComplete,

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

    const selectId = id || name || generatedId;

    const helperId = helperText
        ? `${selectId}-helper`
        : undefined;

    const errorId = error
        ? `${selectId}-error`
        : undefined;

    const describedBy =
        [helperId, errorId]
            .filter(Boolean)
            .join(" ") || undefined;

    const isControlled = value !== undefined;

    const rootClassName = [
        "jp-select",
        error && "jp-select--error",
        disabled && "jp-select--disabled",
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
                    htmlFor={selectId}
                    className="jp-select__label"
                >
                    {label}

                    {required && (
                        <span className="jp-select__required">
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="jp-select__wrapper">
                <select
                    ref={ref}
                    id={selectId}
                    name={name}
                    required={required}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-invalid={!!error}
                    aria-required={required}
                    aria-describedby={describedBy}
                    className="jp-select__field"
                    {...(isControlled
                        ? { value }
                        : { defaultValue })}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {!error && helperText && (
                <small
                    id={helperId}
                    className="jp-select__helper"
                >
                    {helperText}
                </small>
            )}

            {!error && success && (
                <small className="jp-select__success">
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

Select.displayName = "Select";

export default Select;