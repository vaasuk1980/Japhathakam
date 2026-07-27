import "./DynamicForm.css";

import { useMemo } from "react";

import FormStateProvider from "../../form/state/FormStateProvider";
import buildInitialFormState from "../../../utils/forms/buildInitialFormState";

import DynamicFormContent from "./DynamicFormContent";

function DynamicForm({
    schema,
    onSubmit,
    submitLabel,
    formId,
    hideSubmitButton = false,
    footer,
}) {

    const initialState = useMemo(
        () => buildInitialFormState(schema),
        [schema]
    );

    return (
        <FormStateProvider initialState={initialState}>

            <DynamicFormContent
                schema={schema}
                onSubmit={onSubmit}
                submitLabel={submitLabel}
                formId={formId}
                hideSubmitButton={hideSubmitButton}
                footer={footer}
            />

        </FormStateProvider>
    );
}

export default DynamicForm;