/* ==========================================================
   Japhathakam Enterprise Form Engine
   Build Initial Form State
-------------------------------------------------------------
   Creates the initial reducer state from the form schema.
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

            const fieldName = field.name ?? field.id;

            initialState.values[fieldName] = field.defaultValue ?? "";
            initialState.errors[fieldName] = "";
            initialState.touched[fieldName] = false;
            initialState.dirty[fieldName] = false;
            initialState.disabled[fieldName] = field.disabled ?? false;
            initialState.readonly[fieldName] = field.readOnly ?? false;
            initialState.loading[fieldName] = false;
            initialState.metadata[fieldName] = {
                ...field,
            };

        });

    });

    return initialState;
}