import "./FormSection.css";

function FormSection({ title, children }) {
    return (
        <section className="jp-form-section">
            <h2 className="jp-form-section__title">{title}</h2>

            <div className="jp-form-section__content">
                {children}
            </div>
        </section>
    );
}

export default FormSection;