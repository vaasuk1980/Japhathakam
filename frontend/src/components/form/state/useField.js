/* ==========================================================
   Japhathakam Enterprise Form Engine
   useField Hook
-------------------------------------------------------------
   Provides field-specific state and actions.

   Responsibilities
   ----------------
   • Field state access
   • Field lifecycle
   • Dirty tracking
   • Error lifecycle
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

    const value = getFieldValue(state, name);
    const error = getFieldError(state, name);
    const touched = isFieldTouched(state, name);
    const dirty = isFieldDirty(state, name);
    const disabled = isFieldDisabled(state, name);
    const readOnly = isFieldReadOnly(state, name);
    const loading = isFieldLoading(state, name);
    const metadata = getFieldMetadata(state, name);

    const field = useMemo(
        () => ({

            name,

            value,

            error,

            touched,

            dirty,

            disabled,

            readOnly,

            loading,

            metadata,

            /* ==========================================
               Lifecycle
            ========================================== */

            onChange(event) {

                const newValue = event.target.value;

                actions.setValue(
                    name,
                    newValue
                );

                if (!dirty) {
                    actions.setDirty(name, true);
                }

                /*
                ------------------------------------------
                Enterprise Validation Lifecycle

                If the field currently has an error and the
                user modifies the value, clear the existing
                error immediately.

                Validation will run again on Submit.
                ------------------------------------------
                */

                if (error) {
                    actions.clearError(name);
                }

            },

            onBlur() {
                actions.setTouched(name, true);
            },

            /* ==========================================
               Actions
            ========================================== */

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
        [
            name,
            value,
            error,
            touched,
            dirty,
            disabled,
            readOnly,
            loading,
            metadata,
            actions,
        ]
    );

    return field;
}

export default useField;