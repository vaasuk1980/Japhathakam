import { useCallback, useMemo, useState } from "react";

import KundaliChart from "./KundaliChart";
import GocharaControls from "./GocharaControls";

import GenerateKundaliService from "../../services/GenerateKundaliService";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";

/**
 * Self-contained Gochara (transit) panel: owns its own date/time/
 * place controls and auto-recomputes the chart whenever they
 * change (debounced, no submit button — see GocharaFields). The
 * house grid stays anchored to the person's natal Lagna; only
 * the grahas placed into it come from the Gochara moment.
 */
function GocharaKundaliPanel({ birthDetails }) {

    const [renderLayout, setRenderLayout] = useState(null);
    const [error, setError] = useState(null);

    const defaultPlace = useMemo(() => ({
        placeOfBirth: birthDetails?.placeOfBirth ?? "",
        latitude: birthDetails?.latitude ?? "",
        longitude: birthDetails?.longitude ?? "",
        timezone: birthDetails?.timezone ?? "",
    }), [birthDetails]);

    const handleValuesChange = useCallback(async (gocharaValues) => {

        if (!birthDetails) {
            return;
        }

        try {

            const response = await GenerateKundaliService.generate({
                ...birthDetails,
                gochara: gocharaValues,
            });

            const gocharaChart = response.kundali.gocharaChart;

            if (gocharaChart) {
                setRenderLayout(KundaliRenderEngine.render(gocharaChart));
                setError(null);
            }

        }
        catch (requestError) {

            console.error("Gochara Generation Error", requestError);
            setError(requestError.message);

        }

    }, [birthDetails]);

    if (!birthDetails) {
        return null;
    }

    return (
        <section className="gochara-kundali-panel kundali-panel">
            <h2 className="kundali-panel__title">గోచార కుండలి</h2>

            <div className="kundali-panel__controls">
                <GocharaControls
                    defaultPlace={defaultPlace}
                    onValuesChange={handleValuesChange}
                />

                {error && (
                    <div className="gochara-error">{error}</div>
                )}
            </div>

            <KundaliChart chart={renderLayout} />
        </section>
    );

}

export default GocharaKundaliPanel;
