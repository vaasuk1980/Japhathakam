import { useEffect, useRef, useState } from "react";
import useForm from "../state/useForm";
import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";
import GeocodingService from "../../../services/GeocodingService";
import resolveUtcOffsetHours from "../../../utils/timezone/resolveUtcOffsetHours";
import computeLocalMeanTimeOffset from "../../../utils/timezone/computeLocalMeanTimeOffset";

import "./PlaceAutocomplete.css";

const SEARCH_DEBOUNCE_MS = 350;

// Most countries had adopted some form of unified standard time by
// this point (India's own last unification was 1947) — the Local
// Mean Time hint below is only relevant, and only shown, for births
// before it. A birth without a known/parseable year doesn't show it
// either, rather than guessing.
const PRE_STANDARD_TIME_CUTOFF_YEAR = 1950;

function birthYearFrom(dateOfBirth) {

    const year = Number(String(dateOfBirth || "").slice(0, 4));

    return Number.isInteger(year) && year > 0 ? year : null;

}

// "+4:38" / "-0:22" style — matches how the Time Zone Offset field's
// own placeholder ("e.g. 5.5 for IST") talks about offsets, just
// resolved to whole minutes for readability.
function formatOffsetHoursAsClock(offsetHours) {

    const sign = offsetHours < 0 ? "-" : "+";
    const totalMinutes = Math.round(Math.abs(offsetHours) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${sign}${hours}:${String(minutes).padStart(2, "0")}`;

}

export default function PlaceAutocomplete({
  name,
  label,
  placeholder = "Enter place of birth",
  required = false,
  helperText = "",
}) {
  const field = useField(name);
  const { state, actions } = useForm();

  const { value, error, touched, disabled, onChange, onBlur } = field;

  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const [useLmt, setUseLmt] = useState(false);

  // Longitude comes off the field as a string (native <input
  // type="number"> onChange always hands back event.target.value —
  // see useField.js), so it's coerced once here rather than in every
  // place that needs it as a real number.
  const longitudeValue = Number(state.values.longitude);
  const lmtOffset = Number.isNaN(longitudeValue)
    ? null
    : computeLocalMeanTimeOffset(longitudeValue);

  const birthYear = birthYearFrom(state.values.dateOfBirth);
  const showLmtHint = lmtOffset !== null
    && birthYear !== null
    && birthYear < PRE_STANDARD_TIME_CUTOFF_YEAR;

  // Remembered so the offset can be recomputed (DST-correctly) if
  // the birth date/time changes after a place has already been
  // picked — a place's UTC offset is not a fixed constant.
  const selectedTimezoneId = useRef(null);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  function handleInputChange(event) {

    onChange(event);
    setIsOpen(true);
    setSearchError(null);

    const query = event.target.value;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {

      const requestId = ++requestIdRef.current;

      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);

      try {

        const results = await GeocodingService.search(query);

        // Ignore replies to a since-superseded request (the user
        // kept typing while this one was in flight).
        if (requestId === requestIdRef.current) {
          setSuggestions(results);
        }

      }
      catch (requestError) {

        console.error("Place search error", requestError);

        if (requestId === requestIdRef.current) {
          setSuggestions([]);
          setSearchError("Could not search places — check your connection, or enter the details manually below.");
        }

      }
      finally {
        if (requestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }

    }, SEARCH_DEBOUNCE_MS);

  }

  function handleSelectPlace(place) {

    field.setValue(place.label);
    field.setTouched(true);

    actions.setValue("latitude", place.latitude);
    actions.setValue("longitude", place.longitude);

    actions.setReadOnly("latitude", true);
    actions.setReadOnly("longitude", true);
    actions.setReadOnly("timezone", true);

    selectedTimezoneId.current = place.timezoneId;

    actions.setValue(
      "timezone",
      resolveUtcOffsetHours(
        place.timezoneId,
        state.values.dateOfBirth,
        state.values.timeOfBirth
      )
    );

    setIsManual(false);
    setUseLmt(false);
    setIsOpen(false);
    setSuggestions([]);

  }

  // A place's UTC offset depends on the birth date (DST) — if the
  // date/time changes after a place was already selected, keep the
  // offset in sync rather than leaving a stale value in place. Not
  // relevant once Local Mean Time is in use — that's a pure function
  // of longitude (see computeLocalMeanTimeOffset), constant regardless
  // of date, so there's nothing to recompute, and doing so anyway
  // would silently overwrite the user's LMT choice back to zone time.
  useEffect(() => {

    if (!selectedTimezoneId.current || isManual || useLmt) {
      return;
    }

    actions.setValue(
      "timezone",
      resolveUtcOffsetHours(
        selectedTimezoneId.current,
        state.values.dateOfBirth,
        state.values.timeOfBirth
      )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.values.dateOfBirth, state.values.timeOfBirth]);

  // Standard time zones didn't exist everywhere before the 20th
  // century (and where they did, adoption dates vary by country) — a
  // historical birth is often more accurately read using the birth
  // place's own Local Mean Time instead of a modern civil zone offset
  // retroactively applied to it. Opt-in rather than automatic: which
  // one is "correct" depends on the era and the astrologer's own
  // convention, not something safe to guess from the date alone.
  function handleUseLocalMeanTime() {

    if (lmtOffset === null) {
      return;
    }

    setUseLmt(true);
    actions.setReadOnly("timezone", false);
    actions.setValue("timezone", lmtOffset);

  }

  function handleToggleManual() {

    const next = !isManual;

    setIsManual(next);
    setUseLmt(false);
    setIsOpen(false);
    setSuggestions([]);
    setSearchError(null);

    actions.setReadOnly("latitude", !next);
    actions.setReadOnly("longitude", !next);
    actions.setReadOnly("timezone", !next);

  }

  function handleBlur() {
    setTimeout(() => {
      setIsOpen(false);
      onBlur();
    }, 150);
  }

  const hasError = touched && Boolean(error);
  const inputId = `jp-field-${name}`;
  const helperId = `${inputId}-helper`;

  return (
    <FieldWrapper
      label={label}
      required={required}
      hasError={hasError}
      helperText={helperText}
      error={error}
      inputId={inputId}
      helperId={helperId}
    >
      <div className="jp-place-autocomplete">
        <input
          id={inputId}
          className="jp-place-autocomplete__input"
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={helperId}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(Boolean(value) && !isManual)}
        />

        {isSearching && (
          <div className="jp-place-autocomplete__status">Searching…</div>
        )}

        {isOpen && !isManual && suggestions.length > 0 && (
          <ul className="jp-place-autocomplete__suggestions">
            {suggestions.map((place, index) => (
              <li
                key={`${place.label}-${index}`}
                className="jp-place-autocomplete__suggestion"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelectPlace(place);
                }}
              >
                {place.label}
              </li>
            ))}
          </ul>
        )}

        {searchError && (
          <div className="jp-place-autocomplete__error">{searchError}</div>
        )}

        {!disabled && (
          <button
            type="button"
            className="jp-place-autocomplete__manual-toggle"
            onClick={handleToggleManual}
          >
            {isManual
              ? "↺ Use place search instead"
              : "Can't find it? Enter manually"}
          </button>
        )}

        {isManual && (
          <p className="jp-place-autocomplete__manual-hint">
            Enter the place name freely, and fill in Latitude, Longitude,
            and Time Zone Offset below yourself (e.g. from Google Maps —
            the offset is the UTC offset that actually applied on the
            birth date, e.g. 5.5 for IST).
          </p>
        )}

        {showLmtHint && (
          <p className="jp-place-autocomplete__lmt-hint">
            {useLmt ? (
              <>
                Using this place's Local Mean Time offset
                {" "}({formatOffsetHoursAsClock(lmtOffset)}) instead of the zone offset.
              </>
            ) : (
              <>
                Standard time zones didn't exist everywhere before the 20th
                century — for older births, this place's Local Mean Time
                offset ({formatOffsetHoursAsClock(lmtOffset)}) is sometimes
                more accurate than the zone offset above.{" "}
                <button
                  type="button"
                  className="jp-place-autocomplete__lmt-toggle"
                  onClick={handleUseLocalMeanTime}
                >
                  Use Local Mean Time
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </FieldWrapper>
  );
}
