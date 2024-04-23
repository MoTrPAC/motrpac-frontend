import React from 'react';
import { render } from 'react-dom';
import { install } from 'ga-gtag';
import trackingId from './GoogleAnalytics/googleAnalytics';
import App from './App/App';
import * as serviceWorker from './serviceWorker';
import './sass/main.scss';

install(trackingId());

render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
