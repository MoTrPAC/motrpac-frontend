import { defaultRootState } from './reducers';

/**
 * Fetches redux state from local storage
 *
 * @returns {Object} redux state dictionary
 */
export function loadState() {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState == null) {
      return defaultRootState;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    console.log(err);
    return defaultRootState;
  }
}

/**
 * Saves the currnet redux state to local storage as a JSON string
 * @param {Object} state Current redux state
 */
export function saveState(state) {
  // do not persist redux states if user logs out
  if ('auth' in state && state.auth.isAuthenticated) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (err) {
      console.log(err);
    }
  }
}
