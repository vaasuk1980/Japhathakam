/* ==========================================================
   Japhathakam Enterprise Form Engine
   Build Initial Form State
-------------------------------------------------------------
   Creates the enterprise form state expected by
   Form Selectors and Form Reducer.

   Sprint 5.20
   - Initializes validation metadata for every field.
========================================================== */

export default function buildInitialFormState(schema) {
    const initialState = {
        values: {},
        errors: {},
        touched: {},
        dirty: {},
        disabled: {},
        readonly: {},
        loading: {},
        metadata: {},
    };

    if (!schema?.sections) {
        return initialState;
    }

    schema.sections.forEach((section) => {
        section.fields.forEach((field) => {
            const id = field.id;

            initialState.values[id] = field.defaultValue ?? "";
            initialState.errors[id] = "";
            initialState.touched[id] = false;
            initialState.dirty[id] = false;
            initialState.disabled[id] = field.disabled ?? false;
            initialState.readonly[id] = field.readOnly ?? false;
            initialState.loading[id] = false;

            initialState.metadata[id] = {
                validation: field.validation ?? [],
            };
        });
    });

    return initialState;
}