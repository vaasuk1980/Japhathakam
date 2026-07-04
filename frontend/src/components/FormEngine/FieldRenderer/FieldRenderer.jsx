import "./FieldRenderer.css";

import controlRegistry from "../../form/registry";

function FieldRenderer({ field }) {
    const Control = controlRegistry[field.type];

    if (!Control) {
        return (
            <div className="jp-form-field">
                Unsupported field type: {field.type}
            </div>
        );
    }

    return (
        <div className="jp-form-field">
            <Control
                {...field}
                name={field.id}
                label={field.label}
            />
        </div>
    );
}

export default FieldRenderer;