/* ==========================================================
   Japhathakam Enterprise Form Engine
   Validation Controller
-------------------------------------------------------------
   Centralizes field validation orchestration.

   Responsibilities
   - Execute validation rules.
   - Update field error state.
   - Clear errors when validation succeeds.

   NOTE
   This controller does NOT know anything about UI.
========================================================== */

import validateField from "../../FormEngine/validation/validators/validateField";

export default function validateController({
    field,
    value,
    actions,
}) {
    const error = validateField(field, value);

    if (error) {
        actions.setError(field.name, error);
    } else {
        actions.clearError(field.name);
    }

    return error;
}