/*
==================================================================
    Japhathakam Enterprise Form Framework
    Age Display
------------------------------------------------------------------
    Read-only field that computes the person's current age
    (Years, Months, Days, Hours) from Date/Time of Birth versus
    the current moment. Not user-editable, and not part of the
    submitted form values — purely a live convenience display.
==================================================================
*/

import "./AgeDisplay.css";

import useForm from "../state/useForm";
import FieldWrapper from "../layout/FieldWrapper";

function parseBirthMoment(dateOfBirth, timeOfBirth) {

    if (!dateOfBirth || !timeOfBirth) {
        return null;
    }

    const [year, month, day] = dateOfBirth.split("-").map(Number);
    const [hour, minute] = timeOfBirth.split(":").map(Number);

    if ([year, month, day, hour, minute].some(Number.isNaN)) {
        return null;
    }

    return new Date(year, month - 1, day, hour, minute);

}

function calculateAge(birthMoment, now) {

    let years = now.getFullYear() - birthMoment.getFullYear();
    let months = now.getMonth() - birthMoment.getMonth();
    let days = now.getDate() - birthMoment.getDate();
    let hours = now.getHours() - birthMoment.getHours();

    if (hours < 0) {
        hours += 24;
        days -= 1;
    }

    if (days < 0) {
        months -= 1;

        const daysInPreviousMonth =
            new Date(now.getFullYear(), now.getMonth(), 0).getDate();

        days += daysInPreviousMonth;
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days, hours };

}

function formatAge({ years, months, days, hours }) {
    return `${years} Y, ${months} M, ${days} D, ${hours} H`;
}

export default function AgeDisplay({
    name,
    label,
    helperText = "",
}) {

    const { state } = useForm();

    const birthMoment = parseBirthMoment(
        state.values.dateOfBirth,
        state.values.timeOfBirth
    );

    const now = new Date();

    const display =
        birthMoment && birthMoment <= now
            ? formatAge(calculateAge(birthMoment, now))
            : "—";

    const inputId = `jp-field-${name}`;
    const helperId = `${inputId}-helper`;

    return (
        <FieldWrapper
            label={label}
            helperText={helperText}
            inputId={inputId}
            helperId={helperId}
        >
            <div
                id={inputId}
                className="jp-age-display"
                aria-describedby={helperId}
            >
                {display}
            </div>
        </FieldWrapper>
    );

}
