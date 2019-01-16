import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import rootReducer, { defaultRootState } from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleWare));

export default function configureStore() {
  return createStore(
    rootReducer,
    defaultRootState,
    enhancer,
  );
}
