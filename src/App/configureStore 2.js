import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import throttle from 'lodash/throttle';
import rootReducer from './reducers';
import { loadState, saveState } from './localStorage';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleWare));

/**
 * Returns redux store with state persisted if stored in session with Redux DevTools
 * extension and thunkMiddleware (handles async requests) included.
 *
 * @return {Object} Returns a redux store configured for the application
 */
export default function configureStore() {
  const persistedState = loadState(); // Gets state from localStorage
  const store = createStore(
    rootReducer,
    persistedState,
    enhancer,
  );

  // Saves state on state change to localStorage
  store.subscribe(throttle(() => {
    saveState(store.getState());
  }, 1000));

  return store;
}
