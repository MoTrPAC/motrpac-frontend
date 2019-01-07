import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import 'bootstrap';
import NavbarConnected from './components/navbar';
import FooterConnected from './components/footer';
import LandingPageConnected from './components/landingPage';
import Dashboard from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import LinkoutPageConnected from './components/linkoutPage';
import AnalysisHomePageConnected from './components/analysisHomePage';
import DownloadPageConnected from './components/downloadPage';
import CallbackConnected from './components/callback';

function App({ history }) {
  return (
    <div className="App">
      <header>
        <NavbarConnected />
      </header>
      <div className="componentHolder">
        <Switch>
          <Route path="/callback" component={CallbackConnected} history={history} />
          <Route path="/" exact component={LandingPageConnected} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/upload" component={UploadScreenConnected} />
          <Route path="/external-links" component={LinkoutPageConnected} />
          <Route path="/download" component={DownloadPageConnected} />
          <Route path="/analysis/:subjectType" component={AnalysisHomePageConnected} />
        </Switch>
      </div>
      <FooterConnected history={history} />
    </div>
  );
}

App.propTypes = {
  history: PropTypes.object
};

export default withRouter(App);
