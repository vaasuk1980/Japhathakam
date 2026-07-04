/* ==========================================================
   Enterprise Dynamic Form

   Root component responsible for initializing
   enterprise form state and providing it to
   the form lifecycle.
========================================================== */

import "./DynamicForm.css";

import { useMemo } from "react";

import FormStateProvider from "../../form/state/FormStateProvider";
import buildInitialFormState from "../../../utils/forms/buildInitialFormState";

import FormContent from "./FormContent";

function DynamicForm({
    schema,
    onSubmit,
}) {

    const initialState = useMemo(
        () => buildInitialFormState(schema),
        [schema]
    );

    return (
        <FormStateProvider
            initialState={initialState}
        >
            <FormContent
                schema={schema}
                onSubmit={onSubmit}
            />
        </FormStateProvider>
    );
}

export default DynamicForm;