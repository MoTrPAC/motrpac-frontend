import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleWare));

/**
 * Returns redux store with state persisted if stored in session with Redux DevTools
 * extension and thunkMiddleware (handles async requests) included.
 *
 * @return {Object} Returns a redux store configured for the application
 */
export default function configureStore() {
  const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['auth', 'search', 'browseData'],
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, enhancer);
  const persistor = persistStore(store);
  return { store, persistor };
}
