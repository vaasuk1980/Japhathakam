import "./KundaliChart.css";

import KundaliCell from "./KundaliCell";

// Which outer edge of the chart each fixed grid cell sits on —
// used to place its sign/lord label outside the grid, along
// the matching border, like the paper Kundali layout.
const EDGE_BY_STHANA = {
    12: "top", 1: "top", 2: "top", 3: "top",
    9: "bottom", 8: "bottom", 7: "bottom", 6: "bottom",
    11: "left", 10: "left",
    4: "right", 5: "right"
};

function KundaliChart({ chart }) {
    if (!chart || !chart.cells) {
        return null;
    }

    const cellMap = new Map(
        chart.cells.map((cell) => [cell.sthana, cell])
    );

    const layout = [
        12, 1, 2, 3,
        11, null, null, 4,
        10, null, null, 5,
        9, 8, 7, 6
    ];

    return (
        <div className="kundali-chart">

            {layout.map((sthanaNumber, index) => {

                if (sthanaNumber === null) {
                    return (
                        <div
                            key={`center-${index}`}
                            className="kundali-center"
                        />
                    );
                }

                return (
                    <KundaliCell
                        key={sthanaNumber}
                        cell={cellMap.get(sthanaNumber)}
                        edge={EDGE_BY_STHANA[sthanaNumber]}
                    />
                );

            })}

        </div>
    );

}

export default KundaliChart;