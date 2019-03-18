import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import 'bootstrap';
import History from './history';
import NavbarConnected from '../Navbar/navbar';
import FooterConnected from '../Footer/footer';
import LandingPageConnected from '../LandingPage/landingPage';
import DashboardConnected from '../Dashboard/dashboard';
import UploadScreenConnected from '../UploadPage/uploadScreen';
import LinkoutPageConnected from '../LinkoutPage/linkoutPage';
import AnalysisHomePageConnected from '../AnalysisPage/analysisHomePage';
import DownloadPageConnected from '../DownloadPage/downloadPage';
import MethodsConnected from '../MethodsPage/methods';
import TeamPageConnected from '../TeamPage/teamPage';
import ContactConnected from '../ContactPage/contact';
import CallbackConnected from '../Auth/callback';
import SidebarConnected from '../Sidebar/sidebar';

const store = configureStore();

function App({ history = History }) {
  // Temp config to show/hide test interface visuals
  const urlParams = new URLSearchParams(window.location.search);
  const isAlpha = urlParams.has('version') && urlParams.get('version') === 'alpha';

  return (
    <Provider store={store}>
      <Router history={history}>
        <div className={`App container-fluid ${isAlpha ? 'test-version' : ''}`}>
          <header>
            <NavbarConnected />
          </header>
          <div className="row justify-content-center">
            <SidebarConnected />
            <Switch>
              <Route path="/callback" component={CallbackConnected} />
              <Route path="/" exact component={LandingPageConnected} />
              <Route path="/dashboard" component={DashboardConnected} />
              <Route path="/upload" component={UploadScreenConnected} />
              <Route path="/external-links" component={LinkoutPageConnected} />
              <Route path="/download" component={DownloadPageConnected} />
              <Route path="/analysis/:subjectType" component={AnalysisHomePageConnected} />
              <Route path="/methods" component={MethodsConnected} />
              <Route path="/team" component={TeamPageConnected} />
              <Route path="/contact" component={ContactConnected} />
            </Switch>
          </div>
        </div>
      </Router>
      <FooterConnected />
    </Provider>
  );
}

export default App;
