import Card from "../Card";

import "./StatCard.css";

function StatCard({ label, value, className = "" }) {

    return (
        <Card className={`stat-card ${className}`.trim()} padding="medium" shadow="small">
            <span className="stat-card__value">{value}</span>
            <span className="stat-card__label">{label}</span>
        </Card>
    );

}

export default StatCard;
