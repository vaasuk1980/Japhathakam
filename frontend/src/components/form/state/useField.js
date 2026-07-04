/* ==========================================================
   Japhathakam Enterprise Form Engine
   useField Hook
-------------------------------------------------------------
   Provides field-specific state and actions.
========================================================== */

import { useMemo } from "react";

import {
    getFieldError,
    getFieldMetadata,
    getFieldValue,
    isFieldDirty,
    isFieldDisabled,
    isFieldLoading,
    isFieldReadOnly,
    isFieldTouched,
} from "./formSelectors";

import useForm from "./useForm";

function useField(name) {
    const { state, actions } = useForm();

    const field = useMemo(
        () => ({
            name,

            value: getFieldValue(state, name),

            error: getFieldError(state, name),

            touched: isFieldTouched(state, name),

            dirty: isFieldDirty(state, name),

            disabled: isFieldDisabled(state, name),

            readOnly: isFieldReadOnly(state, name),

            loading: isFieldLoading(state, name),

            metadata: getFieldMetadata(state, name),

            onChange(event) {
                actions.setValue(name, event.target.value);
            },

            setValue(value) {
                actions.setValue(name, value);
            },

            setError(error) {
                actions.setError(name, error);
            },

            clearError() {
                actions.clearError(name);
            },

            setTouched(touched = true) {
                actions.setTouched(name, touched);
            },

            setDirty(dirty = true) {
                actions.setDirty(name, dirty);
            },

            setDisabled(disabled = true) {
                actions.setDisabled(name, disabled);
            },

            setReadOnly(readonly = true) {
                actions.setReadOnly(name, readonly);
            },

            setLoading(loading = true) {
                actions.setLoading(name, loading);
            },

            setMetadata(metadata) {
                actions.setMetadata(name, metadata);
            },

            reset() {
                actions.resetField(name);
            },
        }),
        [name, state, actions]
    );

    return field;
}

export default useField;