import { useCallback } from "react";

import useForm from "../../form/state/useForm";

import SectionRenderer from "../SectionRenderer";
import SubmitButton from "../SubmitButton/SubmitButton";

function DynamicFormContent({
    schema,
    onSubmit,
}) {

    const {
        state,
    } = useForm();

    const handleSubmit = useCallback(
        (event) => {

            event.preventDefault();

            console.log("========== FORM STATE ==========");
            console.log(state);

            console.log("========== FORM VALUES ==========");
            console.log(state.values);

            if (typeof onSubmit === "function") {
                onSubmit(state.values);
            }

        },
        [state, onSubmit]
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