import BirthDetails from "../../astrology/models/input/BirthDetails.js";

class BirthDetailsRequestMapper {

    map(request) {

        const {
            dateOfBirth,
            timeOfBirth
        } = request;

        if (!dateOfBirth) {
            throw new Error("dateOfBirth is required.");
        }

        if (!timeOfBirth) {
            throw new Error("timeOfBirth is required.");
        }

        const [year, month, day] =
            dateOfBirth.split("-").map(Number);

        const [hour, minute] =
            timeOfBirth.split(":").map(Number);

        const localHour =
            hour + (minute / 60);

        return new BirthDetails({

            year,
            month,
            day,

            localHour,

            // --------------------------------------------------
            // Temporary integration values (Sprint 8.11)
            // Hyderabad
            // --------------------------------------------------

            latitude: 17.3850,
            longitude: 78.4867,
            timezone: 5.5

        });

    }

}

export default new BirthDetailsRequestMapper();