import KundaliChart from "../../components/kundali/KundaliChart";
import { useTranslation } from "../../i18n/I18nContext";

// One independent comparison slot: a person picker plus whatever that
// slot's own chart request currently looks like (empty / loading /
// success / error) — entirely decoupled from the other three slots.
function CompareKundaliSlot({ persons, slot, onSelectPerson }) {

  const { t } = useTranslation();

  const selectedPerson = persons.find(
    (person) => String(person.id) === String(slot.personId)
  );

  return (
    <section className="compare-kundali-slot">
      <select
        className="compare-kundali-slot__select"
        value={slot.personId}
        onChange={(event) => onSelectPerson(event.target.value)}
      >
        <option value="">{t("compareKundalis.selectPlaceholder")}</option>
        {persons.map((person) => (
          <option key={person.id} value={person.id}>
            {person.firstName} {person.lastName} — {person.dateOfBirth}
          </option>
        ))}
      </select>

      {selectedPerson && (
        <h3 className="compare-kundali-slot__name">
          {selectedPerson.firstName} {selectedPerson.lastName}
        </h3>
      )}

      <div className="compare-kundali-slot__chart">
        {slot.status === "empty" && (
          <p className="compare-kundali-slot__status">
            {t("compareKundalis.empty")}
          </p>
        )}

        {slot.status === "loading" && (
          <p className="compare-kundali-slot__status">
            {t("compareKundalis.loading")}
          </p>
        )}

        {slot.status === "error" && (
          <p className="compare-kundali-slot__status compare-kundali-slot__status--error">
            {t("compareKundalis.error")}
          </p>
        )}

        {slot.status === "success" && (
          <KundaliChart chart={slot.renderLayout} />
        )}
      </div>
    </section>
  );
}

export default CompareKundaliSlot;
