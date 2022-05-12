import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import rootReducer, { defaultRootState } from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleWare));

/**
 * Returns redux store with state persisted if stored in session with Redux DevTools
 * extension and thunkMiddleware (handles async requests) included.
 *
 * @return {Object} Returns a redux store configured for the application
 */
export default function configureStore() {
  const store = createStore(rootReducer, defaultRootState, enhancer);

  return store;
}
