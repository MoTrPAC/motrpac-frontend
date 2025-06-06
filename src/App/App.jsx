import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import 'bootstrap';
import History from './history';
import NavbarConnected from '../Navbar/navbar';
import Footer from '../Footer/footer';
import LandingPageConnected from '../LandingPage/landingPage';
import LinkoutPage from '../LinkoutPage/linkoutPage';
import AnalysisHomePageConnected from '../AnalysisPage/analysisHomePage';
import MethodsConnected from '../MethodsPage/methods';
import TeamPage from '../TeamPage/teamPage';
import Contact from '../ContactPage/contact';
import ErrorPageConnected from '../ErrorPage/error';
import ReleasePageConnected from '../ReleasePage/releasePage';
import DataStatusPageConnected from '../DataStatusPage/dataStatusPage';
import DataSummaryPageConnected from '../DataSummaryPage/dataSummaryPage';
import DataAccessPageConnected from '../DataAccess/dataAccessPage';
import RelatedStudy from '../RelatedStudy/relatedStudy';
import HeritageProteomics from '../RelatedStudy/heritageProteomics';
import AnnouncementsPage from '../AnnouncementsPage/announcementsPage';
import BrowseDataPageConnected from '../BrowseDataPage/browseDataPage';
import SearchPageConnected from '../Search/searchPage';
import GeneCentricViewConnected from '../AnalysisPage/GeneCentricViewRat/geneCentricViewPage';
import GraphicalClustering from '../AnalysisPage/GraphicalClustering/graphicalClusteringPage';
import CodeRepositories from '../CodeRepoPage/codeRepoPage';
import ProjectOverview from '../MainStudy/overview';
import ExerciseBenefits from '../MainStudy/exerciseBenefits';
import StudyAssays from '../MainStudy/studyAssays';
import Tutorials from '../Tutorials/tutorials';
import License from '../License/licensePage';
import DataDeposition from '../DataDeposition/dataDepositionPage';
import Publications from '../Publications/publications';
import Phenotype from '../TechnicalGuides/phenotype';
import MultiOmicsWorkingGroups from '../MultiOmicsWorkingGroups/multiOmicsWorkingGroups';
import FullTableEnduranceTraining from '../Publications/Data/Animal/Phenotype/fullTableEnduranceTraining';
import SupplementalData from '../Publications/Data/Animal/Supplemental/supplementalData';
import Pass1b06PhenotypeAnimalConnected from '../AnalysisPage/pass1b06PhenotypeAnimal';
import CallbackConnected from '../Auth/callback';
import { withTracker } from '../GoogleAnalytics/googleAnalytics';
import PrivateRoute from '../Auth/privateRoute';
import ScrollToTop from '../lib/scrollToTop';
import DashboardConnected from '../Dashboard/dashboard';

const store = configureStore();

function App({ history = History }) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <ScrollToTop />
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
                component={withTracker(ProjectOverview)}
              />
              <Route
                path="/exercise-benefits"
                component={withTracker(ExerciseBenefits)}
              />
              <Route
                path="/study-assays"
                component={withTracker(StudyAssays)}
              />
              <Route path="/tutorials" component={withTracker(Tutorials)} />
              <Route path="/license" component={withTracker(License)} />
              <Route
                path="/data-deposition"
                component={withTracker(DataDeposition)}
              />
              <Route
                path="/publications"
                exact
                component={withTracker(Publications)}
              />
              <Route
                path="/technical-guides/phenotype"
                exact
                component={withTracker(Phenotype)}
              />
              <Route
                path="/publications/data/animal/phenotype/full-table-endurance-training"
                exact
                component={withTracker(FullTableEnduranceTraining)}
              />
              <Route
                path="/publications/data/supplemental"
                exact
                component={withTracker(SupplementalData)}
              />
              <PrivateRoute
                path="/analysis-phenotype"
                component={withTracker(Pass1b06PhenotypeAnimalConnected)}
              />
              <PrivateRoute
                path="/multiomics-working-groups"
                component={withTracker(MultiOmicsWorkingGroups)}
              />
              <PrivateRoute
                path="/dashboard"
                exact
                component={withTracker(DashboardConnected)}
              />
            </Switch>
          </div>
        </div>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
