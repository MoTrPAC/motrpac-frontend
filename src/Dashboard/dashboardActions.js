export const TOGGLE_RELEASE = 'TOGGLE_RELEASE';
export const TOGGLE_PHASE = 'TOGGLE_PHASE';
export const TOGGLE_PLOT = 'TOGGLE_PLOT';
export const TOGGLE_SORT = 'TOGGLE_SORT';

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

const DashboardActions = {
  toggleRelease,
  togglePhase,
  togglePlot,
  toggleSort,
};

export default DashboardActions;
