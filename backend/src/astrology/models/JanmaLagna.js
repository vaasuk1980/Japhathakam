class JanmaLagna {

    constructor(
        lagna,
        longitude,
        signIndex,
        degreesInLagna
    ) {

        this.lagna = lagna;

        this.longitude = longitude;

        this.signIndex = signIndex;
        this.degreesInLagna = degreesInLagna;

        Object.freeze(this);

    }

}

export default JanmaLagna;