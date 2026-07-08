import "./FieldRenderer.css";

import controlRegistry from "../../form/registry";

import useForm from "../../form/state/useForm";

import {
    evaluateFieldConditions,
} from "../../../utils/forms/conditions";

function FieldRenderer({ field }) {

    const {
        state,
    } = useForm();

    const Control = controlRegistry[field.type];

    const {
        visible,
    } = evaluateFieldConditions(
        field,
        state.values
    );

    /* ==========================================
       Conditional Rendering
    ========================================== */

    if (!visible) {
        return null;
    }

    /* ==========================================
       Unsupported Control
    ========================================== */

    if (!Control) {
        return (
            <div className="jp-form-field">
                Unsupported field type: {field.type}
            </div>
        );
    }

    /* ==========================================
       Render Control
    ========================================== */

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