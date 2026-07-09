import { useEffect } from "react";

export default function TestSwissEphemeris() {

    useEffect(() => {

        async function test() {

            try {

                const swe = await import("@swisseph/node");

                console.log("Swiss Ephemeris Module Loaded");
                console.log(swe);

            } catch (error) {

                console.error("Swiss Ephemeris Load Failed");
                console.error(error);

            }

        }

        test();

    }, []);

    return (
        <div style={{ padding: "20px" }}>
            Testing Swiss Ephemeris...
        </div>
    );
}