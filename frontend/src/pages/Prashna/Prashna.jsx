import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, MapPin } from "lucide-react";

import GenerateKundaliService from "../../services/GenerateKundaliService";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";
import { rasiForLongitude } from "../../kundali/constants/RasiNames";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import resolveUtcOffsetHours from "../../utils/timezone/resolveUtcOffsetHours";
import { useSavedLocation } from "../../location/LocationContext";
import { useTranslation } from "../../i18n/I18nContext";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { SkeletonLines } from "../../components/common/Skeleton/Skeleton";
import KundaliChart from "../../components/kundali/KundaliChart";
import PlanetaryPositionsTable from "../../components/kundali/PlanetaryPositionsTable";

import "./Prashna.css";

const pad = (value) => String(value).padStart(2, "0");

function currentDate() {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function currentTime() {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/**
 * Prashna (horary) chart — the chart cast for the moment a question is
 * asked, at the place it is asked. Nothing is saved: it is a live
 * calculation for the chosen date/time, defaulting to right now at the
 * header's saved location.
 */
function Prashna() {

    const { t, language } = useTranslation();
    const { location } = useSavedLocation();

    const [date, setDate] = useState(currentDate);
    const [time, setTime] = useState(currentTime);

    const [state, setState] = useState({ status: "idle", document: null, layout: null, error: null, castFor: null });

    const cast = useCallback(async (forDate, forTime) => {

        if (!location) {
            return;
        }

        setState((previous) => ({ ...previous, status: "loading", error: null }));

        try {

            const timezone = resolveUtcOffsetHours(location.timezoneId, forDate, forTime);

            const response = await GenerateKundaliService.generate({
                firstName: "Prashna",
                lastName: "Chart",
                gender: "other",
                dateOfBirth: forDate,
                timeOfBirth: forTime,
                placeOfBirth: location.label,
                latitude: location.latitude,
                longitude: location.longitude,
                timezone,
            });

            const document = response.kundali;

            setState({
                status: "success",
                document,
                layout: KundaliRenderEngine.render(document.janmaChart),
                error: null,
                castFor: { date: forDate, time: forTime, place: location.label },
            });

        }
        catch (error) {

            setState((previous) => ({ ...previous, status: "error", error: error.message }));

        }

    }, [location]);

    // First chart on arrival (and when the saved location changes).
    useEffect(() => {
        cast(date, time);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const useNow = () => {

        const nowDate = currentDate();
        const nowTime = currentTime();

        setDate(nowDate);
        setTime(nowTime);
        cast(nowDate, nowTime);

    };

    const lagna = state.document?.janmaChart?.lagna;
    const lagnaRasi = lagna ? rasiForLongitude(lagna.longitude) : null;

    let moon = null;

    (state.document?.janmaChart?.cells ?? []).forEach((cell) => {
        (cell.grahas || []).forEach((graha) => {
            if (graha.code === "MOON") {
                moon = graha;
            }
        });
    });

    const moonRasi = moon ? rasiForLongitude(moon.longitude) : null;
    const pick = (rasi) => (rasi ? (language === "te" ? rasi.tel : rasi.en) : "");

    return (
        <main className="page prashna-page">

            <header className="prashna-header">
                <span className="prashna-header__icon" aria-hidden="true">
                    <Compass size={22} />
                </span>

                <div>
                    <h1 className="page-title">{t("prashna.title")}</h1>
                    <p className="prashna-header__subtitle">{t("prashna.subtitle")}</p>
                </div>
            </header>

            <Card padding="medium" shadow="medium">
                <form
                    className="prashna-controls"
                    onSubmit={(event) => {
                        event.preventDefault();
                        cast(date, time);
                    }}
                >
                    <label className="prashna-field">
                        <span>{t("prashna.date")}</span>
                        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
                    </label>

                    <label className="prashna-field">
                        <span>{t("prashna.time")}</span>
                        <input type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
                    </label>

                    <div className="prashna-field prashna-field--place">
                        <span>{t("prashna.place")}</span>
                        <span className="prashna-place">
                            <MapPin size={16} aria-hidden="true" />
                            {location?.label ?? "—"}
                        </span>
                        <small>{t("prashna.placeHint")}</small>
                    </div>

                    <div className="prashna-actions">
                        <Button type="submit" variant="primary" disabled={state.status === "loading"}>
                            {state.status === "loading" ? t("prashna.casting") : t("prashna.cast")}
                        </Button>
                        <Button type="button" variant="secondary" onClick={useNow}>
                            {t("prashna.useNow")}
                        </Button>
                    </div>
                </form>
            </Card>

            {state.status === "error" && (
                <div className="person-actions__error">{state.error}</div>
            )}

            {state.status === "loading" && !state.document && (
                <Card padding="medium" shadow="medium">
                    <SkeletonLines count={6} />
                </Card>
            )}

            {state.document && (
                <>
                    <div className="prashna-facts">
                        {lagnaRasi && (
                            <div className="keyfact">
                                <span className="keyfact__label">{t("kundali.reportNav.lagna")}</span>
                                <span className="keyfact__value">{pick(lagnaRasi)}</span>
                            </div>
                        )}

                        {moonRasi && (
                            <div className="keyfact">
                                <span className="keyfact__label">{t("kundali.reportNav.moon")}</span>
                                <span className="keyfact__value">
                                    {pick(moonRasi)}
                                    {moon?.nakshatra && (
                                        <span className="keyfact__sub">
                                            {" · "}
                                            {language === "te" ? moon.nakshatra.teluguName : moon.nakshatra.englishName}
                                            {moon.pada ? ` - ${moon.pada}` : ""}
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}

                        {state.castFor && (
                            <div className="keyfact keyfact--wide">
                                <span className="keyfact__label">{t("prashna.castFor")}</span>
                                <span className="keyfact__value">
                                    {formatDateDDMMYYYY(state.castFor.date)} · {state.castFor.time}
                                    <span className="keyfact__sub"> · {state.castFor.place}</span>
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="prashna-body">
                        <Card padding="medium" shadow="medium" className="prashna-chart">
                            <KundaliChart chart={state.layout} />
                        </Card>

                        <div className="prashna-table">
                            <PlanetaryPositionsTable kundaliDocument={state.document} />
                        </div>
                    </div>
                </>
            )}

            <p className="prashna-note">
                {t("prashna.note")}{" "}
                <Link to="/person-details">{t("dashboard.quickActions.newHoroscope")}</Link>
            </p>

        </main>
    );

}

export default Prashna;
