// Sun/Moon are never retrograde (geocentrically), and Rahu/Ketu/
// Bhumi/Mitra/Chitra are either always retrograde (the lunar nodes)
// or always mirror a parent that never retrogrades — direction only
// ever actually varies for these 5 classical planets.
const GrahasWithVariableDirection = new Set([
    "MERCURY", "VENUS", "MARS", "JUPITER", "SATURN"
]);

export default GrahasWithVariableDirection;
