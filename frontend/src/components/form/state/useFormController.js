/* ==========================================================
   Japhathakam Enterprise Form Engine
   useFormController
-------------------------------------------------------------
   Enterprise Form Lifecycle Controller

   Responsibilities
   ----------------
   • Orchestrates form lifecycle
   • Exposes centralized state
   • Exposes centralized actions

   Lifecycle
   ---------
   • Reset Form

   Future
   ------
   • Validate
   • Submit
   • Mark All Touched
   • Async Submit
========================================================== */

import useForm from "./useForm";

function useFormController() {

    const { state, actions } = useForm();

    function reset() {
        actions.resetForm();
    }

    return {

        /* ==========================================
           Form State
        ========================================== */

        state,

        values: state.values,

        errors: state.errors,

        touched: state.touched,

        dirty: state.dirty,

        /* ==========================================
           Form Actions
        ========================================== */

        actions,

        /* ==========================================
           Form Lifecycle
        ========================================== */

        reset,

    };
}

export default useFormController;