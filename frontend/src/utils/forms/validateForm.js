/* ==========================================================
   Japhathakam Enterprise Validation Engine
   Validate Form
-------------------------------------------------------------
   Validates all fields in a schema and returns an
   object containing field errors.
========================================================== */

import validateField from "./validateField";

export default function validateForm(schema, values) {
    const errors = {};

    if (!schema?.sections) {
        return errors;
    }

    schema.sections.forEach((section) => {
        section.fields.forEach((field) => {
            const error = validateField(
                field,
                values[field.id]
            );

            if (error) {
                errors[field.id] = error;
            }
        });
    });

    return errors;
}