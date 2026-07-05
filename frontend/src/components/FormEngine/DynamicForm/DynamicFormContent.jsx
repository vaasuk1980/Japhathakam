import { useCallback } from "react";

import useForm from "../../form/state/useForm";

import validateForm from "../../../utils/forms/validateForm";

import SectionRenderer from "../SectionRenderer";
import SubmitButton from "../SubmitButton/SubmitButton";

function DynamicFormContent({
    schema,
    onSubmit,
}) {

    const {
        state,
        actions,
    } = useForm();

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
        <form onSubmit={handleSubmit}>

            {schema.sections.map((section) => (
                <SectionRenderer
                    key={section.id}
                    section={section}
                />
            ))}

            <SubmitButton />

        </form>
    );
}

export default DynamicFormContent;