/* ==========================================================
   Japhathakam Enterprise Form Engine
   useFormController
-------------------------------------------------------------
   Enterprise controller responsible for form lifecycle
   operations.

   Responsibilities
   ----------------
   • Validate
   • Submit
   • Reset
   • Access current values

   Does NOT manage:
   • Rendering
   • Context creation
   • State mutations
========================================================== */

import useForm from "./useForm";

function useFormController() {
    const { state, actions } = useForm();

    return {
        state,
        actions,
    };
}

export default useFormController;