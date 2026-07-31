import { useEffect, useState } from "react";

import { useTranslation } from "../../i18n/I18nContext";

const LOCALE_BY_LANGUAGE = {
    en: "en-IN",
    te: "te-IN",
};

// Seconds are shown live, so the tick has to be every second.
const TICK_MS = 1000;

function HeaderDateTime() {

    const { language } = useTranslation();
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {

        const timer = setInterval(() => setNow(new Date()), TICK_MS);
        return () => clearInterval(timer);

    }, []);

    const locale = LOCALE_BY_LANGUAGE[language] ?? "en-IN";

    const date = now.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const time = now.toLocaleTimeString(locale, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div className="header-datetime">
            <span className="header-datetime__date">{date}</span>
            <span className="header-datetime__time">{time}</span>
        </div>
    );

}

export default HeaderDateTime;
