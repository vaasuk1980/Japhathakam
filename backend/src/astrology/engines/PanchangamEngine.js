/**
 * ============================================================
 * JAPHATHAKAM
 * Panchangam Engine
 * ------------------------------------------------------------
 * Computes the calendrical Panchangam elements that can't be
 * read off a single instant's planetary snapshot: the current
 * Masa (Amanta lunar month, JHora's default convention), the
 * Samvatsara (Telugu 60-year cycle name), and the exact start/
 * end time of the Moon's birth Nakshatra.
 * ============================================================
 */

import swisseph from "@swisseph/node";

import SwissEphemerisProvider from "../services/SwissEphemerisProvider.js";
import SiderealConversion from "../calculations/SiderealConversion.js";
import CrossingTimeSearch from "../calculations/CrossingTimeSearch.js";

import MasaRegistry from "../constants/MasaRegistry.js";
import SamvatsaraRegistry from "../constants/SamvatsaraRegistry.js";

// Calibration point (verified against published Telugu Panchangam
// sources): the Chaitra masa that began in 2023 was Samvatsara
// "Shobhakrutu" — the 37th of 60 (Prabhava = 1st). A date safely
// inside that Chaitra window (avoids ambiguity near either edge).
const REFERENCE_DATE_INSIDE_CHAITRA = { year: 2023, month: 4, day: 5, hourUTC: 12 };
const REFERENCE_SAMVATSARA_INDEX = 37; // 1-based

class PanchangamEngine {

    sunLongitude(julianDay) {
        return this.siderealLongitude(julianDay, swisseph.Planet.Sun);
    }

    moonLongitude(julianDay) {
        return this.siderealLongitude(julianDay, swisseph.Planet.Moon);
    }

    siderealLongitude(julianDay, planet) {

        const position = SwissEphemerisProvider.calculatePosition(julianDay, planet);
        const ayanamsa = SwissEphemerisProvider.getAyanamsa(julianDay);

        return SiderealConversion.convert(position.longitude, ayanamsa);

    }

    elongation(julianDay) {

        return CrossingTimeSearch.normalize(
            this.moonLongitude(julianDay) - this.sunLongitude(julianDay)
        );

    }

    findNewMoon(referenceJd, direction) {

        return CrossingTimeSearch.find({
            valueFn: (jd) => this.elongation(jd),
            targetDegree: 0,
            referenceJd,
            direction,
            maxDays: 35,
            coarseStepDays: 0.5,
        });

    }

    signIndexAt(julianDay) {
        return Math.floor(this.sunLongitude(julianDay) / 30);
    }

    /**
     * Masa (Amanta): the lunar month is named after the solar
     * Rashi (0=Mesha) the Sun occupies at the *preceding* New
     * Moon. If the Sun stays in the same Rashi across both the
     * preceding and following New Moon, this is an Adhika
     * (intercalary/leap) month.
     */
    calculateMasa(birthJulianDay) {

        const previousNewMoonJd = this.findNewMoon(birthJulianDay, -1);
        const nextNewMoonJd = this.findNewMoon(birthJulianDay, 1);

        const thisSolarSign = this.signIndexAt(previousNewMoonJd);
        const nextSolarSign = this.signIndexAt(nextNewMoonJd);

        const isLeap = thisSolarSign === nextSolarSign;

        // Chaitra (index 0) begins with the New Moon while the
        // Sun is still in Meena (11) — Ugadi itself falls the day
        // after, once Sun has usually just crossed into Mesha.
        // Verified against the real Ugadi 2023 date (22-Mar-2023):
        // the preceding New Moon (21-Mar-2023) has Sun in Meena.
        const index = (thisSolarSign + 1) % 12;

        return {
            name: MasaRegistry[index],
            isLeap,
            startNewMoonJd: previousNewMoonJd,
        };

    }

    /**
     * Walks backward through New Moons (skipping Adhika months,
     * which repeat the same solar Rashi) until it finds the one
     * where the Sun is in Meena — i.e. the start of the current
     * Telugu lunisolar year (Chaitra).
     */
    findCurrentChaitraStart(newMoonJd) {

        let candidateJd = newMoonJd;

        for (let guard = 0; guard < 14; guard++) {

            if (this.signIndexAt(candidateJd) === 11) {
                return candidateJd;
            }

            candidateJd = this.findNewMoon(candidateJd - 1, -1);

        }

        throw new Error("PanchangamEngine: unable to locate Chaitra start.");

    }

    calculateSamvatsara(chaitraStartJd) {

        const referenceJd = swisseph.julianDay(
            REFERENCE_DATE_INSIDE_CHAITRA.year,
            REFERENCE_DATE_INSIDE_CHAITRA.month,
            REFERENCE_DATE_INSIDE_CHAITRA.day,
            REFERENCE_DATE_INSIDE_CHAITRA.hourUTC
        );

        const referenceChaitraStartJd =
            this.findCurrentChaitraStart(this.findNewMoon(referenceJd, -1));

        const elapsedYears = Math.round(
            (chaitraStartJd - referenceChaitraStartJd) / 365.25
        );

        const index =
            ((REFERENCE_SAMVATSARA_INDEX - 1 + elapsedYears) % 60 + 60) % 60;

        return SamvatsaraRegistry[index];

    }

    /**
     * The Ugadi (Chaitra Shukla Padyami — start of the Telugu
     * lunisolar year) window for a given Gregorian year: the Chaitra
     * start nearest that year, and the following one a lunisolar
     * year later. Ugadi normally falls March-April, so a reference
     * date of June 1st is safely after it (even in an unusual year)
     * without risking landing past the FOLLOWING Ugadi too.
     *
     * @param {number} year - Gregorian year, e.g. 2026.
     * @returns {{ startJd: number, endJd: number }}
     */
    findUgadiWindowForYear(year) {

        const referenceJd = swisseph.julianDay(year, 6, 1, 12);

        const startJd = this.findCurrentChaitraStart(this.findNewMoon(referenceJd, -1));

        // A Chaitra-to-Chaitra cycle is 12 lunar months (~354 days) or,
        // in an Adhika (leap) year, 13 (~384 days) — 400 days ahead of
        // startJd is past either case, so searching backward from there
        // reliably lands on the NEXT Ugadi rather than this same one.
        const endJd = this.findCurrentChaitraStart(this.findNewMoon(startJd + 400, -1));

        return { startJd, endJd };

    }

    calculateNakshatraBoundaries(birthJulianDay, nakshatra) {

        const startJd = CrossingTimeSearch.find({
            valueFn: (jd) => this.moonLongitude(jd),
            targetDegree: nakshatra.startLongitude,
            referenceJd: birthJulianDay,
            direction: -1,
            maxDays: 2,
            coarseStepDays: 0.05,
        });

        const endJd = CrossingTimeSearch.find({
            valueFn: (jd) => this.moonLongitude(jd),
            targetDegree: nakshatra.endLongitude,
            referenceJd: birthJulianDay,
            direction: 1,
            maxDays: 2,
            coarseStepDays: 0.05,
        });

        return { startJd, endJd };

    }

    /**
     * @param {import("../models/BirthContext.js").default} birthContext
     * @param {import("../models/Nakshatra.js").default} moonNakshatra
     */
    calculate(birthContext, moonNakshatra) {

        const masa = this.calculateMasa(birthContext.julianDay);

        const chaitraStartJd = masa.name === MasaRegistry[0] && !masa.isLeap
            ? masa.startNewMoonJd
            : this.findCurrentChaitraStart(masa.startNewMoonJd);

        const samvatsara = this.calculateSamvatsara(chaitraStartJd);

        const { startJd, endJd } =
            this.calculateNakshatraBoundaries(birthContext.julianDay, moonNakshatra);

        return {
            masaName: masa.name,
            masaIsLeap: masa.isLeap,
            samvatsaraName: samvatsara,
            nakshatraStartJd: startJd,
            nakshatraEndJd: endJd,
            timezone: birthContext.timezone,
        };

    }

}

export default new PanchangamEngine();
