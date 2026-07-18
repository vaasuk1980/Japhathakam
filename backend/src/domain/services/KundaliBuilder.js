/**
 * Domain Service responsible for constructing
 * a complete Janma Lagna Kundali.
 *
 * Responsibilities:
 * - Coordinate Domain Engines
 * - Assemble the Kundali Aggregate
 *
 * It does NOT:
 * - Perform astronomical calculations
 * - Interpret the Kundali
 * - Calculate Dasacharam
 * - Produce Japhathakam
 */
export default class KundaliBuilder {

    /**
     * Constructs a complete Janma Lagna Kundali.
     *
     * @param {BirthContext} birthContext
     * @returns {Kundali}
     */
    build(birthContext) {
        throw new Error("Method 'build()' must be implemented.");
    }

}