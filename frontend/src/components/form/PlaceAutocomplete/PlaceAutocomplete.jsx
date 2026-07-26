import { useMemo, useState } from "react";
import useForm from "../state/useForm";
import useField from "../state/useField";
import FieldWrapper from "../layout/FieldWrapper";
import placeLocations from "../../../data/placeLocations";

import "./PlaceAutocomplete.css";

export default function PlaceAutocomplete({
  name,
  label,
  placeholder = "Enter place of birth",
  required = false,
  helperText = "",
}) {
  const field = useField(name);
  const { actions } = useForm();

  const { value, error, touched, onChange, onBlur } = field;

  const [isOpen, setIsOpen] = useState(false);

  const normalizedQuery = (value || "").trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return placeLocations.filter((place) => {
      const text = place.label.toLowerCase();
      return normalizedQuery
        .split(" ")
        .every((segment) => text.includes(segment));
    });
  }, [normalizedQuery]);

  function handleInputChange(event) {
    onChange(event);

    const typed = event.target.value.trim().toLowerCase();
    const exactMatch = placeLocations.find(
      (place) => place.label.toLowerCase() === typed
    );

    if (exactMatch) {
      handleSelectPlace(exactMatch);
      return;
    }

    setIsOpen(true);
  }

  function handleSelectPlace(place) {
    field.setValue(place.value);
    field.setTouched(true);
    actions.setValue("latitude", place.latitude);
    actions.setValue("longitude", place.longitude);
    actions.setValue("timezone", place.timezone);
    setIsOpen(false);
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
          aria-invalid={hasError}
          aria-describedby={helperId}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(Boolean(value))}
        />

        {isOpen && suggestions.length > 0 && (
          <ul className="jp-place-autocomplete__suggestions">
            {suggestions.map((place) => (
              <li
                key={place.value}
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
      </div>
    </FieldWrapper>
  );
}
