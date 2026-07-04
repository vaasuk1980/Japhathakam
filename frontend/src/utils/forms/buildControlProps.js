/* ==========================================================
   Enterprise Control Props Builder

   Creates a normalized control object consumed by
   all form components.
========================================================== */

export default function buildControlProps(field, fieldState) {
    return {
        id: field.id,
        name: field.name,

        value: fieldState.value,

        error: fieldState.error,
        touched: fieldState.touched,

        required: field.required ?? false,
        disabled: field.disabled ?? false,
        readOnly: field.readOnly ?? false,

        placeholder: field.placeholder ?? "",

        onChange: fieldState.onChange,
        onBlur: fieldState.onBlur,
    };
}