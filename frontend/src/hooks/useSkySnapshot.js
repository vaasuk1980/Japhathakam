/**
 * ============================================================
 * JAPHATHAKAM
 * useSkySnapshot
 * ------------------------------------------------------------
 * Layer : Presentation Hook
 *
 * Responsibility:
 *   Fetches "right now" planetary/Panchangam data for a saved
 *   location and keeps it refreshed — shared by the Dashboard's
 *   Today panel and the Panchangam page's "Today's Panchangam"
 *   section, since both need the exact same live snapshot.
 * ============================================================
 */

import { useEffect, useState } from "react";

import SkySnapshotService from "../services/SkySnapshotService";
import resolveUtcOffsetHours from "../utils/timezone/resolveUtcOffsetHours";

// The ascendant moves roughly one Rashi every ~2 hours, so a snapshot
// that only re-fetches on location change would silently go stale if
// the page is left open — refresh periodically so Lagna (and
// everything relative to it) stays live.
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

function todayIsoDate() {

    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

}

function nowHHMM() {

    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;

}

export default function useSkySnapshot(location) {

    const [state, setState] = useState({ status: "idle", data: null, error: null });

    useEffect(() => {

        if (!location) {
            setState({ status: "idle", data: null, error: null });
            return;
        }

        let cancelled = false;

        function fetchSnapshot(isRefresh) {

            if (!isRefresh) {
                setState({ status: "loading", data: null, error: null });
            }

            const date = todayIsoDate();
            const time = nowHHMM();
            const timezone = resolveUtcOffsetHours(location.timezoneId, date, time);

            SkySnapshotService.get({
                date,
                time,
                latitude: location.latitude,
                longitude: location.longitude,
                timezone,
            })
                .then((data) => {
                    if (!cancelled) {
                        setState({ status: "success", data: { ...data, date }, error: null });
                    }
                })
                .catch((error) => {
                    if (!cancelled) {
                        setState({ status: "error", data: null, error: error.message });
                    }
                });

        }

        fetchSnapshot(false);

        // The ascendant (and, to a lesser extent, the planets) keep
        // moving — re-fetch periodically so a page left open doesn't
        // silently show a stale Lagna. Passes isRefresh=true so this
        // doesn't flash the loading state over live data.
        const timer = setInterval(() => fetchSnapshot(true), REFRESH_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(timer);
        };

    // Re-fetch (and restart the refresh timer) only when the location
    // actually changes — the timer above is what handles time passing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.latitude, location?.longitude, location?.timezoneId]);

    return state;

}
