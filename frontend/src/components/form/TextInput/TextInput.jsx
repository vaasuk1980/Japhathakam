/*
==================================================================
    Japhathakam Enterprise Form Framework
    Enterprise Text Input
------------------------------------------------------------------
    Standard text input integrated with the Enterprise Form State
    Engine through the useField hook.
==================================================================
*/

import "./TextInput.css";

import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";

export default function TextInput({
    name,
    label,
    placeholder = "",
    type = "text",
    required = false,
    helperText = "",
}) {
    const field = useField(name);

    const {
        value,
        error,
        touched,
        disabled,
        readOnly,
        onChange,
        onBlur,
    } = field;

    const hasError = touched && Boolean(error);

    const inputId = `jp-field-${name}`;
    const helperId = `${inputId}-helper`;

    return (
        <FieldWrapper
            label={label}
            required={required}
            hasError={hasError}
            helperText={helperText}
            error={error}
            inputId={inputId}
            helperId={helperId}
        >
            <input
                id={inputId}
                className="jp-text-input__control"
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                aria-invalid={hasError}
                aria-describedby={helperId}
                onChange={onChange}
                onBlur={onBlur}
            />
        </FieldWrapper>
    );
}