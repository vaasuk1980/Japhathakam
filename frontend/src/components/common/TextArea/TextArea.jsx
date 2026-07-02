import { forwardRef } from "react";
import "./TextArea.css";

const TextArea = forwardRef(function TextArea(
  {
    id,
    name,
    label,
    placeholder = "",
    value,
    defaultValue,
    onChange,
    rows = 4,
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
    "textarea-group",
    fullWidth ? "textarea-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const textareaClass = [
    "textarea-field",
    error ? "textarea-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={id} className="textarea-label">
          {label}
          {required && (
            <span className="required">*</span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={id}
        name={name}
        className={textareaClass}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        {...props}
      />

      {error && (
        <small className="textarea-error-text">
          {error}
        </small>
      )}
    </div>
  );
});

export default TextArea;