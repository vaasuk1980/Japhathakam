import ApplicationContainer from "./ApplicationContainer.js";

import GenerateKundaliRoute
    from "../routes/GenerateKundaliRoute.js";

import PersonRoute
    from "../routes/PersonRoute.js";

import HoroscopePdfRoute
    from "../routes/HoroscopePdfRoute.js";

import SkySnapshotRoute
    from "../routes/SkySnapshotRoute.js";

import RashiTransitSummaryRoute
    from "../routes/RashiTransitSummaryRoute.js";

export default function bootstrap(app) {

    const {

        generateKundaliController

    } = ApplicationContainer.build();

    app.use(

        "/api/kundali",

        GenerateKundaliRoute({

            generateKundaliController

        })

    );

    app.use(

        "/api/persons",

        PersonRoute()

    );

    app.use(

        "/api/persons",

        HoroscopePdfRoute()

    );

    app.use(

        "/api/sky-snapshot",

        SkySnapshotRoute()

    );

    app.use(

        "/api/rashi-transit-summary",

        RashiTransitSummaryRoute()

    );

}