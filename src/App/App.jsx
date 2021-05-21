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
import ErrorPageConnected from '../ErrorPage/error';
import SearchPageConnected from '../Search/searchPage';
import ReleasePageConnected from '../ReleasePage/releasePage';
import DataSummaryPage from '../DataSummaryPage/dataSummaryPage';
import DataAccessPageConnected from '../DataAccess/dataAccessPage';
import RelatedStudyConnected from '../RelatedStudy/relatedStudy';
import HeritageProteomicsConnected from '../RelatedStudy/heritageProteomics';
import AnnouncementsPageConnected from '../AnnouncementsPage/announcementsPage';
import CallbackConnected from '../Auth/callback';
import SidebarConnected from '../Sidebar/sidebar';
import { withTracker } from '../GoogleAnalytics/googleAnalytics';
import PrivateRoute from '../Auth/privateRoute';

const store = configureStore();

function App({ history = History }) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <div className="App container-fluid">
          <header>
            <NavbarConnected />
          </header>
          <div className="row justify-content-center">
            <SidebarConnected />
            <Switch>
              <Route
                path="/callback"
                component={withTracker(CallbackConnected)}
              />
              <Route
                path="/"
                exact
                component={withTracker(LandingPageConnected)}
              />
              <PrivateRoute
                path="/dashboard"
                component={withTracker(DashboardConnected)}
              />
              <PrivateRoute
                path="/upload"
                component={withTracker(UploadScreenConnected)}
              />
              <Route
                path="/external-links"
                component={withTracker(LinkoutPageConnected)}
              />
              <PrivateRoute
                path="/download"
                component={withTracker(DownloadPageConnected)}
              />
              <PrivateRoute
                path="/analysis/:subjectType"
                component={withTracker(AnalysisHomePageConnected)}
              />
              <PrivateRoute
                path="/methods"
                component={withTracker(MethodsConnected)}
              />
              <Route path="/team" component={withTracker(TeamPageConnected)} />
              <Route
                path="/contact"
                component={withTracker(ContactConnected)}
              />
              <Route
                path="/announcements"
                component={withTracker(AnnouncementsPageConnected)}
              />
              <Route
                path="/error"
                component={withTracker(ErrorPageConnected)}
              />
              <PrivateRoute
                path="/search"
                component={withTracker(SearchPageConnected)}
              />
              <PrivateRoute
                path="/summary"
                component={withTracker(DataSummaryPage)}
              />
              <PrivateRoute
                path="/releases"
                component={withTracker(ReleasePageConnected)}
              />
              <Route
                path="/data-access"
                component={withTracker(DataAccessPageConnected)}
              />
              <Route
                path="/related-studies"
                exact
                component={withTracker(RelatedStudyConnected)}
              />
              <Route
                path="/related-studies/heritage-proteomics"
                exact
                component={withTracker(HeritageProteomicsConnected)}
              />
            </Switch>
          </div>
        </div>
      </Router>
      <FooterConnected />
    </Provider>
  );
}

export default App;
