import KundaliChart from "./KundaliChart";

function GocharaKundaliPanel({ chart }) {
  return (
    <section className="gochara-kundali-panel">
      <h2>గోచార కుండలి</h2>

      <KundaliChart chart={chart} />
    </section>
  );
}

export default GocharaKundaliPanel;