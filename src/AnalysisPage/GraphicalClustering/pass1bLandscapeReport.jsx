import React from 'react';
import PropTypes from 'prop-types';
import GraphicalAnalysisHeart from './Pass1bLandscapeTissues/HEART';
import GraphicalAnalysisLiver from './Pass1bLandscapeTissues/LIVER';
import GraphicalAnalysisKidney from './Pass1bLandscapeTissues/KIDNEY';
import GraphicalAnalysisLung from './Pass1bLandscapeTissues/LUNG';
import GraphicalAnalysisPlasma from './Pass1bLandscapeTissues/PLASMA';
import GraphicalAnalysisSpleen from './Pass1bLandscapeTissues/SPLEEN';
import GraphicalAnalysisAdrenal from './Pass1bLandscapeTissues/ADRNL';
import GraphicalAnalysisBlood from './Pass1bLandscapeTissues/BLOOD';
import GraphicalAnalysisBrownAdipose from './Pass1bLandscapeTissues/BAT';
import GraphicalAnalysisColon from './Pass1bLandscapeTissues/COLON';
import GraphicalAnalysisCortex from './Pass1bLandscapeTissues/CORTEX';
import GraphicalAnalysisGastrocnemius from './Pass1bLandscapeTissues/SKM_GN';
import GraphicalAnalysisHippocampus from './Pass1bLandscapeTissues/HIPPOC';
import GraphicalAnalysisHypothalamus from './Pass1bLandscapeTissues/HYPOTH';
import GraphicalAnalysisSmallIntestine from './Pass1bLandscapeTissues/SMLINT';
import GraphicalAnalysisVastusLateralis from './Pass1bLandscapeTissues/SKM_VL';
import GraphicalAnalysisWhiteAdipose from './Pass1bLandscapeTissues/WAT_SC';

function Pass1bLandscapeGraphicalReport({ tissue = 'SKM_GN' }) {
  switch (tissue) {
    case 'ADRNL':
      return <GraphicalAnalysisAdrenal />;
    case 'BLOOD':
      return <GraphicalAnalysisBlood />;
    case 'BAT':
      return <GraphicalAnalysisBrownAdipose />;
    case 'COLON':
      return <GraphicalAnalysisColon />;
    case 'CORTEX':
      return <GraphicalAnalysisCortex />;
    case 'SKM_GN':
      return <GraphicalAnalysisGastrocnemius />;
    case 'HEART':
      return <GraphicalAnalysisHeart />;
    case 'HIPPOC':
      return <GraphicalAnalysisHippocampus />;
    case 'HYPOTH':
      return <GraphicalAnalysisHypothalamus />;
    case 'KIDNEY':
      return <GraphicalAnalysisKidney />;
    case 'LIVER':
      return <GraphicalAnalysisLiver />;
    case 'LUNG':
      return <GraphicalAnalysisLung />;
    case 'PLASMA':
      return <GraphicalAnalysisPlasma />;
    case 'SMLINT':
      return <GraphicalAnalysisSmallIntestine />;
    case 'SPLEEN':
      return <GraphicalAnalysisSpleen />;
    case 'SKM_VL':
      return <GraphicalAnalysisVastusLateralis />;
    case 'WAT_SC':
      return <GraphicalAnalysisWhiteAdipose />;
    default:
      return <GraphicalAnalysisGastrocnemius />;
  }
}

Pass1bLandscapeGraphicalReport.propTypes = {
  tissue: PropTypes.string,
};

export default Pass1bLandscapeGraphicalReport;
