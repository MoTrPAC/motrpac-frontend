import React from 'react';
import PropTypes from 'prop-types';
import MitoGraphicalAnalysisHeart from './Pass1bMitoTissues/HEART';
import MitoGraphicalAnalysisLiver from './Pass1bMitoTissues/LIVER';
import MitoGraphicalAnalysisKidney from './Pass1bMitoTissues/KIDNEY';
import MitoGraphicalAnalysisLung from './Pass1bMitoTissues/LUNG';
import MitoGraphicalAnalysisSpleen from './Pass1bMitoTissues/SPLEEN';
import MitoGraphicalAnalysisAdrenal from './Pass1bMitoTissues/ADRNL';
import MitoGraphicalAnalysisBlood from './Pass1bMitoTissues/BLOOD';
import MitoGraphicalAnalysisBrownAdipose from './Pass1bMitoTissues/BAT';
import MitoGraphicalAnalysisColon from './Pass1bMitoTissues/COLON';
import MitoGraphicalAnalysisGastrocnemius from './Pass1bMitoTissues/SKM_GN';
import MitoGraphicalAnalysisSmallIntestine from './Pass1bMitoTissues/SMLINT';
import MitoGraphicalAnalysisVastusLateralis from './Pass1bMitoTissues/SKM_VL';
import MitoGraphicalAnalysisWhiteAdipose from './Pass1bMitoTissues/WAT_SC';

function Pass1bMitochondriaGraphicalReport({ tissue = 'HEART' }) {
  switch (tissue) {
    case 'ADRNL':
      return <MitoGraphicalAnalysisAdrenal />;
    case 'BLOOD':
      return <MitoGraphicalAnalysisBlood />;
    case 'BAT':
      return <MitoGraphicalAnalysisBrownAdipose />;
    case 'COLON':
      return <MitoGraphicalAnalysisColon />;
    case 'SKM_GN':
      return <MitoGraphicalAnalysisGastrocnemius />;
    case 'HEART':
      return <MitoGraphicalAnalysisHeart />;
    case 'KIDNEY':
      return <MitoGraphicalAnalysisKidney />;
    case 'LIVER':
      return <MitoGraphicalAnalysisLiver />;
    case 'LUNG':
      return <MitoGraphicalAnalysisLung />;
    case 'SMLINT':
      return <MitoGraphicalAnalysisSmallIntestine />;
    case 'SPLEEN':
      return <MitoGraphicalAnalysisSpleen />;
    case 'SKM_VL':
      return <MitoGraphicalAnalysisVastusLateralis />;
    case 'WAT_SC':
      return <MitoGraphicalAnalysisWhiteAdipose />;
    default:
      return <MitoGraphicalAnalysisHeart />;
  }
}

Pass1bMitochondriaGraphicalReport.propTypes = {
  tissue: PropTypes.string,
};

export default Pass1bMitochondriaGraphicalReport;
