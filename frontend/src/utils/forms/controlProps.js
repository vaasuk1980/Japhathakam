/*
==================================================================
    Japhathakam Enterprise Form Framework
    Control Props
------------------------------------------------------------------
    Shared default properties and helpers for all form controls.

    Every form control should receive only the props that belong
    to it. This utility provides a consistent API across the
    entire framework.
==================================================================
*/

export const defaultControlProps = {
    name: "",
    label: "",
    placeholder: "",
    required: false,
    helperText: "",
    disabled: false,
    readOnly: false,
};

export const commonControlProps = [
    "name",
    "label",
    "placeholder",
    "required",
    "helperText",
    "disabled",
    "readOnly",
];

/*
==================================================================
    Returns only the props requested by a control.

    Example:
        getControlProps(props, commonControlProps)

    This prevents unknown props from being passed down to native
    HTML elements and keeps every control API consistent.
==================================================================
*/
export function getControlProps(props = {}, allowedProps = commonControlProps) {
    const controlProps = {};

    allowedProps.forEach((prop) => {
        if (props[prop] !== undefined) {
            controlProps[prop] = props[prop];
        }
    });

    return {
        ...defaultControlProps,
        ...controlProps,
    };
}