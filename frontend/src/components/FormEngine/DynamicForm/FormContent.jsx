/* ==========================================================
   Enterprise Form Content

   Renders the enterprise form and owns the
   form lifecycle.

   Future Responsibilities

   • Submit lifecycle
   • Reset lifecycle
   • Dirty tracking
   • Loading state
   • API integration
   • Autosave
========================================================== */

import SectionRenderer from "../SectionRenderer";
import FormActions from "../FormActions/FormActions";

function FormContent({
    schema,
    onSubmit,
}) {

    return (
        <form>
            {schema.sections.map((section) => (
                <SectionRenderer
                    key={section.id}
                    section={section}
                />
            ))}

            <FormActions />
        </form>
    );
}

export default FormContent;