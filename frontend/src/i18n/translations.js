/* ==========================================================
   Translation dictionaries, keyed by dotted string id. Add a
   new leaf under both "en" and "te" together — useTranslation()
   falls back to the English string (never the raw key) if a
   Telugu leaf is ever missing, so the UI never shows "dashboard.title".
========================================================== */

const en = {
    header: {
        yourLocation: "Your Location",
        language: "Language",
        toggleMenu: "Toggle menu",
        searchPlaceholder: "Search by name or place of birth…",
        searchNoResults: "No matching horoscopes.",
        searchViewAll: "View all results for \"{{query}}\"",
    },
    sidebar: {
        dashboard: "Dashboard",
        birthDetails: "Birth Details",
        horoscopeLibrary: "Horoscope Library",
        settings: "Settings",
    },
    dashboard: {
        greeting: {
            morning: "Good Morning",
            afternoon: "Good Afternoon",
            evening: "Good Evening",
        },
        quickActions: {
            newHoroscope: "New Horoscope",
            horoscopeLibrary: "Horoscope Library",
            panchangam: "Panchangam",
            muhurtham: "Muhurtham",
        },
        recent: {
            title: "Recent Horoscopes",
            viewAll: "View All",
            empty: "No saved horoscopes yet.",
            colName: "Name",
            colDob: "Date of Birth",
            colPlace: "Place of Birth",
            colOpened: "Last Opened",
        },
        today: {
            gocharaTitle: "Gochara · Today",
            gocharaKundaliTitle: "Gochara Kundali",
            panchangamTitle: "Panchangam · Today",
            searchPlaceholder: "Search for a city…",
            loading: "Loading…",
            error: "Couldn't load today's sky — try again.",
            ayanam: "Ayanam",
            samvatsaram: "Samvatsaram",
            masam: "Masam",
            tithi: "Tithi",
            vara: "Vara",
            sunrise: "Sun Rise",
            sunset: "Sun Set",
            nakshatra: "Nakshatra - Pada",
            nakshatraDuration: "Nakshatra Duration",
        },
        empty: {
            title: "No horoscopes yet",
            subtitle: "Create your first horoscope to see it appear here.",
            cta: "Create Horoscope",
        },
    },
    horoscopeLibrary: {
        title: "Horoscope Library",
        subtitle: "Browse, search, and manage all saved horoscopes.",
        newHoroscope: "New Horoscope",
        searchPlaceholder: "Search by name or place of birth…",
        stats: {
            total: "Total Horoscopes",
            addedThisMonth: "Added This Month",
            addedThisWeek: "Added This Week",
        },
        sort: {
            label: "Sort by",
            recent: "Recently Added",
            nameAsc: "Name (A–Z)",
            dob: "Date of Birth",
        },
        exportCsv: "Export CSV",
        colName: "Name",
        colDob: "Date & Time of Birth",
        colPlace: "Place of Birth",
        colCreated: "Created",
        colActions: "Actions",
        view: "View",
        delete: "Delete",
        deleteConfirm: "Delete {{name}}'s saved birth record? This cannot be undone.",
        empty: "No saved horoscopes match your search.",
        emptyAll: "No saved horoscopes yet.",
        pageOf: "Page {{current}} of {{total}}",
        previous: "Previous",
        next: "Next",
    },
};

const te = {
    header: {
        yourLocation: "మీ స్థానం",
        language: "భాష",
        toggleMenu: "మెనూ తెరవండి",
        searchPlaceholder: "పేరు లేదా జనన స్థలం ద్వారా వెతకండి…",
        searchNoResults: "సరిపోలే జాతకములు లేవు.",
        searchViewAll: "\"{{query}}\" కొరకు అన్ని ఫలితాలు చూడండి",
    },
    sidebar: {
        dashboard: "డాష్‌బోర్డ్",
        birthDetails: "జనన వివరాలు",
        horoscopeLibrary: "జాతకముల గ్రంధాలయం",
        settings: "సెట్టింగులు",
    },
    dashboard: {
        greeting: {
            morning: "శుభోదయం",
            afternoon: "శుభ మధ్యాహ్నం",
            evening: "శుభ సాయంత్రం",
        },
        quickActions: {
            newHoroscope: "కొత్త జాతకము",
            horoscopeLibrary: "జాతకముల గ్రంధాలయం",
            panchangam: "పంచాంగం",
            muhurtham: "ముహూర్తం",
        },
        recent: {
            title: "ఇటీవలి జాతకములు",
            viewAll: "అన్నీ చూడండి",
            empty: "ఇంకా సేవ్ చేసిన జాతకములు లేవు.",
            colName: "పేరు",
            colDob: "జనన తేదీ",
            colPlace: "జనన స్థలం",
            colOpened: "చివరిగా తెరిచినది",
        },
        today: {
            gocharaTitle: "గోచారం · ఈరోజు",
            gocharaKundaliTitle: "గోచార కుండలి",
            panchangamTitle: "పంచాంగం · ఈరోజు",
            searchPlaceholder: "నగరం కోసం వెతకండి…",
            loading: "లోడ్ అవుతోంది…",
            error: "ఈరోజు ఆకాశాన్ని లోడ్ చేయలేకపోయాము — మళ్ళీ ప్రయత్నించండి.",
            ayanam: "అయనం",
            samvatsaram: "సంవత్సరం",
            masam: "మాసం",
            tithi: "తిథి",
            vara: "వారం",
            sunrise: "సూర్యోదయం",
            sunset: "సూర్యాస్తమయం",
            nakshatra: "నక్షత్రం - పాదం",
            nakshatraDuration: "నక్షత్ర వ్యవధి",
        },
        empty: {
            title: "ఇంకా జాతకములు లేవు",
            subtitle: "ఇక్కడ కనిపించడానికి మీ మొదటి జాతకాన్ని సృష్టించండి.",
            cta: "జాతకం సృష్టించండి",
        },
    },
    horoscopeLibrary: {
        title: "జాతకపు గ్రంధాలయము",
        subtitle: "సేవ్ చేసిన అన్ని జాతకాలను చూడండి, వెతకండి, నిర్వహించండి.",
        newHoroscope: "కొత్త జాతకము",
        searchPlaceholder: "పేరు లేదా జనన స్థలం ద్వారా వెతకండి…",
        stats: {
            total: "మొత్తం జాతకములు",
            addedThisMonth: "ఈ నెల చేర్చినవి",
            addedThisWeek: "ఈ వారం చేర్చినవి",
        },
        sort: {
            label: "క్రమం",
            recent: "ఇటీవల చేర్చినవి",
            nameAsc: "పేరు (A–Z)",
            dob: "జనన తేదీ",
        },
        exportCsv: "CSV ఎగుమతి",
        colName: "పేరు",
        colDob: "జననం (తేదీ & సమయం)",
        colPlace: "జనన స్థలం",
        colCreated: "సృష్టించిన తేదీ",
        colActions: "చర్యలు",
        view: "చూడండి",
        delete: "తొలగించండి",
        deleteConfirm: "{{name}} జాతకాన్ని తొలగించాలా? దీన్ని వెనక్కి తీసుకోలేరు.",
        empty: "మీ శోధనకు సరిపోలే జాతకములు లేవు.",
        emptyAll: "ఇంకా సేవ్ చేసిన జాతకములు లేవు.",
        pageOf: "పేజీ {{current}} / {{total}}",
        previous: "మునుపటి",
        next: "తదుపరి",
    },
};

const translations = { en, te };

export default translations;
