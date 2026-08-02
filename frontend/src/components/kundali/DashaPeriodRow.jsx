import { useState } from "react";

import DashaSubdivisionEngine from "../../kundali/engines/DashaSubdivisionEngine";
import { DASHA_LEVEL_LABELS } from "../../kundali/constants/DashaConstants";
import { DASHA_GRAHA_NAMES } from "../../kundali/constants/DashaGrahaNames";
import isCurrentPeriod from "../../utils/dasha/isCurrentPeriod";
import resolveAgeAtEpoch from "../../utils/age/resolveAgeAtEpoch";
import formatAgeYMD from "../../utils/age/formatAgeYMD";
import resolveGrahaNature from "../../utils/dasha/resolveGrahaNature";
import translateDurationDisplay from "../../utils/dasha/translateDurationDisplay";
import { useTranslation } from "../../i18n/I18nContext";

const MAX_DEPTH = DASHA_LEVEL_LABELS.length - 1; // 4 = Pranadasha, the deepest level (Rule 12)

/**
 * One ruling-Graha period row, at any of the 5 Dasha levels. The
 * first two levels (Mahadasha, Antardasha) already arrive fully
 * computed from the backend via `period.children`; deeper levels
 * (Pratyantardasha/Sukshmadasha/Pranadasha) are computed lazily, in
 * the browser, the first time a row is expanded — see
 * DashaSubdivisionEngine.
 */
function DashaPeriodRow({ period, depth, timezone, birthEpochMs, defaultExpanded = false, natureByGraha }) {

    const { language } = useTranslation();
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [computedChildren, setComputedChildren] = useState(null);

    const canExpand = depth < MAX_DEPTH;
    const children = (period.children && period.children.length > 0)
        ? period.children
        : computedChildren;

    const handleToggle = () => {

        if (!canExpand) {
            return;
        }

        if (!children) {
            setComputedChildren(
                DashaSubdivisionEngine.subdivide(
                    period.graha,
                    period.startEpochMs,
                    period.durationYears,
                    timezone
                )
            );
        }

        setExpanded((previous) => !previous);

    };

    const current = isCurrentPeriod(period);
    const nature = resolveGrahaNature(period.graha, natureByGraha);

    const ageAtStart = translateDurationDisplay(
        formatAgeYMD(resolveAgeAtEpoch(birthEpochMs, period.startEpochMs, timezone)),
        language
    );

    const ageAtEnd = translateDurationDisplay(
        formatAgeYMD(resolveAgeAtEpoch(birthEpochMs, period.endEpochMs, timezone)),
        language
    );

    return (
        <div className="dasha-row-group">

            <button
                type="button"
                className={
                    "dasha-row" +
                    (current ? " dasha-row--current" : "") +
                    (!canExpand ? " dasha-row--leaf" : "")
                }
                style={{ paddingLeft: `${12 + depth * 20}px` }}
                onClick={handleToggle}
                disabled={!canExpand}
                aria-expanded={canExpand ? expanded : undefined}
            >
                <span className={
                    "dasha-row__chevron" +
                    (expanded ? " dasha-row__chevron--open" : "")
                }>
                    {canExpand ? "▸" : ""}
                </span>

                <span className={"dasha-row__graha" + (nature ? ` dasha-row__graha--${nature}` : "")}>
                    {DASHA_GRAHA_NAMES[period.graha] ?? period.displayName}
                </span>

                <span className="dasha-row__range">
                    {period.start}
                    <span className="dasha-row__arrow">→</span>
                    {period.end}
                </span>

                <span className="dasha-row__age">
                    {ageAtStart}
                    <span className="dasha-row__arrow">→</span>
                    {ageAtEnd}
                </span>

                <span className="dasha-row__duration">
                    {translateDurationDisplay(period.durationDisplay, language)}
                </span>
            </button>

            {expanded && children && (
                <div className="dasha-row-children">
                    {children.map((child) => (
                        <DashaPeriodRow
                            key={`${child.graha}-${child.startEpochMs}`}
                            period={child}
                            depth={depth + 1}
                            timezone={timezone}
                            birthEpochMs={birthEpochMs}
                            natureByGraha={natureByGraha}
                        />
                    ))}
                </div>
            )}

        </div>
    );

}

export default DashaPeriodRow;
