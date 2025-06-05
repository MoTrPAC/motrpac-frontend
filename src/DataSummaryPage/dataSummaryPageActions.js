export const TOGGLE_RELEASE = 'TOGGLE_RELEASE';
export const TOGGLE_PHASE = 'TOGGLE_PHASE';
export const TOGGLE_PLOT = 'TOGGLE_PLOT';
export const TOGGLE_SORT = 'TOGGLE_SORT';
export const TOGGLE_QC = 'TOGGLE_QC';

function toggleRelease(release) {
  return {
    type: TOGGLE_RELEASE,
    release,
  };
}

function togglePhase(phase) {
  return {
    type: TOGGLE_PHASE,
    phase,
  };
}

function togglePlot(plot) {
  return {
    type: TOGGLE_PLOT,
    plot,
  };
}

function toggleSort(sort) {
  return {
    type: TOGGLE_SORT,
    sort,
  };
}

function toggleQC(visible) {
  return {
    type: TOGGLE_QC,
    visible,
  };
}

const DataSummaryPageActions = {
  toggleRelease,
  togglePhase,
  togglePlot,
  toggleSort,
  toggleQC,
};

export default DataSummaryPageActions;
