import { Link } from "react-router-dom";

import { computeTithi, computeVara, computeAyana, formatTithiShort } from "../../kundali/utils/panchangamMath";
import { translateMasa, translateSamvatsara } from "../../kundali/constants/PanchangamNameTranslations";
import { useTranslation } from "../../i18n/I18nContext";

import Card from "../../components/common/Card";
import { SkeletonLines } from "../../components/common/Skeleton/Skeleton";

import "./TodayPanel.css";

function TodayPanchangamCard({ snapshotState, t }) {

    const { language } = useTranslation();
    const data = snapshotState.data;
    const pick = (bilingual) => (bilingual ? (language === "te" ? bilingual.te : bilingual.en) : null);

    const sun = data?.planetPositions?.find((position) => position.planet === "SUN");
    const moon = data?.planetPositions?.find((position) => position.planet === "MOON");

    const tithi = sun && moon ? computeTithi(sun.longitude, moon.longitude) : null;
    const vara = data ? pick(computeVara(data.date)) : null;
    const ayanam = sun ? pick(computeAyana(sun.longitude)) : null;
    const masam = data ? pick(translateMasa(data.masaName, data.masaIsLeap)) : null;

    return (
        <Card className="dashboard-card today-card" padding="medium" shadow="medium">
            <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">{t("dashboard.today.panchangamTitle")}</h2>
                <Link to="/panchangam" className="dashboard-card__link">
                    {t("dashboard.today.viewAll")}
                </Link>
            </div>

            {snapshotState.status === "loading" && (
                <SkeletonLines count={6} />
            )}

            {snapshotState.status === "error" && (
                <p className="dashboard-card__empty">{t("dashboard.today.error")}</p>
            )}

            {snapshotState.status === "success" && (
                <div className="today-panchangam-grid">
                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.ayanam")}</span>
                        <span className="today-panchangam-grid__value">{ayanam ?? "—"}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.samvatsaram")}</span>
                        <span className="today-panchangam-grid__value">
                            {pick(translateSamvatsara(data.samvatsaraName)) ?? "—"}
                        </span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.masam")}</span>
                        <span className="today-panchangam-grid__value">{masam}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.tithi")}</span>
                        <span className="today-panchangam-grid__value">
                            {formatTithiShort(tithi, language) ?? "—"}
                        </span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.vara")}</span>
                        <span className="today-panchangam-grid__value">{vara ?? "—"}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.sunrise")}</span>
                        <span className="today-panchangam-grid__value">{data.sunrise}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.sunset")}</span>
                        <span className="today-panchangam-grid__value">{data.sunset}</span>
                    </div>

                    <div className="today-panchangam-grid__item">
                        <span className="today-panchangam-grid__label">{t("dashboard.today.nakshatra")}</span>
                        <span className="today-panchangam-grid__value">
                            {(language === "te" ? moon?.nakshatra?.teluguName : moon?.nakshatra?.englishName) ?? "—"}
                            {moon?.pada?.number ? ` - ${moon.pada.number}` : ""}
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );

}

function TodayPanel({ recentSlot, snapshotState }) {

    const { t } = useTranslation();

    return (
        <div className="today-panel">
            <div className="today-panel__cards">
                <TodayPanchangamCard snapshotState={snapshotState} t={t} />
                {recentSlot}
            </div>
        </div>
    );

}

export default TodayPanel;
