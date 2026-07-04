/* ==========================================================
   Enterprise Touched State Builder

   Marks every field in the schema as touched.
========================================================== */

export default function buildTouchedState(schema) {
    const touched = {};

    if (!schema?.sections) {
        return touched;
    }

    schema.sections.forEach((section) => {
        section.fields?.forEach((field) => {
            touched[field.id] = true;
        });
    });

    return touched;
}