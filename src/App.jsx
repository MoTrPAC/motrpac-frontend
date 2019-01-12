import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import 'bootstrap';
import History from './history';
import NavbarConnected from './components/navbar';
import FooterConnected from './components/footer';
import LandingPageConnected from './components/landingPage';
import DashboardConnected from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import LinkoutPageConnected from './components/linkoutPage';
import AnalysisHomePageConnected from './components/analysisHomePage';
import DownloadPageConnected from './components/downloadPage';
import MethodsConnected from './components/methods';
import CallbackConnected from './components/callback';

const store = configureStore();

function App({ history = History }) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="App">
          <header>
            <NavbarConnected />
          </header>
          <div className="componentHolder">
            <Switch>
              <Route path="/callback" component={CallbackConnected} />
              <Route path="/" exact component={LandingPageConnected} />
              <Route path="/dashboard" component={DashboardConnected} />
              <Route path="/upload" component={UploadScreenConnected} />
              <Route path="/external-links" component={LinkoutPageConnected} />
              <Route path="/download" component={DownloadPageConnected} />
              <Route path="/analysis/:subjectType" component={AnalysisHomePageConnected} />
              <Route path="/methods" component={MethodsConnected} />
            </Switch>
          </div>
          <FooterConnected />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
