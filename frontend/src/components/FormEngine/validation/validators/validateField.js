import validators from "./validators";

export default function validateField(field, value) {
    const rules = field?.validation;

    if (!Array.isArray(rules) || rules.length === 0) {
        return null;
    }

    for (const rule of rules) {
        const validator = validators[rule.type];

        if (!validator) {
            continue;
        }

        const error = validator(value, rule);

        if (error) {
            return error;
        }
    }

    return null;
}