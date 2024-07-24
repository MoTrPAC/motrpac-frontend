import React from 'react';
import { createRoot } from 'react-dom/client';
import { install } from 'ga-gtag';
import trackingId from './GoogleAnalytics/googleAnalytics';
import App from './App/App';
import * as serviceWorker from './serviceWorker';
import './sass/main.scss';

install(trackingId());

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
