import ApplicationContainer from "./ApplicationContainer.js";

import GenerateKundaliRoute
    from "../routes/GenerateKundaliRoute.js";

import PersonRoute
    from "../routes/PersonRoute.js";

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

}