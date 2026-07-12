class HouseData {

    constructor(
        cusps,
        ascendant,
        mc,
        armc,
        vertex,
        equatorialAscendant,
        coAscendant1,
        coAscendant2,
        polarAscendant,
        houseSystem,
        siderealMode
    ) {

        this.cusps = cusps;

        this.ascendant = ascendant;
        this.mc = mc;
        this.armc = armc;
        this.vertex = vertex;

        this.equatorialAscendant = equatorialAscendant;
        this.coAscendant1 = coAscendant1;
        this.coAscendant2 = coAscendant2;
        this.polarAscendant = polarAscendant;

        this.houseSystem = houseSystem;
        this.siderealMode = siderealMode;

        Object.freeze(this);

    }

}

export default HouseData;