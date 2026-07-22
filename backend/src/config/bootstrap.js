import ApplicationContainer from "./ApplicationContainer.js";

import GenerateKundaliRoute
    from "../routes/GenerateKundaliRoute.js";

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

}