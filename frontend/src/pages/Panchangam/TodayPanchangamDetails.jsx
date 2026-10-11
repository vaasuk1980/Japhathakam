import { computeTithi, computeVara, computeAyana, formatTithiShort } from "../../kundali/utils/panchangamMath";
import { translateMasa, translateSamvatsara } from "../../kundali/constants/PanchangamNameTranslations";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useSavedLocation } from "../../location/LocationContext";
import { useTranslation } from "../../i18n/I18nContext";

// Today's Panchangam: the three limbs this application computes
// (Tithi, Vara, Nakshatra) as large tiles, then the supporting
// calendar facts and sunrise/sunset as a quieter second row. Yoga
// and Karana are not part of this application's method.
function TodayPanchangamDetails({ snapshotState }) {

    const { t, language } = useTranslation();
    const { location } = useSavedLocation();
    const data = snapshotState.data;
    const pick = (bilingual) => (bilingual ? (language === "te" ? bilingual.te : bilingual.en) : null);

    const sun = data?.planetPositions?.find((position) => position.planet === "SUN");
    const moon = data?.planetPositions?.find((position) => position.planet === "MOON");

    const tithi = sun && moon ? computeTithi(sun.longitude, moon.longitude) : null;
    const vara = data ? pick(computeVara(data.date)) : null;
    const ayanam = sun ? pick(computeAyana(sun.longitude)) : null;
    const masam = data ? pick(translateMasa(data.masaName, data.masaIsLeap)) : null;
    const samvatsaram = data ? pick(translateSamvatsara(data.samvatsaraName)) : null;

    const nakshatra = (language === "te" ? moon?.nakshatra?.teluguName : moon?.nakshatra?.englishName) ?? "—";
    const pada = moon?.pada?.number ? ` - ${moon.pada.number}` : "";

    return (
        <section className="rt-table-section pan-today">
            <div className="pan-today__head">
                <h2 className="rt-table-title">{t("panchangam.todayTitle")}</h2>

                {data && (
                    <p className="pan-today__sub">
                        {formatDateDDMMYYYY(data.date)}
                        {location?.label ? ` · ${location.label}` : ""}
                    </p>
                )}
            </div>

            {snapshotState.status === "loading" && (
                <p className="rt-table-empty">{t("dashboard.today.loading")}</p>
            )}

            {snapshotState.status === "error" && (
                <p className="rt-table-empty">{snapshotState.error}</p>
            )}

            {snapshotState.status === "success" && data && (
                <>
                    <div className="pan-today__hero">
                        <div className="pan-today__tile">
                            <span className="pan-today__label">{t("dashboard.today.tithi")}</span>
                            <span className="pan-today__big">{formatTithiShort(tithi, language) ?? "—"}</span>
                        </div>

                        <div className="pan-today__tile">
                            <span className="pan-today__label">{t("dashboard.today.vara")}</span>
                            <span className="pan-today__big">{vara ?? "—"}</span>
                        </div>

                        <div className="pan-today__tile">
                            <span className="pan-today__label">{t("dashboard.today.nakshatraPada")}</span>
                            <span className="pan-today__big">{nakshatra}{pada}</span>
                            <span className="pan-today__range">
                                {data.nakshatraStart} → {data.nakshatraEnd}
                            </span>
                        </div>
                    </div>

                    <dl className="pan-today__facts">
                        <div><dt>{t("dashboard.today.samvatsaram")}</dt><dd>{samvatsaram ?? "—"}</dd></div>
                        <div><dt>{t("dashboard.today.masam")}</dt><dd>{masam ?? "—"}</dd></div>
                        <div><dt>{t("dashboard.today.ayanam")}</dt><dd>{ayanam ?? "—"}</dd></div>
                        <div><dt>{t("dashboard.today.sunrise")}</dt><dd>{data.sunrise}</dd></div>
                        <div><dt>{t("dashboard.today.sunset")}</dt><dd>{data.sunset}</dd></div>
                    </dl>
                </>
            )}
        </section>
    );

}

export default TodayPanchangamDetails;
