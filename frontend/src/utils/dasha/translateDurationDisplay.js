const UNIT_TE = {
    y: "సం",
    m: "నె",
    d: "ది",
    h: "గం",
};

/**
 * Re-labels a "X y M m Z d" / "N h"-style duration or age string's
 * unit letters into Telugu abbreviations when Telugu is selected —
 * formatDashaDuration/formatAgeYMD (and the backend's
 * DashaDurationFormatter) stay language-agnostic; this only
 * relabels the already-formatted string for display.
 */
export default function translateDurationDisplay(durationDisplay, language) {

    if (language !== "te" || !durationDisplay) {
        return durationDisplay;
    }

    return durationDisplay.replace(
        /(\d+) ([ymdh])\b/g,
        (match, count, unit) => `${count} ${UNIT_TE[unit]}`
    );

}
