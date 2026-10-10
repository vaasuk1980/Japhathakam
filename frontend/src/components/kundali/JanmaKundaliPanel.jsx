import KundaliChart from "./KundaliChart";
import formatDateDDMMYYYY from "../../utils/date/formatDateDDMMYYYY";
import { useTranslation } from "../../i18n/I18nContext";

function JanmaKundaliPanel({ chart, birthDetails }) {
  const { t } = useTranslation();
  return (
    <section className="janma-kundali-panel kundali-panel">
      <h2 className="kundali-panel__title">{t("kundali.janmaKundaliTitle")}</h2>

      {/* Empty placeholder occupying the same grid row as
          GocharaKundaliPanel's controls, so both charts below
          start at the same height regardless of Gochara's
          extra date/time/place fields. */}
      <div className="kundali-panel__controls">
        {/* Side-by-side view only (see KundaliWorkspace.css): states the
            moment this chart is cast for, filling the band the Gochara
            date/time/place fields occupy next to it. */}
        {birthDetails && (
          <div className="janma-moment no-print">
            <span className="janma-moment__label">{t("kundali.birthMoment")}</span>
            <span className="janma-moment__value">
              {formatDateDDMMYYYY(birthDetails.dateOfBirth)} · {birthDetails.timeOfBirth}
            </span>
            <span className="janma-moment__place">{birthDetails.placeOfBirth}</span>
          </div>
        )}
      </div>

      <KundaliChart chart={chart} />
    </section>
  );
}

export default JanmaKundaliPanel;
