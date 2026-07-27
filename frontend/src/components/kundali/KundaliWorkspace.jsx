import "./KundaliWorkspace.css";

import JanmaKundaliPanel from "./JanmaKundaliPanel";
import GocharaKundaliPanel from "./GocharaKundaliPanel";

function KundaliWorkspace({ renderLayout, birthDetails }) {

    return (

        <section className="kundali-workspace-section">

            <h2 className="kundali-workspace-title">కుండలి · Kundali</h2>

            <div className="kundali-workspace">

                <JanmaKundaliPanel
                    chart={renderLayout}
                />

                <GocharaKundaliPanel
                    birthDetails={birthDetails}
                />

            </div>

        </section>

    );

}

export default KundaliWorkspace;
