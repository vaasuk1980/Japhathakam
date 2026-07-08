/* ==========================================================
   Japhathakam Enterprise Form Engine
   Evaluate Condition
-------------------------------------------------------------
   Evaluates a single field condition.

   Supported
   ---------
   • equals

   Future
   ------
   • notEquals
   • greaterThan
   • lessThan
   • contains
   • startsWith
   • endsWith
========================================================== */

export default function evaluateCondition(
    condition,
    values
) {

    if (!condition) {
        return true;
    }

    const {
        field,
        equals,
    } = condition;

    return values[field] === equals;
}