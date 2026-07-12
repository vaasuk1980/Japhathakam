class BirthDetails {

    constructor({

        year,
        month,
        day,

        localHour,

        latitude,
        longitude,
        timezone

    }) {

        this.year = year;
        this.month = month;
        this.day = day;

        this.localHour = localHour;

        this.latitude = latitude;
        this.longitude = longitude;
        this.timezone = timezone;

        Object.freeze(this);

    }

}

export default BirthDetails;