/* ==========================================================
   Japhathakam Enterprise Form Engine
   Form Selectors
-------------------------------------------------------------
   Centralized selectors for reading form state.
========================================================== */

export function getFieldValue(state, name) {
    return state.values[name] ?? "";
}

export function getFieldError(state, name) {
    return state.errors[name];
}

export function isFieldTouched(state, name) {
    return state.touched[name] ?? false;
}

export function isFieldDirty(state, name) {
    return state.dirty[name] ?? false;
}

export function isFieldDisabled(state, name) {
    return state.disabled[name] ?? false;
}

export function isFieldReadOnly(state, name) {
    return state.readonly[name] ?? false;
}

export function isFieldLoading(state, name) {
    return state.loading[name] ?? false;
}

export function getFieldMetadata(state, name) {
    return state.metadata[name] ?? {};
}