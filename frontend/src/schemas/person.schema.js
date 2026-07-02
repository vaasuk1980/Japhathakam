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
                    id: "middleName",
                    label: "Middle Name",
                    type: "text",
                    placeholder: "Enter middle name",
                    required: false,
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
                        { value: "other", label: "Other" },
                    ],
                },

                {
                    id: "dateOfBirth",
                    label: "Date of Birth",
                    type: "date",
                    required: true,
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