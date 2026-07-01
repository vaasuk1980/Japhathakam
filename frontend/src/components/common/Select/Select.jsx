import { forwardRef } from "react";
import "./Select.css";

const Select = forwardRef(function Select(
  {
    id,
    name,
    label,
    value,
    defaultValue = "",
    onChange,
    options = [],
    placeholder = "Select an option",
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
    "select-group",
    fullWidth ? "select-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selectClass = [
    "select-field",
    error ? "select-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={id} className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={id}
        name={name}
        className={selectClass}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        onChange={onChange}
        {...(value !== undefined
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

      {error && (
        <small className="select-error-text">
          {error}
        </small>
      )}
    </div>
  );
});

export default Select;