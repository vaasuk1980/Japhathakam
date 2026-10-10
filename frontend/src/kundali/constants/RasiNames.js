/* Twelve Rasis (zodiac signs), Telugu + English, in order from Mesha/Aries. */

export const RASI_NAMES = [
    { tel: "మేషం", en: "Aries" },
    { tel: "వృషభం", en: "Taurus" },
    { tel: "మిథునం", en: "Gemini" },
    { tel: "కర్కాటకం", en: "Cancer" },
    { tel: "సింహం", en: "Leo" },
    { tel: "కన్య", en: "Virgo" },
    { tel: "తుల", en: "Libra" },
    { tel: "వృశ్చికం", en: "Scorpio" },
    { tel: "ధనుస్సు", en: "Sagittarius" },
    { tel: "మకరం", en: "Capricorn" },
    { tel: "కుంభం", en: "Aquarius" },
    { tel: "మీనం", en: "Pisces" },
];

export function rasiForLongitude(longitude) {
    const normalized = ((longitude % 360) + 360) % 360;
    return RASI_NAMES[Math.floor(normalized / 30)];
}

