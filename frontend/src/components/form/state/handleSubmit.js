/* ==========================================================
   Enterprise Form Submit Handler

   Handles the browser submit event and delegates
   form submission to the enterprise submit engine.
========================================================== */

import submitForm from "./submitForm";

export default function handleSubmit({
    event,
    values,
    validateForm,
    setErrors,
    onSubmit,
}) {

    event.preventDefault();

    submitForm({
        values,
        validateForm,
        setErrors,
        onSubmit,
    });
}