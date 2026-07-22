import KundaliChart from "./KundaliChart";

function JanmaKundaliPanel({ chart }) {
  return (
    <section className="janma-kundali-panel">
      <h2>జన్మ కుండలి</h2>

      <KundaliChart chart={chart} />
    </section>
  );
}

export default JanmaKundaliPanel;