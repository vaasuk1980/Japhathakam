import "./FormError.css";

function FormError({
    children,
    className = "",
    style,
    ...props
}) {
    if (!children) {
        return null;
    }

    const errorClassName = [
        "jp-form-error",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <p
            className={errorClassName}
            style={style}
            role="alert"
            {...props}
        >
            {children}
        </p>
    );
}

FormError.displayName = "FormError";

export default FormError;