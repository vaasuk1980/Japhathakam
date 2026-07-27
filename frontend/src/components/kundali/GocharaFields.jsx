import { useEffect, useRef } from "react";

import useForm from "../form/state/useForm";
import FieldRenderer from "../FormEngine/FieldRenderer";

import { nowDateString, nowTimeString } from "../../utils/forms/nowDateTime";

import "./GocharaFields.css";

const DATE_FIELD = { id: "dateOfBirth", label: "Date", type: "date" };
const TIME_FIELD = { id: "timeOfBirth", label: "Time", type: "time" };
const PLACE_FIELD = {
    id: "placeOfBirth",
    label: "Place",
    type: "place",
    placeholder: "Start typing a city name...",
};

const LIVE_TICK_INTERVAL_MS = 30000;
const DEBOUNCE_MS = 500;

function GocharaFields({ onValuesChange }) {

    const { state, actions } = useForm();

    const isDateTimeManuallySet =
        Boolean(state.dirty.dateOfBirth || state.dirty.timeOfBirth);

    // While the user hasn't manually changed the date/time, keep
    // ticking them forward to "now" so the transit chart stays
    // live. The moment either field is manually edited, this
    // stops — it becomes a fixed snapshot for that moment.
    useEffect(() => {

        const interval = setInterval(() => {

            if (isDateTimeManuallySet) {
                return;
            }

            actions.setValue("dateOfBirth", nowDateString());
            actions.setValue("timeOfBirth", nowTimeString());

        }, LIVE_TICK_INTERVAL_MS);

        return () => clearInterval(interval);

    }, [isDateTimeManuallySet, actions]);

    // Auto-recompute whenever the values change (including the
    // live tick above) — no submit button.
    const debounceRef = useRef(null);

    useEffect(() => {

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onValuesChange(state.values);
        }, DEBOUNCE_MS);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };

    }, [state.values, onValuesChange]);

    return (
        <div className="gochara-fields">
            <FieldRenderer field={DATE_FIELD} />
            <FieldRenderer field={TIME_FIELD} />
            <FieldRenderer field={PLACE_FIELD} />
        </div>
    );

}

export default GocharaFields;
