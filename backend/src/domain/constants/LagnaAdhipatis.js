import LAGNAS from './Lagnas.js';
import GRAHAS from './Grahas.js';

/**
 * ============================================================
 * Lagna Adhipatis
 * ------------------------------------------------------------
 * Permanent Kala Chakra mapping between each Lagna and its
 * Adhipati Graha according to Tritha Siddhantha.
 * ============================================================
 */

const LAGNA_ADHIPATIS = Object.freeze({

    [LAGNAS.MESHA]:      GRAHAS.KUJA,
    [LAGNAS.VRISHABHA]:  GRAHAS.MITRA,
    [LAGNAS.MITHUNA]:    GRAHAS.CHITRA,
    [LAGNAS.KARKATAKA]:  GRAHAS.CHANDRA,
    [LAGNAS.SIMHA]:      GRAHAS.RAVI,
    [LAGNAS.KANYA]:      GRAHAS.BUDHA,
    [LAGNAS.TULA]:       GRAHAS.SUKRA,
    [LAGNAS.VRISCHIKA]:  GRAHAS.BHUMI,
    [LAGNAS.DHANUSSU]:   GRAHAS.KETU,
    [LAGNAS.MAKARA]:     GRAHAS.RAHU,
    [LAGNAS.KUMBHA]:     GRAHAS.SHANI,
    [LAGNAS.MEENA]:      GRAHAS.GURU

});

export default LAGNA_ADHIPATIS;