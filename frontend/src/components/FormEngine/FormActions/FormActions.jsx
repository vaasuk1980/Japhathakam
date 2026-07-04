/* ==========================================================
   Enterprise Form Actions

   Renders the actions for the enterprise form.

   Future
   ------
   • Submit
   • Reset
   • Cancel
   • Save Draft
========================================================== */

function FormActions() {
    return (
        <div className="form-actions">
            <button type="submit">
                Submit
            </button>

            <button
                type="reset"
            >
                Reset
            </button>
        </div>
    );
}

export default FormActions;