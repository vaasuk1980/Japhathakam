import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  type = "button",
  onClick,
}) {
  const className = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;