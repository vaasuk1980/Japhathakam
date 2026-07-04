/*
==================================================================
    Japhathakam Enterprise Form Framework
    Enterprise Date Input
------------------------------------------------------------------
    Standard date input integrated with the Enterprise Form State
    Engine through the useField hook.
==================================================================
*/

import "./DateInput.css";

import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";

export default function DateInput({
    name,
    label,
    required = false,
    helperText = "",
    min,
    max,
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
                className="jp-date-input__control"
                type="date"
                value={value}
                min={min}
                max={max}
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