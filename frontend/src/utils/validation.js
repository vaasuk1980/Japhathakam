/* ==========================================================
   Japhathakam Validation Utilities
   ----------------------------------------------------------
   Reusable validation helpers for all forms.
   Every validator returns:
   - null  -> valid
   - string -> error message
========================================================== */

/**
 * Required Field
 */
export function required(value, message = "This field is required.") {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return message;
  }

  return null;
}

/**
 * Minimum Length
 */
export function minLength(
  value,
  length,
  message = `Minimum ${length} characters required.`
) {
  if (!value) return null;

  return value.length < length ? message : null;
}

/**
 * Maximum Length
 */
export function maxLength(
  value,
  length,
  message = `Maximum ${length} characters allowed.`
) {
  if (!value) return null;

  return value.length > length ? message : null;
}

/**
 * Number Validation
 */
export function number(
  value,
  message = "Only numeric values are allowed."
) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return isNaN(value) ? message : null;
}

/**
 * Email Validation
 */
export function email(
  value,
  message = "Invalid email address."
) {
  if (!value) return null;

  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(value)
    ? null
    : message;
}

/**
 * Phone Validation
 */
export function phone(
  value,
  message = "Invalid phone number."
) {
  if (!value) return null;

  const regex = /^[0-9]{10}$/;

  return regex.test(value)
    ? null
    : message;
}

/**
 * Date Validation
 */
export function date(
  value,
  message = "Invalid date."
) {
  if (!value) return null;

  const date = new Date(value);

  return isNaN(date.getTime())
    ? message
    : null;
}

/**
 * Time Validation
 */
export function time(
  value,
  message = "Invalid time."
) {
  if (!value) return null;

  const regex =
    /^([01]\d|2[0-3]):([0-5]\d)$/;

  return regex.test(value)
    ? null
    : message;
}

/**
 * Latitude Validation
 */
export function latitude(
  value,
  message = "Latitude must be between -90 and 90."
) {
  if (!value && value !== 0) return null;

  const num = Number(value);

  return num >= -90 && num <= 90
    ? null
    : message;
}

/**
 * Longitude Validation
 */
export function longitude(
  value,
  message = "Longitude must be between -180 and 180."
) {
  if (!value && value !== 0) return null;

  const num = Number(value);

  return num >= -180 && num <= 180
    ? null
    : message;
}

/**
 * Custom Validation
 */
export function custom(
  value,
  validator,
  message = "Invalid value."
) {
  if (!validator) return null;

  return validator(value)
    ? null
    : message;
}