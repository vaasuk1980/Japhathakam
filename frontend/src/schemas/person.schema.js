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

                    validation: [
                        {
                            type: "required",
                            message: "First Name is required.",
                        },
                    ],
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

                    min: "1800-01-01",
                    max: new Date().toISOString().slice(0, 10),
                },

                {
                    id: "age",
                    label: "Age",
                    type: "age",

                    required: false,
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
                    type: "place",
                    placeholder: "Start typing a city name...",

                    required: true,
                },
                {
                    id: "latitude",
                    label: "Latitude",
                    type: "number",
                    placeholder: "e.g. 14.4426",

                    required: true,
                    min: -90,
                    max: 90,
                    step: 0.0001,
                    readOnly: true,
                },
                {
                    id: "longitude",
                    label: "Longitude",
                    type: "number",
                    placeholder: "e.g. 79.9860",

                    required: true,
                    min: -180,
                    max: 180,
                    step: 0.0001,
                    readOnly: true,
                },
                {
                    id: "timezone",
                    label: "Time Zone Offset",
                    type: "number",
                    placeholder: "e.g. 5.5 for IST",

                    required: true,
                    min: -12,
                    max: 14,
                    step: 0.25,
                    readOnly: true,
                },
            ],
        },
    ],
};

export default personSchema;