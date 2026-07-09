/* ==========================================================
   JAPHATHAKAM ASTROLOGY ENGINE
   Birth Details Model

   Central business model representing the input required
   for all astrology calculations.
========================================================== */

class BirthDetails {

    constructor({
        dateTimeOfBirth = null,
        placeName = "",
        latitude = null,
        longitude = null,
        timezone = "",
        calendar = "Gregorian"
    } = {}) {

        this.dateTimeOfBirth = dateTimeOfBirth;

        this.placeName = placeName;

        this.latitude = latitude;

        this.longitude = longitude;

        this.timezone = timezone;

        this.calendar = calendar;
    }

}

export default BirthDetails;