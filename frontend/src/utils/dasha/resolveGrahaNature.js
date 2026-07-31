/* ==========================================================
   Looks up a Graha's Punya/Papa nature (see backend's
   PunyaPapaClassifier — computed once per Kundali from the
   Janma Lagna, identical for a Graha's Janma placement, Gochara
   transit, and now its Dasha periods too). Returns "papa",
   "punya", or "" (unclassified — no natureByGraha map available,
   or an unexpected Graha code) so callers can build their own
   `${baseClass}--${nature}` BEM modifier.
========================================================== */

export default function resolveGrahaNature(graha, natureByGraha) {

    if (!graha || !natureByGraha) {
        return "";
    }

    const nature = natureByGraha[graha];

    if (nature === "PAPA") {
        return "papa";
    }

    if (nature === "PUNYA") {
        return "punya";
    }

    return "";

}
