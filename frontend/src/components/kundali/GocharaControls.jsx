import { useMemo } from "react";

import FormStateProvider from "../form/state/FormStateProvider";
import buildInitialFormState from "../../utils/forms/buildInitialFormState";
import buildGocharaSchema from "../../schemas/gochara.schema";

import { nowDateString, nowTimeString } from "../../utils/forms/nowDateTime";

import GocharaFields from "./GocharaFields";

function GocharaControls({ defaultPlace, onValuesChange }) {

    const schema = useMemo(
        () => buildGocharaSchema({
            dateOfBirth: nowDateString(),
            timeOfBirth: nowTimeString(),
            placeOfBirth: defaultPlace.placeOfBirth,
            latitude: defaultPlace.latitude,
            longitude: defaultPlace.longitude,
            timezone: defaultPlace.timezone,
        }),
        // Only rebuild (which resets the fields, including back
        // to "now") when the underlying birth place actually
        // changes — not on every parent re-render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            defaultPlace.placeOfBirth,
            defaultPlace.latitude,
            defaultPlace.longitude,
            defaultPlace.timezone,
        ]
    );

    const initialState = useMemo(
        () => buildInitialFormState(schema),
        [schema]
    );

    return (
        <FormStateProvider initialState={initialState}>
            <GocharaFields onValuesChange={onValuesChange} />
        </FormStateProvider>
    );

}

export default GocharaControls;
