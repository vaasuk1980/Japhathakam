import ApplicationContainer from "./ApplicationContainer.js";

import GenerateKundaliRoute
    from "../routes/GenerateKundaliRoute.js";

import PersonRoute
    from "../routes/PersonRoute.js";

import SkySnapshotRoute
    from "../routes/SkySnapshotRoute.js";

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

        "/api/sky-snapshot",

        SkySnapshotRoute()

    );

}