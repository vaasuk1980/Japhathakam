/* ==========================================================
   Maps the current local hour to a greeting bucket — used to
   replace the Dashboard's static title with a time-of-day
   greeting (see translations.js dashboard.greeting.*).
========================================== */

export default function getGreetingKey(now = new Date()) {

    const hour = now.getHours();

    if (hour < 12) {
        return "morning";
    }

    if (hour < 17) {
        return "afternoon";
    }

    return "evening";

}
