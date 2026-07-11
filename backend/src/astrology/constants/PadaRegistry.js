import Pada from "../models/Pada.js";
import {
    PADA_COUNT,
    PADA_SPAN
} from "./PadaConstants.js";

const PadaRegistry = Object.freeze(

    Array.from(
        { length: PADA_COUNT },
        (_, index) => new Pada(
            index + 1,
            index * PADA_SPAN,
            (index + 1) * PADA_SPAN
        )
    )

);

export default PadaRegistry;