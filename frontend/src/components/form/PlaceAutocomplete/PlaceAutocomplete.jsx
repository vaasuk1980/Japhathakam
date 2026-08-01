import { useEffect, useRef, useState } from "react";
import useForm from "../state/useForm";
import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";
import GeocodingService from "../../../services/GeocodingService";
import resolveUtcOffsetHours from "../../../utils/timezone/resolveUtcOffsetHours";

import "./PlaceAutocomplete.css";

const SEARCH_DEBOUNCE_MS = 350;

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
    setIsOpen(false);
    setSuggestions([]);

  }

  // A place's UTC offset depends on the birth date (DST) — if the
  // date/time changes after a place was already selected, keep the
  // offset in sync rather than leaving a stale value in place.
  useEffect(() => {

    if (!selectedTimezoneId.current || isManual) {
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

  function handleToggleManual() {

    const next = !isManual;

    setIsManual(next);
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
      </div>
    </FieldWrapper>
  );
}
