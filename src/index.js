import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Auth from './components/auth';
import * as serviceWorker from './serviceWorker';
import './main.css';

const auth = new Auth();

render(
  <BrowserRouter>
    <App auth={auth} />
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
