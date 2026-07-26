class JanmaLagna {

    constructor(
        lagna,
        longitude,
        signIndex,
        degreesInLagna,
        nakshatra,
        pada
    ) {

        this.lagna = lagna;

        this.longitude = longitude;

        this.signIndex = signIndex;
        this.degreesInLagna = degreesInLagna;

        this.nakshatra = nakshatra;
        this.pada = pada;

        Object.freeze(this);

    }

}

export default JanmaLagna;