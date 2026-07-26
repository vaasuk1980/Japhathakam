import JanmaKundaliPanel from "./JanmaKundaliPanel";
import GocharaKundaliPanel from "./GocharaKundaliPanel";

function KundaliWorkspace({ renderLayout }) {

    return (

        <div className="kundali-workspace">

            <JanmaKundaliPanel
                chart={renderLayout}
            />

            <GocharaKundaliPanel
                chart={null}
            />

        </div>

    );

}

export default KundaliWorkspace;