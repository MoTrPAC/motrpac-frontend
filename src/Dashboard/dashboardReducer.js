import {
  TOGGLE_RELEASE,
  TOGGLE_PHASE,
  TOGGLE_PLOT,
  TOGGLE_SORT,
} from './dashboardActions';

export const defaultDashboardState = {
  release: 'internal',
  phase: 'pass1a_06',
  plot: 'tissue_name',
  sort: 'default',
};

export function DashboardReducer(state = { ...defaultDashboardState }, action) {
  switch (action.type) {
    case TOGGLE_RELEASE:
      return {
        ...state,
        release: action.release,
      };

    case TOGGLE_PHASE:
      return {
        ...state,
        phase: action.phase,
      };

    case TOGGLE_PLOT:
      return {
        ...state,
        plot: action.plot,
      };

    case TOGGLE_SORT:
      return {
        ...state,
        sort: action.sort,
      };

    default:
      return state;
  }
}

export default DashboardReducer;
