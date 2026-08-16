import { useEffect, useState } from "react";

import PersonService from "../../services/PersonService";
import GenerateKundaliService from "../../services/GenerateKundaliService";
import KundaliRenderEngine from "../../kundali/engines/KundaliRenderEngine";
import { useTranslation } from "../../i18n/I18nContext";

import CompareKundaliSlot from "./CompareKundaliSlot";

import "./CompareKundalis.css";

const SLOT_COUNT = 4;

function emptySlot() {
  return { personId: "", status: "empty", renderLayout: null, error: null };
}

function CompareKundalis() {

  const { t } = useTranslation();

  const [persons, setPersons] = useState([]);
  const [slots, setSlots] = useState(() =>
    Array.from({ length: SLOT_COUNT }, emptySlot)
  );

  useEffect(() => {
    PersonService.list()
      .then((list) => {
        const sorted = [...list].sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
        setPersons(sorted);
      })
      .catch(() => setPersons([]));
  }, []);

  const handleSelectPerson = (slotIndex, personId) => {

    if (!personId) {
      setSlots((previous) =>
        previous.map((slot, index) => (index === slotIndex ? emptySlot() : slot))
      );
      return;
    }

    const person = persons.find(
      (candidate) => String(candidate.id) === String(personId)
    );

    if (!person) {
      return;
    }

    setSlots((previous) =>
      previous.map((slot, index) =>
        index === slotIndex
          ? { personId, status: "loading", renderLayout: null, error: null }
          : slot
      )
    );

    GenerateKundaliService.generate(person)
      .then((response) => {

        const renderLayout = KundaliRenderEngine.render(response.kundali.janmaChart);

        // Only commit if this slot hasn't since been pointed at a
        // different person — otherwise a slow response for an earlier
        // selection could land after (and overwrite) a newer one.
        setSlots((previous) =>
          previous.map((slot, index) =>
            index === slotIndex && slot.personId === personId
              ? { personId, status: "success", renderLayout, error: null }
              : slot
          )
        );

      })
      .catch((error) => {
        setSlots((previous) =>
          previous.map((slot, index) =>
            index === slotIndex && slot.personId === personId
              ? { personId, status: "error", renderLayout: null, error: error.message }
              : slot
          )
        );
      });

  };

  return (
    <main className="page compare-kundalis-page">

      <div className="compare-kundalis__header">
        <h1 className="page-title">{t("compareKundalis.title")}</h1>
        <p className="compare-kundalis__subtitle">
          {t("compareKundalis.subtitle")}
        </p>
      </div>

      <div className="compare-kundalis__grid">
        {slots.map((slot, index) => (
          <CompareKundaliSlot
            key={index}
            persons={persons}
            slot={slot}
            onSelectPerson={(personId) => handleSelectPerson(index, personId)}
          />
        ))}
      </div>

    </main>
  );
}

export default CompareKundalis;
