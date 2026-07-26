function formatLongitude(longitude) {
    if (typeof longitude !== 'number' || Number.isNaN(longitude)) {
        return '—';
    }

    // Degree within the zodiac sign (0°-30°), matching the
    // traditional Kundali table convention.
    const normalized = ((longitude % 360) + 360) % 360;
    const withinSign = normalized % 30;

    let degrees = Math.floor(withinSign);
    let minutes = Math.floor((withinSign - degrees) * 60);
    let seconds = Math.round(((withinSign - degrees) * 60 - minutes) * 60);

    if (seconds >= 60) {
        seconds = 0;
        minutes += 1;
    }

    if (minutes >= 60) {
        minutes = 0;
        degrees += 1;
    }

    if (degrees >= 30) {
        degrees = 0;
    }

    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${degrees}° ${minutes}' ${formattedSeconds}"`;
}

export function buildAstronomicalPlaceSummary(renderLayout) {
    if (!renderLayout || !Array.isArray(renderLayout.cells)) {
        return [];
    }

    const grahas = [];

    renderLayout.cells.forEach((cell) => {
        if (!Array.isArray(cell.regions)) {
            return;
        }

        cell.regions.forEach((region) => {
            if (!Array.isArray(region.padaGroups)) {
                return;
            }

            region.padaGroups.forEach((group) => {
                if (!Array.isArray(group.grahas)) {
                    return;
                }

                group.grahas.forEach((graha) => {
                    grahas.push({
                        id: graha.id,
                        name: graha.name,
                        displayName: graha.displayName,
                        longitude: graha.longitude,
                        formattedLongitude: formatLongitude(graha.longitude),
                        nakshatra: graha.nakshatra?.teluguName ?? '—',
                        pada: graha.pada ?? '—',
                        sthana: cell.sthana
                    });
                });
            });
        });
    });

    return grahas.sort((a, b) => a.sthana - b.sthana);
}
