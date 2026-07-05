/* ==========================================================
   Japhathakam Enterprise Form Engine
   Form Validation Utility
-------------------------------------------------------------
   Validates the complete form using the schema.
========================================================== */

export default function validateForm(schema, values) {

    const errors = {};

    for (const section of schema.sections) {

        for (const field of section.fields) {

            const value = values[field.id];

            /* ==================================================
               Required Validation
            ================================================== */

            if (field.required) {

                const isEmpty =
                    value === undefined ||
                    value === null ||
                    value === "";

                if (isEmpty) {
                    errors[field.id] =
                        `${field.label} is required.`;

                    continue;
                }
            }

            /* ==================================================
               Maximum Length
            ================================================== */

            if (
                field.maxLength &&
                typeof value === "string" &&
                value.length > field.maxLength
            ) {
                errors[field.id] =
                    `${field.label} cannot exceed ${field.maxLength} characters.`;
            }

            /* ==================================================
               Minimum Value
            ================================================== */

            if (
                field.min !== undefined &&
                value !== ""
            ) {

                if (Number(value) < field.min) {

                    errors[field.id] =
                        `${field.label} must be at least ${field.min}.`;
                }
            }

            /* ==================================================
               Maximum Value
            ================================================== */

            if (
                field.max !== undefined &&
                value !== ""
            ) {

                if (Number(value) > field.max) {

                    errors[field.id] =
                        `${field.label} cannot exceed ${field.max}.`;
                }
            }

        }

    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}