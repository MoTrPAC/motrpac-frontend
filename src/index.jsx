import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { install } from 'ga-gtag';
import trackingId from './GoogleAnalytics/googleAnalytics';
import App from './App/App';
import configureStore from './App/configureStore';
import * as serviceWorker from './serviceWorker';
import './sass/main.scss';

install(trackingId());

const store = configureStore();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
