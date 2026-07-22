import "./KundaliChart.css";

import KundaliCell from "./KundaliCell";

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
                    />
                );

            })}

        </div>
    );

}

export default KundaliChart;