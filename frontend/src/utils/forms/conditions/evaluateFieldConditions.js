/* ==========================================================
   Japhathakam Enterprise Form Engine
   Evaluate Field Conditions
-------------------------------------------------------------
   Evaluates all runtime conditions for a field.

   Returns
   -------
   • visible

   Future
   ------
   • disabled
   • readonly
   • required
========================================================== */

import evaluateCondition from "./evaluateCondition";

export default function evaluateFieldConditions(
    field,
    values
) {

    return {

        visible: evaluateCondition(
            field.visibleWhen,
            values
        ),

    };

}