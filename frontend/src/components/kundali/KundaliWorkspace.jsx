import "./KundaliWorkspace.css";

import JanmaKundaliPanel from "./JanmaKundaliPanel";
import GocharaKundaliPanel from "./GocharaKundaliPanel";

function KundaliWorkspace({ renderLayout, birthDetails }) {

    return (

        <div className="kundali-workspace">

            <JanmaKundaliPanel
                chart={renderLayout}
            />

            <GocharaKundaliPanel
                birthDetails={birthDetails}
            />

        </div>

    );

}

export default KundaliWorkspace;
