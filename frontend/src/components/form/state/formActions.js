/* ==========================================================
   Japhathakam Enterprise Form Engine
   Form Actions
-------------------------------------------------------------
   Centralized action creators for the Form State Engine.
========================================================== */

import { FORM_ACTIONS } from "./formReducer";

export function createFormActions(dispatch, initialState) {
    return {
        registerField(name, config = {}) {
            dispatch({
                type: FORM_ACTIONS.REGISTER_FIELD,
                payload: {
                    name,
                    config,
                },
            });
        },

        setValue(name, value) {
            dispatch({
                type: FORM_ACTIONS.SET_VALUE,
                payload: { name, value },
            });
        },

        setError(name, error) {
            dispatch({
                type: FORM_ACTIONS.SET_ERROR,
                payload: { name, error },
            });
        },

        clearError(name) {
            dispatch({
                type: FORM_ACTIONS.CLEAR_ERROR,
                payload: { name },
            });
        },

        setTouched(name, touched = true) {
            dispatch({
                type: FORM_ACTIONS.SET_TOUCHED,
                payload: { name, touched },
            });
        },

        setDirty(name, dirty = true) {
            dispatch({
                type: FORM_ACTIONS.SET_DIRTY,
                payload: { name, dirty },
            });
        },

        setDisabled(name, disabled = true) {
            dispatch({
                type: FORM_ACTIONS.SET_DISABLED,
                payload: { name, disabled },
            });
        },

        setReadOnly(name, readonly = true) {
            dispatch({
                type: FORM_ACTIONS.SET_READONLY,
                payload: { name, readonly },
            });
        },

        setLoading(name, loading = true) {
            dispatch({
                type: FORM_ACTIONS.SET_LOADING,
                payload: { name, loading },
            });
        },

        setMetadata(name, metadata) {
            dispatch({
                type: FORM_ACTIONS.SET_METADATA,
                payload: { name, metadata },
            });
        },

        resetField(name) {
            dispatch({
                type: FORM_ACTIONS.RESET_FIELD,
                payload: { name },
            });
        },

        resetForm() {
            dispatch({
                type: FORM_ACTIONS.RESET_FORM,
                payload: {
                    initialState,
                },
            });
        },
    };
}