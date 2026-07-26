/**
 * ============================================================
 * JAPHATHAKAM
 * Crossing Time Search
 * ------------------------------------------------------------
 * Finds the Julian Day (UTC) at which a longitude that
 * increases monotonically over time (e.g. Sun, Moon, or their
 * elongation) crosses a target degree — searching either
 * forward or backward from a reference moment.
 *
 * Used for: Moon's nakshatra boundary times, New Moon search
 * (for Masa determination).
 * ============================================================
 */

class CrossingTimeSearch {

    normalize(degrees) {
        return ((degrees % 360) + 360) % 360;
    }

    /**
     * @param {(jd: number) => number} valueFn - returns a
     *   longitude in degrees for a given Julian Day. Must be
     *   monotonically increasing with time.
     * @param {number} targetDegree
     * @param {number} referenceJd
     * @param {1 | -1} direction - 1 to search forward (next
     *   crossing), -1 to search backward (previous crossing).
     * @param {number} maxDays - search window size.
     * @param {number} coarseStepDays - coarse scan step size;
     *   must be small enough that the value can't skip past the
     *   target and wrap around undetected within one step.
     */
    find({
        valueFn,
        targetDegree,
        referenceJd,
        direction,
        maxDays = 40,
        coarseStepDays = 0.25
    }) {

        const target = this.normalize(targetDegree);

        const distanceToTarget = (jd) =>
            this.normalize(target - this.normalize(valueFn(jd)));

        let prevJd = referenceJd;
        let prevDistance = distanceToTarget(prevJd);

        const step = coarseStepDays * direction;
        const steps = Math.round(maxDays / coarseStepDays);

        for (let i = 1; i <= steps; i++) {

            const currJd = referenceJd + step * i;
            const currDistance = distanceToTarget(currJd);

            const crossed = direction > 0
                ? currDistance > prevDistance
                : currDistance < prevDistance;

            if (crossed) {

                const lowJd = direction > 0 ? prevJd : currJd;
                const highJd = direction > 0 ? currJd : prevJd;

                return this.bisect(valueFn, target, lowJd, highJd);

            }

            prevJd = currJd;
            prevDistance = currDistance;

        }

        throw new Error(
            "CrossingTimeSearch: crossing not found within search window."
        );

    }

    bisect(valueFn, target, lowJd, highJd) {

        let lo = lowJd;
        let hi = highJd;

        for (let iteration = 0; iteration < 50; iteration++) {

            const mid = (lo + hi) / 2;
            const distance = this.normalize(target - this.normalize(valueFn(mid)));

            if (distance < 180) {
                lo = mid;
            } else {
                hi = mid;
            }

        }

        return (lo + hi) / 2;

    }

}

export default new CrossingTimeSearch();
