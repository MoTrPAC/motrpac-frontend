import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'bootstrap';
import NavbarConnected from './components/navbar';
import FooterConnected from './components/footer';
import LandingPageConnected from './components/landingPage';
import DashboardConnected from './components/dashboard';
import UploadScreenConnected from './components/uploadScreen';
import LinkoutPageConnected from './components/linkoutPage';
import AnalysisHomePageConnected from './components/analysisHomePage';
import DownloadPageConnected from './components/downloadPage';
import CallbackConnected from './components/callback';

function App() {
  return (
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
        </Switch>
      </div>
      <FooterConnected />
    </div>
  );
}

export default App;
