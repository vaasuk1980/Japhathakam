import "./SectionRenderer.css";

import FieldRenderer from "../FieldRenderer";

function SectionRenderer({ section }) {
    return (
        <section className="jp-form-section">

            <div className="jp-form-section__header">
                <h3 className="jp-form-section__title">
                    {section.title}
                </h3>
            </div>

            <div className="jp-form-section__body">
                {section.fields.map((field) => (
                    <FieldRenderer
                        key={field.id}
                        field={field}
                    />
                ))}
            </div>

        </section>
    );
}

export default SectionRenderer;