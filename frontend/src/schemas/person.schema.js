/* ==========================================================
   Person Form Schema
   Master schema for Person Details page.
========================================================== */

const personSchema = {
    id: "person",

    title: "Person Details",

    sections: [
        {
            id: "basic",

            title: "Basic Information",

            fields: [
                {
                    id: "firstName",
                    label: "First Name",
                    type: "text",
                    placeholder: "Enter first name",
                    required: true,
                    maxLength: 50,
                },

                {
                    id: "lastName",
                    label: "Last Name",
                    type: "text",
                    placeholder: "Enter last name",
                    required: true,
                    maxLength: 50,
                },

                {
                    id: "gender",
                    label: "Gender",
                    type: "select",
                    required: true,
                    options: [
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Transgender" },
                    ],
                },

                {
                    id: "dateOfBirth",
                    label: "Date of Birth",
                    type: "date",
                    required: true,
                },

                {
                    id: "age",
                    label: "Age",
                    type: "number",
                    placeholder: "Enter age",
                    helperText: "Age in completed years",
                    required: false,
                    min: 0,
                    max: 150,
                    step: 1,
                },

                {
                    id: "timeOfBirth",
                    label: "Time of Birth",
                    type: "time",
                    required: true,
                },

                {
                    id: "placeOfBirth",
                    label: "Place of Birth",
                    type: "text",
                    placeholder: "Enter place of birth",
                    required: true,
                },
            ],
        },
    ],
};

export default personSchema;