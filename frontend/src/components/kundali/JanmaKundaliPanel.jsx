import KundaliChart from "./KundaliChart";

function JanmaKundaliPanel({ chart }) {
  return (
    <section className="janma-kundali-panel kundali-panel">
      <h2 className="kundali-panel__title">జన్మ కుండలి</h2>

      {/* Empty placeholder occupying the same grid row as
          GocharaKundaliPanel's controls, so both charts below
          start at the same height regardless of Gochara's
          extra date/time/place fields. */}
      <div className="kundali-panel__controls" />

      <KundaliChart chart={chart} />
    </section>
  );
}

export default JanmaKundaliPanel;
