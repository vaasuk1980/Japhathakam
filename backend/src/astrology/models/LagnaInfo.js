class LagnaInfo {

    constructor(
        lagna,
        signIndex,
        degreesInLagna
    ) {

        this.lagna = lagna;
        this.signIndex = signIndex;
        this.degreesInLagna = degreesInLagna;

        Object.freeze(this);

    }

}

export default LagnaInfo;