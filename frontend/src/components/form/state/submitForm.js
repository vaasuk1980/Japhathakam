/* ==========================================================
   Enterprise Form Submit

   Executes validation before submitting the form.
========================================================== */

export default function submitForm({
    values,
    validateForm,
    setErrors,
    onSubmit,
}) {

    const validationErrors = validateForm(values);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
        return false;
    }

    if (typeof onSubmit === "function") {
        onSubmit(values);
    }

    return true;
}