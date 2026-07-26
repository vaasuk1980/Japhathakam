import PadaGroupView from "./PadaGroupView";

function RegionView({ region }) {

    if (!region) {
        return null;
    }

    return (

        <div className="region-view">

            {region.padaGroups.map((padaGroup, index) => (

                <PadaGroupView
                    key={index}
                    padaGroup={padaGroup}
                />

            ))}

        </div>

    );

}

export default RegionView;