import "./FormSection.css";

function FormSection({
    title,
    children,
    className = "",
    style,
    ...props
}) {
    const sectionClassName = [
        "jp-form-section",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <section
            className={sectionClassName}
            style={style}
            {...props}
        >
            {title && (
                <h2 className="jp-form-section__title">
                    {title}
                </h2>
            )}

            <div className="jp-form-section__content">
                {children}
            </div>
        </section>
    );
}

FormSection.displayName = "FormSection";

export default FormSection;