import "./FormSection.css";

function FormSection({
    title,
    children,
    className = "",
    style,
    ...props
}) {
    const sectionClassName = [
        "jpfs-section",
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
                <h2 className="jpfs-section__title">
                    {title}
                </h2>
            )}

            <div className="jpfs-section__content">
                {children}
            </div>
        </section>
    );
}

FormSection.displayName = "FormSection";

export default FormSection;