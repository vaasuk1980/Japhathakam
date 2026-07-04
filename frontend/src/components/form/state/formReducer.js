/* ==========================================================
   Japhathakam Enterprise Form Engine
   Form Reducer
----------------------------------------------------------
   Central state management for all form controls.
========================================================== */

export const initialFormState = {
    values: {},
    errors: {},
    touched: {},
    dirty: {},
    disabled: {},
    readonly: {},
    loading: {},
    metadata: {},
};

export const FORM_ACTIONS = {
    REGISTER_FIELD: "REGISTER_FIELD",

    SET_VALUE: "SET_VALUE",
    SET_ERROR: "SET_ERROR",
    CLEAR_ERROR: "CLEAR_ERROR",
    SET_TOUCHED: "SET_TOUCHED",
    SET_DIRTY: "SET_DIRTY",
    SET_DISABLED: "SET_DISABLED",
    SET_READONLY: "SET_READONLY",
    SET_LOADING: "SET_LOADING",
    SET_METADATA: "SET_METADATA",

    RESET_FIELD: "RESET_FIELD",
    RESET_FORM: "RESET_FORM",
};

export function formReducer(state, action) {
    switch (action.type) {

        /* ======================================================
           Register Field
        ====================================================== */

        case FORM_ACTIONS.REGISTER_FIELD: {

            const { name, config } = action.payload;

            if (state.metadata[name]) {
                return state;
            }

            return {
                ...state,

                values: {
                    ...state.values,
                    [name]: config.initialValue ?? "",
                },

                errors: {
                    ...state.errors,
                    [name]: "",
                },

                touched: {
                    ...state.touched,
                    [name]: false,
                },

                dirty: {
                    ...state.dirty,
                    [name]: false,
                },

                disabled: {
                    ...state.disabled,
                    [name]: false,
                },

                readonly: {
                    ...state.readonly,
                    [name]: false,
                },

                loading: {
                    ...state.loading,
                    [name]: false,
                },

                metadata: {
                    ...state.metadata,
                    [name]: config,
                },
            };
        }

        /* ======================================================
           Value
        ====================================================== */

        case FORM_ACTIONS.SET_VALUE:
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.payload.name]: action.payload.value,
                },
            };

        /* ======================================================
           Error
        ====================================================== */

        case FORM_ACTIONS.SET_ERROR:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.name]: action.payload.error,
                },
            };

        case FORM_ACTIONS.CLEAR_ERROR: {

            const errors = { ...state.errors };

            delete errors[action.payload.name];

            return {
                ...state,
                errors,
            };
        }

        /* ======================================================
           Touched
        ====================================================== */

        case FORM_ACTIONS.SET_TOUCHED:
            return {
                ...state,
                touched: {
                    ...state.touched,
                    [action.payload.name]: action.payload.touched,
                },
            };

        /* ======================================================
           Dirty
        ====================================================== */

        case FORM_ACTIONS.SET_DIRTY:
            return {
                ...state,
                dirty: {
                    ...state.dirty,
                    [action.payload.name]: action.payload.dirty,
                },
            };

        /* ======================================================
           Disabled
        ====================================================== */

        case FORM_ACTIONS.SET_DISABLED:
            return {
                ...state,
                disabled: {
                    ...state.disabled,
                    [action.payload.name]: action.payload.disabled,
                },
            };

        /* ======================================================
           Read Only
        ====================================================== */

        case FORM_ACTIONS.SET_READONLY:
            return {
                ...state,
                readonly: {
                    ...state.readonly,
                    [action.payload.name]: action.payload.readonly,
                },
            };

        /* ======================================================
           Loading
        ====================================================== */

        case FORM_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.name]: action.payload.loading,
                },
            };

        /* ======================================================
           Metadata
        ====================================================== */

        case FORM_ACTIONS.SET_METADATA:
            return {
                ...state,
                metadata: {
                    ...state.metadata,
                    [action.payload.name]: {
                        ...state.metadata[action.payload.name],
                        ...action.payload.metadata,
                    },
                },
            };

        /* ======================================================
           Reset Field
        ====================================================== */

        case FORM_ACTIONS.RESET_FIELD: {

            const name = action.payload.name;

            const values = { ...state.values };
            const errors = { ...state.errors };
            const touched = { ...state.touched };
            const dirty = { ...state.dirty };
            const disabled = { ...state.disabled };
            const readonly = { ...state.readonly };
            const loading = { ...state.loading };
            const metadata = { ...state.metadata };

            delete values[name];
            delete errors[name];
            delete touched[name];
            delete dirty[name];
            delete disabled[name];
            delete readonly[name];
            delete loading[name];
            delete metadata[name];

            return {
                values,
                errors,
                touched,
                dirty,
                disabled,
                readonly,
                loading,
                metadata,
            };
        }

        /* ======================================================
           Reset Form
        ====================================================== */

        case FORM_ACTIONS.RESET_FORM:
            return initialFormState;

        default:
            return state;
    }
}