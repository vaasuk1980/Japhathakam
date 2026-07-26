import GrahaBadge from "./GrahaBadge";

function PadaGroupView({ padaGroup }) {

    if (!padaGroup) {
        return null;
    }

    return (

        <>
            {padaGroup.grahas.map((graha) => (

                <GrahaBadge
                    key={graha.id}
                    graha={graha}
                />

            ))}
        </>

    );

}

export default PadaGroupView;
