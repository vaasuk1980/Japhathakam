import useSkySnapshot from "../../hooks/useSkySnapshot";
import { computeTithi, computeVara, computeAyana } from "../../kundali/utils/panchangamMath";
import { translateMasa, translateSamvatsara } from "../../kundali/constants/PanchangamNameTranslations";
import { useSavedLocation } from "../../location/LocationContext";
import { useTranslation } from "../../i18n/I18nContext";

// Full version of the Dashboard's compact "Panchangam · Today" card
// (see TodayPanel.jsx) — same live snapshot, same fields, but with
// room to show the Nakshatra's full start/end window instead of
// just a "Full Details" link pointing here.
function TodayPanchangamDetails() {

    const { t, language } = useTranslation();
    const { location } = useSavedLocation();
    const snapshotState = useSkySnapshot(location);
    const data = snapshotState.data;
    const pick = (bilingual) => (bilingual ? (language === "te" ? bilingual.te : bilingual.en) : null);

    const sun = data?.planetPositions?.find((position) => position.planet === "SUN");
    const moon = data?.planetPositions?.find((position) => position.planet === "MOON");

    const tithi = sun && moon ? computeTithi(sun.longitude, moon.longitude) : null;
    const vara = data ? pick(computeVara(data.date)) : null;
    const ayanam = sun ? pick(computeAyana(sun.longitude)) : null;
    const masam = data ? pick(translateMasa(data.masaName, data.masaIsLeap)) : null;

    return (
        <section className="rt-table-section">
            <h2 className="rt-table-title">{t("panchangam.todayTitle")}</h2>

            {snapshotState.status === "loading" && (
                <p className="rt-table-empty">{t("dashboard.today.loading")}</p>
            )}

            {snapshotState.status === "error" && (
                <p className="rt-table-empty">{snapshotState.error}</p>
            )}

            {snapshotState.status === "success" && data && (
                <div className="rt-panchangam-grid">
                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.ayanam")}</span>
                        <span className="rt-panchangam-grid__value">{ayanam ?? "—"}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.samvatsaram")}</span>
                        <span className="rt-panchangam-grid__value">
                            {pick(translateSamvatsara(data.samvatsaraName)) ?? "—"}
                        </span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.masam")}</span>
                        <span className="rt-panchangam-grid__value">{masam}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.tithi")}</span>
                        <span className="rt-panchangam-grid__value">
                            {tithi ? `${pick(tithi.paksha)} · ${pick(tithi.name)}` : "—"}
                        </span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.vara")}</span>
                        <span className="rt-panchangam-grid__value">{vara ?? "—"}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.sunrise")}</span>
                        <span className="rt-panchangam-grid__value">{data.sunrise}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.sunset")}</span>
                        <span className="rt-panchangam-grid__value">{data.sunset}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.nakshatraPada")}</span>
                        <span className="rt-panchangam-grid__value">
                            {language === "te"
                                ? (moon?.nakshatra?.teluguName ?? "—")
                                : (moon?.nakshatra?.englishName ?? "—")}
                            {moon?.pada?.number ? ` - ${moon.pada.number}` : ""}
                        </span>
                    </div>

                    <div className="rt-panchangam-grid__item rt-panchangam-grid__item--wide">
                        <span className="rt-panchangam-grid__label">{t("dashboard.today.nakshatraDuration")}</span>
                        <span className="rt-panchangam-grid__value rt-panchangam-grid__value--range">
                            {data.nakshatraStart} → {data.nakshatraEnd}
                        </span>
                    </div>
                </div>
            )}
        </section>
    );

}

export default TodayPanchangamDetails;
