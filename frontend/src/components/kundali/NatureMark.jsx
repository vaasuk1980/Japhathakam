/**
 * Small marker for a graha's Punya/Papa nature that does not rely on
 * colour alone: a filled circle for Punya (benefic), a diamond for
 * Papa (malefic). Renders nothing for an unclassified graha.
 */
function NatureMark({ nature }) {

    if (nature !== "punya" && nature !== "papa") {
        return null;
    }

    return <span className={`nature-mark nature-mark--${nature}`} aria-hidden="true" />;

}

export default NatureMark;
