/* ==========================================================
   Japhathakam Enterprise Form Engine
   useForm Hook
-------------------------------------------------------------
   Provides access to the centralized Form State and
   Form Actions.
========================================================== */

import { useContext } from "react";

import FormStateContext from "./FormStateContext";

function useForm() {
    const context = useContext(FormStateContext);

    if (!context) {
        throw new Error(
            "useForm must be used inside FormStateProvider."
        );
    }

    return context;
}

export default useForm;