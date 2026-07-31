import "./KundaliWorkspace.css";

import JanmaKundaliPanel from "./JanmaKundaliPanel";
import GocharaKundaliPanel from "./GocharaKundaliPanel";

function KundaliWorkspace({ renderLayout, birthDetails }) {

    return (

        <section className="kundali-workspace-section">

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
