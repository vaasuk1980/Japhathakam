import JanmaKundaliPanel from "./JanmaKundaliPanel";
import GocharaKundaliPanel from "./GocharaKundaliPanel";

function KundaliWorkspace({ kundaliDocument }) {
  return (
    <div className="kundali-workspace">

      <JanmaKundaliPanel
        chart={kundaliDocument?.janmaChart}
      />

      <GocharaKundaliPanel
        chart={kundaliDocument?.gocharaChart}
      />

    </div>
  );
}

export default KundaliWorkspace;