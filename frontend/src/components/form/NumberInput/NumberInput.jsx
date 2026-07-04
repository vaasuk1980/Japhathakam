/*
==================================================================
    Japhathakam Enterprise Form Framework
    Enterprise Number Input
------------------------------------------------------------------
    Standard number input integrated with the Enterprise Form State
    Engine through the useField hook.
==================================================================
*/

import "./NumberInput.css";

import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";

export default function NumberInput({
    name,
    label,
    placeholder = "",
    required = false,
    helperText = "",
    min,
    max,
    step = 1,
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
                className="jp-number-input__control"
                type="number"
                value={value}
                placeholder={placeholder}
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