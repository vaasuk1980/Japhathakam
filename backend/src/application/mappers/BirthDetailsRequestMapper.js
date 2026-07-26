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

        if (Number.isNaN(year) || year < 1800 || year > 2399) {
            throw new Error("Valid dateOfBirth is required (year must be between 1800 and 2399).");
        }

        const [hour, minute] =
            timeOfBirth.split(":").map(Number);

        const localHour =
            hour + (minute / 60);

        const latitude = Number(request.latitude);
        const longitude = Number(request.longitude);
        const timezone = Number(request.timezone);

        if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
            throw new Error("Valid latitude is required.");
        }

        if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
            throw new Error("Valid longitude is required.");
        }

        if (Number.isNaN(timezone) || timezone < -12 || timezone > 14) {
            throw new Error("Valid timezone offset is required.");
        }

        return new BirthDetails({

            year,
            month,
            day,

            localHour,

            placeName: request.placeOfBirth,
            latitude,
            longitude,
            timezone

        });

    }

}

export default new BirthDetailsRequestMapper();