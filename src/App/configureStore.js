import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import rootReducer, { defaultRootState } from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleWare));

/**
 * Returns redux store with state persisted if stored in session with Redux DevTools
 * extension and thunkMiddleware (handles async requests) included.
 *
 * @param {Object} preloadedState Optional initial state to merge with defaults
 * @return {Object} Returns a redux store configured for the application
 */
export default function configureStore(preloadedState = {}) {
  // Normalize preloadedState to guard against null/undefined
  const safePreloadedState = preloadedState != null && typeof preloadedState === 'object'
    ? preloadedState
    : {};

  // Deep merge each slice with defaultRootState to preserve default fields
  const initialState = Object.keys(defaultRootState).reduce((acc, sliceKey) => {
    acc[sliceKey] = {
      ...defaultRootState[sliceKey],
      ...(safePreloadedState[sliceKey] || {}),
    };
    return acc;
  }, {});

  const store = createStore(rootReducer, initialState, enhancer);

  return store;
}
