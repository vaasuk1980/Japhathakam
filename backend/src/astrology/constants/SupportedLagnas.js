import Lagna from "../models/Lagna.js";

const SupportedLagnas = [

    new Lagna(
        "MESHA",
        "Mesha",
        "మేష",
        1,
        0,
        30
    ),

    new Lagna(
        "VRISHABHA",
        "Vrishabha",
        "వృషభ",
        2,
        30,
        60
    ),

    new Lagna(
        "MITHUNA",
        "Mithuna",
        "మిథున",
        3,
        60,
        90
    ),

    new Lagna(
        "KARKA",
        "Karka",
        "కర్కాటక",
        4,
        90,
        120
    ),

    new Lagna(
        "SIMHA",
        "Simha",
        "సింహ",
        5,
        120,
        150
    ),

    new Lagna(
        "KANYA",
        "Kanya",
        "కన్య",
        6,
        150,
        180
    ),

    new Lagna(
        "TULA",
        "Tula",
        "తుల",
        7,
        180,
        210
    ),

    new Lagna(
        "VRISCHIKA",
        "Vrischika",
        "వృశ్చిక",
        8,
        210,
        240
    ),

    new Lagna(
        "DHANUS",
        "Dhanus",
        "ధనుస్సు",
        9,
        240,
        270
    ),

    new Lagna(
        "MAKARA",
        "Makara",
        "మకర",
        10,
        270,
        300
    ),

    new Lagna(
        "KUMBHA",
        "Kumbha",
        "కుంభ",
        11,
        300,
        330
    ),

    new Lagna(
        "MEENA",
        "Meena",
        "మీన",
        12,
        330,
        360
    )

];

Object.freeze(
    SupportedLagnas
);

export default SupportedLagnas;