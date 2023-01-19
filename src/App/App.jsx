import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import 'bootstrap';
import History from './history';
import NavbarConnected from '../Navbar/navbar';
import FooterConnected from '../Footer/footer';
import LandingPageConnected from '../LandingPage/landingPage';
import LinkoutPageConnected from '../LinkoutPage/linkoutPage';
import AnalysisHomePageConnected from '../AnalysisPage/analysisHomePage';
import MethodsConnected from '../MethodsPage/methods';
import TeamPageConnected from '../TeamPage/teamPage';
import ContactConnected from '../ContactPage/contact';
import ErrorPageConnected from '../ErrorPage/error';
import ReleasePageConnected from '../ReleasePage/releasePage';
import DataStatusPageConnected from '../DataStatusPage/dataStatusPage';
import DataSummaryPageConnected from '../DataSummaryPage/dataSummaryPage';
import DataAccessPageConnected from '../DataAccess/dataAccessPage';
import RelatedStudyConnected from '../RelatedStudy/relatedStudy';
import HeritageProteomicsConnected from '../RelatedStudy/heritageProteomics';
import AnnouncementsPageConnected from '../AnnouncementsPage/announcementsPage';
import BrowseDataPageConnected from '../BrowseDataPage/browseDataPage';
import SearchPageConnected from '../Search/searchPage';
import GeneCentricViewConnected from '../AnalysisPage/GeneCentricViewRat/geneCentricViewPage';
import GraphicalClustering from '../AnalysisPage/GraphicalClustering/graphicalClusteringPage';
import CallbackConnected from '../Auth/callback';
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
              <Route
                path="/external-links"
                component={withTracker(LinkoutPageConnected)}
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
                path="/summary"
                component={withTracker(DataSummaryPageConnected)}
              />
              <PrivateRoute
                path="/releases"
                component={withTracker(ReleasePageConnected)}
              />
              <PrivateRoute
                path="/qc-data-monitor"
                component={withTracker(DataStatusPageConnected)}
              />
              <Route
                path="/data-download"
                component={withTracker(BrowseDataPageConnected)}
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
              <Route
                path="/search"
                component={withTracker(SearchPageConnected)}
              />
              <Route
                path="/gene-centric"
                component={withTracker(GeneCentricViewConnected)}
              />
              <Route
                path="/graphical-clustering"
                component={withTracker(GraphicalClustering)}
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
