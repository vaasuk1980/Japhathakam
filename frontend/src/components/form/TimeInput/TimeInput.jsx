/*
==================================================================
    Japhathakam Enterprise Form Framework
    Enterprise Time Input
------------------------------------------------------------------
    Standard time input integrated with the Enterprise Form State
    Engine through the useField hook.
==================================================================
*/

import "./TimeInput.css";

import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";

export default function TimeInput({
    name,
    label,
    required = false,
    helperText = "",
    min,
    max,
    step,
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
                className="jp-time-input__control"
                type="time"
                value={value}
                min={min}
                max={max}
                step={step}
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