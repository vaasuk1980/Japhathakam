import { useCallback, useEffect } from "react";

import useForm from "../../form/state/useForm";

import validateForm from "../../../utils/forms/validateForm";

import SectionRenderer from "../SectionRenderer";
import SubmitButton from "../SubmitButton/SubmitButton";

function DynamicFormContent({
    schema,
    onSubmit,
    submitLabel,
    formId,
    hideSubmitButton = false,
    footer,
    onValuesChange,
}) {

    const {
        state,
        actions,
    } = useForm();

    // Live mirror of the form's own internal values, for a caller
    // that needs "whatever is currently typed" without waiting for
    // an explicit Submit — e.g. Save Changes shouldn't silently save
    // stale data just because the user didn't also re-click Generate
    // Kundali after editing a field.
    useEffect(() => {
        onValuesChange?.(state.values);
    }, [state.values, onValuesChange]);

    const handleSubmit = useCallback(
        (event) => {

            event.preventDefault();

            const result = validateForm(
                schema,
                state.values
            );

            /* ==========================================
               Clear Previous Errors
            ========================================== */

            Object.keys(state.errors).forEach((fieldName) => {
                actions.clearError(fieldName);
            });

            /* ==========================================
               Validation Failed
            ========================================== */

            if (!result.isValid) {

                Object.entries(result.errors).forEach(
                    ([fieldName, error]) => {

                        actions.setError(fieldName, error);

                        // Mark field as touched so UI displays the error
                        actions.setTouched(fieldName, true);

                    }
                );

                console.log("Validation Failed");
                console.log(result.errors);

                return;
            }

            /* ==========================================
               Validation Passed
            ========================================== */

            console.log("Validation Passed");
            console.log(state.values);

            if (typeof onSubmit === "function") {
                onSubmit(state.values);
            }

        },
        [
            schema,
            state,
            actions,
            onSubmit,
        ]
    );

    return (
        <form id={formId} onSubmit={handleSubmit} noValidate>

            {schema.sections.map((section, index) => (
                <SectionRenderer
                    key={section.id}
                    section={section}
                    footer={index === schema.sections.length - 1 ? footer : undefined}
                />
            ))}

            {!hideSubmitButton && <SubmitButton label={submitLabel} />}

        </form>
    );
}

export default DynamicFormContent;