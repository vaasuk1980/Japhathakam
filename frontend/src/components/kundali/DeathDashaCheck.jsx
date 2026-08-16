import { CURRENT_LEVEL_KEYS } from "./DashaGlance";
import { grahaName } from "../../kundali/constants/DashaGrahaNames";
import resolveGrahaNature from "../../utils/dasha/resolveGrahaNature";
import resolveCurrentDashaChain from "../../utils/dasha/resolveCurrentDashaChain";
import resolveEpochFromLocalDateTime from "../../utils/timezone/resolveEpochFromLocalDateTime";
import resolveAgeAtEpoch from "../../utils/age/resolveAgeAtEpoch";
import formatAgeYMD from "../../utils/age/formatAgeYMD";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

import "./DashaGlance.css";
import "./DeathDashaCheck.css";

// No time of death recorded — falls back to local midday rather than
// midnight, since midday is the smaller error for an unknown time of
// day (worst case ±12h either way; midnight biases a full day).
const NOON = "12:00";

/**
 * A validation aid, not a report field: shows which Mahadasha ->
 * Antardasha -> ... -> Pranadasha was actually running at a person's
 * recorded time of death — the same technique astrologers use to
 * sanity-check a chart/Dasha system against a known historical
 * outcome. Screen-only, like DashaGlance, whose "Currently Running
 * Dasha" card this deliberately mirrors (same CURRENT_LEVEL_KEYS,
 * same dasha-glance__current-* styling) for a different moment.
 */
function DeathDashaCheck({ dasha, timezone, dateOfDeath, timeOfDeath, natureByGraha, birthEpochMs }) {

    const { t, language } = useTranslation();

    if (!dateOfDeath) {
        return null;
    }

    const isApproximate = !timeOfDeath;

    const deathEpochMs = resolveEpochFromLocalDateTime(
        dateOfDeath,
        timeOfDeath || NOON,
        timezone
    );

    if (deathEpochMs === null) {
        return null;
    }

    if (deathEpochMs < birthEpochMs) {
        return (
            <div className="dasha-glance__current-card death-dasha-check">
                <h3 className="dasha-glance__current-title">{t("kundali.dashaGlance.deathCheckTitle")}</h3>
                <p className="death-dasha-check__note">{t("kundali.dashaGlance.deathBeforeBirth")}</p>
            </div>
        );
    }

    const chain = resolveCurrentDashaChain(dasha, timezone, deathEpochMs);

    if (!chain) {
        return null;
    }

    const ageAtDeath = formatAgeYMD(resolveAgeAtEpoch(birthEpochMs, deathEpochMs, timezone));

    return (
        <div className="dasha-glance__current-card death-dasha-check">

            <h3 className="dasha-glance__current-title">{t("kundali.dashaGlance.deathCheckTitle")}</h3>

            <p className="death-dasha-check__meta">
                {formatDateDDMMYYYY(dateOfDeath)}
                {timeOfDeath && <> · {timeOfDeath}</>}
                {" · "}{ageAtDeath}
            </p>

            {isApproximate && (
                <p className="death-dasha-check__note">{t("kundali.dashaGlance.deathCheckApproximate")}</p>
            )}

            <div className="dasha-glance__current-grid">
                {CURRENT_LEVEL_KEYS.map(({ key, labelKey }) => {

                    const period = chain[key];
                    const nature = resolveGrahaNature(period?.graha, natureByGraha);

                    return (
                        <div className="dasha-glance__current-item" key={key}>
                            <span className="dasha-glance__current-label">{t(labelKey)}</span>
                            <span className={
                                "dasha-glance__current-value" +
                                (nature ? ` dasha-glance__current-value--${nature}` : "")
                            }>
                                {period ? grahaName(period.graha, language) : "—"}
                            </span>
                        </div>
                    );

                })}
            </div>

        </div>
    );

}

export default DeathDashaCheck;
