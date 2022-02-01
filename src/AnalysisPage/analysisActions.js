export const TOGGLE_WEIGHT_PLOT = 'TOGGLE_WEIGHT_PLOT';
export const TOGGLE_BODY_FAT_PLOT = 'TOGGLE_BODY_FAT_PLOT';
export const TOGGLE_VO2_PLOT = 'TOGGLE_VO2_PLOT';
export const TOGGLE_LACTATE_PLOT = 'TOGGLE_LACTATE_PLOT';

function toggleWeightPlot(weightPlot) {
  return {
    type: TOGGLE_WEIGHT_PLOT,
    weightPlot,
  };
}

function toggleBodyFatPlot(bodyFatPlot) {
  return {
    type: TOGGLE_BODY_FAT_PLOT,
    bodyFatPlot,
  };
}

function toggleVo2Plot(vo2Plot) {
  return {
    type: TOGGLE_VO2_PLOT,
    vo2Plot,
  };
}

function toggleLactatePlot(lactatePlot) {
  return {
    type: TOGGLE_LACTATE_PLOT,
    lactatePlot,
  };
}

const AnalysisActions = {
  toggleWeightPlot,
  toggleBodyFatPlot,
  toggleVo2Plot,
  toggleLactatePlot,
};

export default AnalysisActions;
