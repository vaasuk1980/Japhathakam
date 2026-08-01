import useSkySnapshot from "../../hooks/useSkySnapshot";
import { computeTithi, computeVara, computeAyana } from "../../kundali/utils/panchangamMath";
import { useSavedLocation } from "../../location/LocationContext";

// Full version of the Dashboard's compact "Panchangam · Today" card
// (see TodayPanel.jsx) — same live snapshot, same fields, but with
// room to show the Nakshatra's full start/end window instead of
// just a "Full Details" link pointing here.
function TodayPanchangamDetails() {

    const { location } = useSavedLocation();
    const snapshotState = useSkySnapshot(location);
    const data = snapshotState.data;

    const sun = data?.planetPositions?.find((position) => position.planet === "SUN");
    const moon = data?.planetPositions?.find((position) => position.planet === "MOON");

    const tithi = sun && moon ? computeTithi(sun.longitude, moon.longitude) : null;
    const vara = data ? computeVara(data.date) : null;
    const ayanam = sun ? computeAyana(sun.longitude) : null;
    const masam = data ? `${data.masaIsLeap ? "అధిక " : ""}${data.masaName}` : null;

    return (
        <section className="rt-table-section">
            <h2 className="rt-table-title">నేటి పంచాంగం · Today's Panchangam</h2>

            {snapshotState.status === "loading" && (
                <p className="rt-table-empty">లోడ్ అవుతోంది... · Loading...</p>
            )}

            {snapshotState.status === "error" && (
                <p className="rt-table-empty">{snapshotState.error}</p>
            )}

            {snapshotState.status === "success" && data && (
                <div className="rt-panchangam-grid">
                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">అయనం · Ayanam</span>
                        <span className="rt-panchangam-grid__value">{ayanam ?? "—"}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">సంవత్సరం · Samvatsaram</span>
                        <span className="rt-panchangam-grid__value">{data.samvatsaraName}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">మాసం · Masam</span>
                        <span className="rt-panchangam-grid__value">{masam}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">తిథి · Tithi</span>
                        <span className="rt-panchangam-grid__value">
                            {tithi ? `${tithi.paksha} · ${tithi.name}` : "—"}
                        </span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">వారం · Vara</span>
                        <span className="rt-panchangam-grid__value">{vara ?? "—"}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">సూర్యోదయం · Sunrise</span>
                        <span className="rt-panchangam-grid__value">{data.sunrise}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">సూర్యాస్తమయం · Sunset</span>
                        <span className="rt-panchangam-grid__value">{data.sunset}</span>
                    </div>

                    <div className="rt-panchangam-grid__item">
                        <span className="rt-panchangam-grid__label">నక్షత్రం - పాదం · Nakshatra - Pada</span>
                        <span className="rt-panchangam-grid__value">
                            {moon?.nakshatra?.teluguName ?? "—"}
                            {moon?.nakshatra?.englishName ? ` · ${moon.nakshatra.englishName}` : ""}
                            {moon?.pada?.number ? ` - ${moon.pada.number}` : ""}
                        </span>
                    </div>

                    <div className="rt-panchangam-grid__item rt-panchangam-grid__item--wide">
                        <span className="rt-panchangam-grid__label">నక్షత్ర వ్యవధి · Nakshatra Duration</span>
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
