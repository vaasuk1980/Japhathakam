/*
==================================================================
    Japhathakam Enterprise Form Engine
    Enterprise Select Input
------------------------------------------------------------------
    Standard select input integrated with the Enterprise Form State
    Engine through the useField hook.
==================================================================
*/

import "./Select.css";

import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";
import { getControlProps } from "../../../utils/forms/controlProps";

export default function Select({
    name,
    label,
    helperText = "",
    required = false,
    options = [],
}) {
    const field = useField(name);

    const controlProps = getControlProps({
        name,
        required,
    });

    const {
        label: fieldLabel,
        helperText: controlHelperText,
        ...selectProps
    } = controlProps;

    const hasError =
        field.touched && Boolean(field.error);

    const inputId = `jp-field-${name}`;
    const helperId = `${inputId}-helper`;

    return (
        <FieldWrapper
            label={label}
            required={required}
            hasError={hasError}
            helperText={helperText}
            error={field.error}
            inputId={inputId}
            helperId={helperId}
        >
            <select
                {...selectProps}
                id={inputId}
                className={`jp-select__control ${
                    hasError
                        ? "jp-select__control--error"
                        : ""
                }`}
                value={field.value ?? ""}
                disabled={field.disabled}
                aria-invalid={hasError}
                aria-describedby={helperId}
                onChange={field.onChange}
                onBlur={field.onBlur}
            >
                <option value="">
                    -- Select --
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </FieldWrapper>
    );
}