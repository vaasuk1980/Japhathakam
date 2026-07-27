/* ==========================================================
   Gochara Form Schema
   ----------------------------------------------------------
   Small standalone schema for the Gochara (transit) date /
   time / place controls — independent of the main Person
   birth-details schema.
========================================================== */

export default function buildGocharaSchema(defaults = {}) {

    return {
        id: "gochara",

        sections: [
            {
                id: "gochara",

                fields: [
                    {
                        id: "dateOfBirth",
                        label: "Date",
                        type: "date",

                        required: true,

                        defaultValue: defaults.dateOfBirth ?? "",
                    },
                    {
                        id: "timeOfBirth",
                        label: "Time",
                        type: "time",

                        required: true,

                        defaultValue: defaults.timeOfBirth ?? "",
                    },
                    {
                        id: "placeOfBirth",
                        label: "Place",
                        type: "place",
                        placeholder: "Start typing a city name...",

                        required: true,

                        defaultValue: defaults.placeOfBirth ?? "",
                    },
                    {
                        id: "latitude",
                        type: "number",
                        required: true,
                        defaultValue: defaults.latitude ?? "",
                    },
                    {
                        id: "longitude",
                        type: "number",
                        required: true,
                        defaultValue: defaults.longitude ?? "",
                    },
                    {
                        id: "timezone",
                        type: "number",
                        required: true,
                        defaultValue: defaults.timezone ?? "",
                    },
                ],
            },
        ],
    };

}
