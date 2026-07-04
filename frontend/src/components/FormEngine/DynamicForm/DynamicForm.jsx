import "./DynamicForm.css";

import { useMemo } from "react";

import FormStateProvider from "../../form/state/FormStateProvider";
import buildInitialFormState from "../../../utils/forms/buildInitialFormState";

import SectionRenderer from "../SectionRenderer";

function DynamicForm({ schema }) {

    const initialState = useMemo(
        () => buildInitialFormState(schema),
        [schema]
    );

    return (
        <FormStateProvider initialState={initialState}>

            <div className="jp-dynamic-form">

                {schema.sections.map((section) => (
                    <SectionRenderer
                        key={section.id}
                        section={section}
                    />
                ))}

            </div>

        </FormStateProvider>
    );
}

export default DynamicForm;