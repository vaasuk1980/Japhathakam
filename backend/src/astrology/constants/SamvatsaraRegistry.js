/**
 * The 60 Samvatsara (Telugu lunisolar year) names, Prabhava
 * (index 0) through Akshaya (index 59).
 *
 * This uses the simple, non-expunging Telugu/Andhra Chandramana
 * convention (samvatsara increments by exactly one every
 * Chaitra), NOT the North Indian Barhaspatya convention (which
 * tracks Jupiter's actual mean motion and periodically expunges
 * a name). The two conventions currently disagree by well over
 * a decade due to accumulated Barhaspatya drift — do not merge
 * or "correct" this list against a Barhaspatya-based source.
 */
const SamvatsaraRegistry = Object.freeze([
    "ప్రభవ", "విభవ", "శుక్ల", "ప్రమోదూత", "ప్రజోత్పత్తి",
    "ఆంగీరస", "శ్రీముఖ", "భావ", "యువ", "ధాత",
    "ఈశ్వర", "బహుధాన్య", "ప్రమాది", "విక్రమ", "వృష",
    "చిత్రభాను", "స్వభాను", "తారణ", "పార్థివ", "వ్యయ",
    "సర్వజిత్", "సర్వధారి", "విరోధి", "వికృతి", "ఖర",
    "నందన", "విజయ", "జయ", "మన్మథ", "దుర్ముఖి",
    "హేవిళంబి", "విళంబి", "వికారి", "శార్వరి", "ప్లవ",
    "శుభకృత్", "శోభకృత్", "క్రోధి", "విశ్వావసు", "పరాభవ",
    "ప్లవంగ", "కీలక", "సౌమ్య", "సాధారణ", "విరోధికృత్",
    "పరిధావి", "ప్రమాదీచ", "ఆనంద", "రాక్షస", "నల",
    "పింగళ", "కాళయుక్తి", "సిద్ధార్థి", "రౌద్రి", "దుర్మతి",
    "దుందుభి", "రుధిరోద్గారి", "రక్తాక్షి", "క్రోధన", "అక్షయ",
]);

export default SamvatsaraRegistry;
