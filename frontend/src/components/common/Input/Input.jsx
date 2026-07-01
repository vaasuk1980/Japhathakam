import { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(function Input(
  {
    id,
    name,
    label,
    type = "text",
    placeholder = "",
    value,
    defaultValue,
    onChange,
    disabled = false,
    required = false,
    error = "",
    fullWidth = false,
    autoComplete = "off",
    ...props
  },
  ref
) {
  const wrapperClass = [
    "input-group",
    fullWidth ? "input-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClass = [
    "input-field",
    error ? "input-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        {...props}
      />

      {error && (
        <small className="input-error-text">
          {error}
        </small>
      )}
    </div>
  );
});

export default Input;