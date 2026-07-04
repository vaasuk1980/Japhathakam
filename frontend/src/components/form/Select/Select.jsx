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

    return (
        <FieldWrapper
            label={label}
            required={required}
            helperText={helperText}
            error={field.error}
            touched={field.touched}
        >
            <select
                {...selectProps}
                value={field.value ?? ""}
                disabled={field.disabled}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className={`jp-select__control ${
                    field.error && field.touched
                        ? "jp-select__control--error"
                        : ""
                }`}
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