import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

import DashaSubdivisionEngine from "../../kundali/engines/DashaSubdivisionEngine";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import isCurrentPeriod from "../../utils/dasha/isCurrentPeriod";
import resolveAgeAtEpoch from "../../utils/age/resolveAgeAtEpoch";
import resolveGrahaNature from "../../utils/dasha/resolveGrahaNature";
import translateDurationDisplay from "../../utils/dasha/translateDurationDisplay";
import { useTranslation } from "../../i18n/I18nContext";
import { CURRENT_LEVEL_KEYS } from "./DashaGlance";
import NatureMark from "./NatureMark";
import {
    formatDay,
    formatExact,
    formatMonthYear,
    progressPercent,
} from "./dashaFormat";

const MAX_DEPTH = CURRENT_LEVEL_KEYS.length - 1; // 4 = Pranadasha

/**
 * Drill-down Dasha explorer. `path` is the chain of periods already
 * opened (e.g. [Sun, Jupiter]); the list shows that last period's
 * children, or every Mahadasha when the path is empty. The level
 * switcher jumps straight to a level along the *running* chain;
 * the breadcrumb walks back up; tapping a row goes one level down.
 */
function DashaExplorer({ dasha, chain, timezone, natureByGraha, now }) {

    const { t, language } = useTranslation();

    const runningPath = useMemo(() => {

        if (!chain) {
            return [];
        }

        return CURRENT_LEVEL_KEYS.map(({ key }) => chain[key]).filter(Boolean);

    }, [chain]);

    // Opens on the running Mahadasha's Antardashas — the most useful
    // default; the lifetime overview above already shows the Mahadashas.
    const [path, setPath] = useState(() => runningPath.slice(0, 1));

    const level = path.length;
    const birthEpochMs = dasha.mahadashas[0].startEpochMs;

    const rows = useMemo(() => {

        if (level === 0) {
            return dasha.mahadashas;
        }

        const parent = path[level - 1];

        if (parent.children && parent.children.length > 0) {
            return parent.children;
        }

        return DashaSubdivisionEngine.subdivide(
            parent.graha,
            parent.startEpochMs,
            parent.durationYears,
            timezone
        );

    }, [dasha, path, level, timezone]);

    const fmt = level < 2 ? formatMonthYear : formatDay;

    const ageYears = (epochMs) => resolveAgeAtEpoch(birthEpochMs, epochMs, timezone).years;

    return (
        <div className="dasha-explorer">

            <div className="dasha-explorer__levels" role="tablist">
                {CURRENT_LEVEL_KEYS.map(({ labelKey }, index) => {

                    const reachable = index <= runningPath.length;

                    return (
                        <button
                            key={labelKey}
                            type="button"
                            role="tab"
                            aria-selected={level === index}
                            className={"dasha-explorer__level" + (level === index ? " is-active" : "")}
                            disabled={!reachable}
                            onClick={() => setPath(runningPath.slice(0, index))}
                        >
                            <span className="dasha-level-num">{index + 1}</span>
                            {t(labelKey)}
                        </button>
                    );

                })}
            </div>

            <nav className="dasha-explorer__crumbs" aria-label="Dasha path">
                <button
                    type="button"
                    className={"dasha-explorer__crumb" + (level === 0 ? " is-current" : "")}
                    onClick={() => setPath([])}
                >
                    {t("kundali.dashaUi.all")}
                </button>

                {path.map((period, index) => (
                    <span className="dasha-explorer__crumb-wrap" key={`${period.graha}-${period.startEpochMs}`}>
                        <ChevronRight size={14} aria-hidden="true" />
                        <button
                            type="button"
                            className={"dasha-explorer__crumb" + (index === level - 1 ? " is-current" : "")}
                            onClick={() => setPath(path.slice(0, index + 1))}
                        >
                            {grahaName(period.graha, language)}
                        </button>
                    </span>
                ))}
            </nav>

            <ul className="dasha-explorer__list">
                {rows.map((period) => {

                    const current = isCurrentPeriod(period, now);
                    const nature = resolveGrahaNature(period.graha, natureByGraha);
                    const canDrill = level < MAX_DEPTH;
                    const percent = current ? progressPercent(period, now) : 0;

                    const content = (
                        <>
                            <span className="dasha-explorer__main">
                                <span className="dasha-explorer__name">
                                    <NatureMark nature={nature} />
                                    {grahaName(period.graha, language)}
                                    {current && <span className="dasha-explorer__badge">{t("kundali.dashaUi.running")}</span>}
                                </span>

                                <span
                                    className="dasha-explorer__range"
                                    title={`${formatExact(period.startEpochMs, timezone)} → ${formatExact(period.endEpochMs, timezone)}`}
                                >
                                    {fmt(period.startEpochMs, timezone, language)}
                                    {" – "}
                                    {fmt(period.endEpochMs, timezone, language)}
                                </span>

                                {current && (
                                    <span className="dasha-explorer__bar" aria-hidden="true">
                                        <span style={{ width: `${percent}%` }} />
                                    </span>
                                )}
                            </span>

                            <span className="dasha-explorer__meta">
                                <span className="dasha-explorer__duration">
                                    {translateDurationDisplay(period.durationDisplay, language)}
                                </span>
                                <span className="dasha-explorer__age">
                                    {t("kundali.dashaUi.age", {
                                        from: ageYears(period.startEpochMs),
                                        to: ageYears(period.endEpochMs),
                                    })}
                                </span>
                            </span>

                            {canDrill && <ChevronRight size={16} className="dasha-explorer__chev" aria-hidden="true" />}
                        </>
                    );

                    const className = "dasha-explorer__row" + (current ? " is-current" : "");
                    const key = `${period.graha}-${period.startEpochMs}`;

                    return (
                        <li key={key}>
                            {canDrill ? (
                                <button
                                    type="button"
                                    className={className}
                                    onClick={() => setPath([...path, period])}
                                >
                                    {content}
                                </button>
                            ) : (
                                <div className={className}>{content}</div>
                            )}
                        </li>
                    );

                })}
            </ul>

        </div>
    );

}

export default DashaExplorer;
