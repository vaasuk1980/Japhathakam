class BirthContext {

    constructor({

        year,
        month,
        day,

        localHour,
        utcHour,

        latitude,
        longitude,
        timezone,

        julianDay,

        // Future enrichment
        janmaLagna = null

    }) {

        this.year = year;
        this.month = month;
        this.day = day;

        this.localHour = localHour;
        this.utcHour = utcHour;

        this.latitude = latitude;
        this.longitude = longitude;
        this.timezone = timezone;

        this.julianDay = julianDay;

        // Future enrichment
        this.janmaLagna = janmaLagna;

        Object.freeze(this);

    }

    withJanmaLagna(
        janmaLagna
    ) {

        return new BirthContext({

            year: this.year,
            month: this.month,
            day: this.day,

            localHour: this.localHour,
            utcHour: this.utcHour,

            latitude: this.latitude,
            longitude: this.longitude,
            timezone: this.timezone,

            julianDay: this.julianDay,

            janmaLagna

        });

    }

}

export default BirthContext;