/* ==========================================================
   Japhathakam Enterprise Form Engine
   Form State Provider
-------------------------------------------------------------
   Connects the Form Context with the Form Reducer and
   exposes the centralized Form State and Form Actions.
========================================================== */

import { useMemo, useReducer } from "react";

import FormStateContext from "./FormStateContext";
import { createFormActions } from "./formActions";
import { formReducer } from "./formReducer";

function FormStateProvider({
    children,
    initialState,
}) {
    const [state, dispatch] = useReducer(
        formReducer,
        initialState
    );

    const actions = useMemo(
        () => createFormActions(dispatch, initialState),
        [dispatch, initialState]
    );

    const contextValue = useMemo(
        () => ({
            state,
            actions,
        }),
        [state, actions]
    );

    return (
        <FormStateContext.Provider value={contextValue}>
            {children}
        </FormStateContext.Provider>
    );
}

export default FormStateProvider;