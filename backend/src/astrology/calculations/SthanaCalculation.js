class SthanaCalculation {

    calculate(
        planetLagna,
        janmaLagna
    ) {

        if (
            !Number.isInteger(planetLagna) ||
            planetLagna < 1 ||
            planetLagna > 12
        ) {
            throw new Error("Invalid planet lagna.");
        }

        if (
            !Number.isInteger(janmaLagna) ||
            janmaLagna < 1 ||
            janmaLagna > 12
        ) {
            throw new Error("Invalid janma lagna.");
        }

        return (
            ((planetLagna - janmaLagna + 12) % 12) + 1
        );

    }

}

export default SthanaCalculation;