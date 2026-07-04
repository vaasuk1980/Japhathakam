/* ==========================================================
   Japhathakam Enterprise Validation Engine
   Validate Field
-------------------------------------------------------------
   Validates a single field against its schema definition.
========================================================== */

export default function validateField(field, value) {

    if (!field) {
        return "";
    }

    /* ======================================================
       Required
    ====================================================== */

    if (
        field.required &&
        (value === "" ||
            value === null ||
            value === undefined)
    ) {
        return `${field.label} is required.`;
    }

    /* ======================================================
       Maximum Length
    ====================================================== */

    if (
        typeof value === "string" &&
        field.maxLength &&
        value.length > field.maxLength
    ) {
        return `${field.label} cannot exceed ${field.maxLength} characters.`;
    }

    /* ======================================================
       Minimum Value
    ====================================================== */

    if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        field.min !== undefined &&
        Number(value) < field.min
    ) {
        return `${field.label} must be at least ${field.min}.`;
    }

    /* ======================================================
       Maximum Value
    ====================================================== */

    if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        field.max !== undefined &&
        Number(value) > field.max
    ) {
        return `${field.label} cannot exceed ${field.max}.`;
    }

    return "";
}