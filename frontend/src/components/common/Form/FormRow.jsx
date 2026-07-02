import "./FormRow.css";

function FormRow({
    children,
    className = "",
    style,
    ...props
}) {
    const rowClassName = [
        "jp-form-row",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={rowClassName}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
}

FormRow.displayName = "FormRow";

export default FormRow;