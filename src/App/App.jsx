import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import 'bootstrap';
import History from './history';
import NavbarConnected from '../Navbar/navbar';
import Footer from '../Footer/footer';
import CallbackConnected from '../Auth/callback';
import PrivateRoute from '../Auth/privateRoute';
import { withTracker } from '../GoogleAnalytics/googleAnalytics';
import ScrollToTop from '../lib/scrollToTop';

const LandingPageConnected = lazy(() => import('../LandingPage/landingPage'));
const BrowseDataPageConnected = lazy(() => import('../BrowseDataPage/browseDataPage'));
const SearchPageConnected = lazy(() => import('../Search/searchPage'));
const GeneCentricViewConnected = lazy(() => import('../AnalysisPage/GeneCentricViewRat/geneCentricViewPage'));
const GraphicalClustering = lazy(() => import('../AnalysisPage/GraphicalClustering/graphicalClusteringPage'));
const ReleasePageConnected = lazy(() => import('../ReleasePage/releasePage'));
const DataStatusPageConnected = lazy(() => import('../DataStatusPage/dataStatusPage'));
const DataSummaryPageConnected = lazy(() => import('../DataSummaryPage/dataSummaryPage'));
const DataAccessPageConnected = lazy(() => import('../DataAccess/dataAccessPage'));
const CodeRepositories = lazy(() => import('../CodeRepoPage/codeRepoPage'));
const MainStudyConnected = lazy(() => import('../MainStudy/mainStudy'));
const Tutorials = lazy(() => import('../Tutorials/tutorials'));
const Publications = lazy(() => import('../Publications/publications'));
const MultiOmicsWorkingGroups = lazy(() => import('../MultiOmicsWorkingGroups/multiOmicsWorkingGroups'));
const FullTableEnduranceTraining = lazy(() => import('../Publications/Data/Animal/Phenotype/fullTableEnduranceTraining'));
const ClinicalStudyProtocols = lazy(() => import('../Publications/Docs/Protocol/Clinical/clinicalStudyProtocols'));
const Pass1b06PhenotypeAnimalConnected = lazy(() => import('../AnalysisPage/pass1b06PhenotypeAnimal'));
const LinkoutPage = lazy(() => import('../LinkoutPage/linkoutPage'));
const AnalysisHomePageConnected = lazy(() => import('../AnalysisPage/analysisHomePage'));
const MethodsConnected = lazy(() => import('../MethodsPage/methods'));
const TeamPage = lazy(() => import('../TeamPage/teamPage'));
const Contact = lazy(() => import('../ContactPage/contact'));
const ErrorPageConnected = lazy(() => import('../ErrorPage/error'));
const RelatedStudy = lazy(() => import('../RelatedStudy/relatedStudy'));
const HeritageProteomics = lazy(() => import('../RelatedStudy/heritageProteomics'));
const AnnouncementsPage = lazy(() => import('../AnnouncementsPage/announcementsPage'));

const store = configureStore();

function App({ history = History }) {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <div className="App container-fluid">
          <header>
            <NavbarConnected />
          </header>
          <div className="row justify-content-center">
            <Suspense fallback={<div>Loading...</div>}>
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
                  component={withTracker(LinkoutPage)}
                />
                <PrivateRoute
                  path="/analysis/:subjectType"
                  component={withTracker(AnalysisHomePageConnected)}
                />
                <Route
                  path="/methods"
                  component={withTracker(MethodsConnected)}
                />
                <Route path="/team" component={withTracker(TeamPage)} />
                <Route path="/contact" component={withTracker(Contact)} />
                <Route
                  path="/announcements"
                  component={withTracker(AnnouncementsPage)}
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
                  exact
                  component={withTracker(BrowseDataPageConnected)}
                />
                <Route
                  path="/data-download/file-browser"
                  exact
                  component={withTracker(BrowseDataPageConnected)}
                />
                <Route
                  path="/data-access"
                  component={withTracker(DataAccessPageConnected)}
                />
                <Route
                  path="/related-studies"
                  exact
                  component={withTracker(RelatedStudy)}
                />
                <Route
                  path="/related-studies/heritage-proteomics"
                  exact
                  component={withTracker(HeritageProteomics)}
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
                <Route
                  path="/code-repositories"
                  component={withTracker(CodeRepositories)}
                />
                <Route
                  path="/project-overview"
                  component={withTracker(MainStudyConnected)}
                />
                <Route path="/tutorials" component={withTracker(Tutorials)} />
                <Route
                  path="/publications"
                  exact
                  component={withTracker(Publications)}
                />
                <Route
                  path="/publications/data/animal/phenotype/full-table-endurance-training"
                  exact
                  component={withTracker(FullTableEnduranceTraining)}
                />
                <Route
                  path="/publications/docs/protocol/clinical/study-protocols"
                  exact
                  component={withTracker(ClinicalStudyProtocols)}
                />
                <PrivateRoute
                  path="/analysis-phenotype"
                  component={withTracker(Pass1b06PhenotypeAnimalConnected)}
                />
                <PrivateRoute
                  path="/multiomics-working-groups"
                  component={withTracker(MultiOmicsWorkingGroups)}
                />
              </Switch>
            </Suspense>
          </div>
        </div>
      </Router>
      <Footer />
    </Provider>
  );
}

export default App;
