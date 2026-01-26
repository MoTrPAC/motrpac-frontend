import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Callback from '../Auth/callback';
import AuthWrapper from '../Auth/AuthWrapper';
import Footer from '../Footer/footer';
import { PageTracker } from '../GoogleAnalytics/googleAnalytics.jsx';
import LandingPageConnected from '../LandingPage/landingPage';
import ScrollToTop from '../lib/scrollToTop';
import NavbarConnected from '../Navbar/navbar';
import 'bootstrap';
import History from './history';
import PropTypes from 'prop-types';

const LinkoutPage = lazy(() => import('../LinkoutPage/linkoutPage'));
const AnalysisHomePageConnected = lazy(
  () => import('../AnalysisPage/analysisHomePage'),
);
const MethodsConnected = lazy(() => import('../MethodsPage/methods'));
const TeamPage = lazy(() => import('../TeamPage/teamPage'));
const Contact = lazy(() => import('../ContactPage/contact'));
const ErrorPageConnected = lazy(() => import('../ErrorPage/error'));
const ReleasePageConnected = lazy(() => import('../ReleasePage/releasePage'));
const DataStatusPageConnected = lazy(
  () => import('../DataStatusPage/dataStatusPage'),
);
const DataSummaryPageConnected = lazy(
  () => import('../DataSummaryPage/dataSummaryPage'),
);
const DataAccessPageConnected = lazy(
  () => import('../DataAccess/dataAccessPage'),
);
const RelatedStudy = lazy(() => import('../RelatedStudy/relatedStudy'));
const HeritageProteomics = lazy(
  () => import('../RelatedStudy/heritageProteomics'),
);
const AnnouncementsPage = lazy(
  () => import('../AnnouncementsPage/announcementsPage'),
);
const BrowseDataPageConnected = lazy(
  () => import('../BrowseDataPage/browseDataPage'),
);
const SearchPageConnected = lazy(() => import('../Search/searchPage'));
const DashboardConnected = lazy(() => import('../Dashboard/dashboard'));
const GraphicalClustering = lazy(
  () => import('../AnalysisPage/GraphicalClustering/graphicalClusteringPage'),
);
const CodeRepositories = lazy(() => import('../CodeRepoPage/codeRepoPage'));
const ProjectOverview = lazy(() => import('../MainStudy/overview'));
const Tutorials = lazy(() => import('../Tutorials/tutorials'));
const Publications = lazy(() => import('../Publications/publications'));
const MultiOmicsWorkingGroups = lazy(
  () => import('../MultiOmicsWorkingGroups/multiOmicsWorkingGroups'),
);
const FullTableEnduranceTraining = lazy(
  () =>
    import('../Publications/Data/Animal/Phenotype/fullTableEnduranceTraining'),
);
const SupplementalData = lazy(
  () => import('../Publications/Data/Animal/Supplemental/supplementalData'),
);
const Pass1b06PhenotypeAnimalConnected = lazy(
  () => import('../AnalysisPage/pass1b06PhenotypeAnimal'),
);
const License = lazy(() => import('../License/licensePage'));
const DataDeposition = lazy(() => import('../DataDeposition/dataDepositionPage'));
const StudyAssays = lazy(() => import('../MainStudy/studyAssays'));
const ExerciseBenefits = lazy(() => import('../MainStudy/exerciseBenefits'));
const Phenotype = lazy(() => import('../TechnicalGuides/phenotype'));
const BiospecimenSummary = lazy(
  () => import('../DataExploration/Biospecimen/Clinical/summaryStatistics'),
);
const Citation = lazy(() => import('../Citation/citationPage'));
const Glossary = lazy(() => import('../Glossary/glossaryPage'));

function App({ history = History }) {
  return (
    <BrowserRouter history={history} future={{ v7_relativeSplatPath: true, v7_startTransitions: true }}>
      <ScrollToTop/>
      <div className="App container-fluid">
        <header>
          <NavbarConnected/>
        </header>
        <div className="row justify-content-center">
          <Suspense fallback={<div/>}>
            <Routes>
              <Route element={<PageTracker/>}>
                <Route
                  path="/callback"
                  element={<Callback />}
                />
                <Route
                  path="/"
                  exact
                  element={<LandingPageConnected/>}
                />
                <Route
                  path="/external-links"
                  element={<LinkoutPage/>}
                />
                <Route
                  path="/methods"
                  element={<MethodsConnected/>}
                />
                <Route path="/team" element={<TeamPage/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route
                  path="/announcements"
                  element={<AnnouncementsPage/>}
                />
                <Route path="/error" element={<ErrorPageConnected/>}/>
                <Route element={<AuthWrapper/>}>
                  <Route
                    path="/analysis/:subjectType"
                    element={<AnalysisHomePageConnected/>}
                  />
                  <Route
                    path="/summary"
                    element={<DataSummaryPageConnected/>}
                  />
                  <Route
                    path="/releases"
                    element={<ReleasePageConnected/>}
                  />
                  <Route
                    path="/qc-data-monitor"
                    element={<DataStatusPageConnected/>}
                  />
                  <Route
                    path="/analysis-phenotype"
                    element={<Pass1b06PhenotypeAnimalConnected/>}
                  />
                  <Route
                    path="/multiomics-working-groups"
                    element={<MultiOmicsWorkingGroups/>}
                  />
                  <Route
                    path="/dashboard"
                    exact
                    element={<DashboardConnected/>}
                  />
                  <Route
                    path="/biospecimen-summary"
                    element={<BiospecimenSummary/>}
                  />
                </Route>
                <Route
                  path="/data-download"
                  element={<BrowseDataPageConnected/>}
                />
                <Route
                  path="/data-download/file-browser/:selectedData"
                  element={<BrowseDataPageConnected/>}
                />
                <Route
                  path="/data-access"
                  element={<DataAccessPageConnected/>}
                />
                <Route
                  path="/related-studies"
                  exact
                  element={<RelatedStudy/>}
                />
                <Route
                  path="/related-studies/heritage-proteomics"
                  exact
                  element={<HeritageProteomics/>}
                />
                <Route
                  path="/search"
                  element={<SearchPageConnected/>}
                />
                <Route
                  path="/graphical-clustering"
                  element={<GraphicalClustering/>}
                />
                <Route
                  path="/code-repositories"
                  element={<CodeRepositories/>}
                />
                <Route
                  path="/project-overview"
                  element={<ProjectOverview/>}
                />
                <Route path="/tutorials" element={<Tutorials/>}/>
                <Route
                  path="/publications"
                  exact
                  element={<Publications/>}
                />
                <Route
                    path="/publications/data/supplemental"
                    exact
                    element={<SupplementalData/>}
                  />
                <Route
                  path="/publications/data/animal/phenotype/full-table-endurance-training"
                  exact
                  element={<FullTableEnduranceTraining/>}
                />
                <Route path="/license" element={<License/>}/>
                <Route path="/data-deposition" element={<DataDeposition/>}/>
                <Route path="/study-assays" element={<StudyAssays/>}/>
                <Route path="/exercise-benefits" element={<ExerciseBenefits/>}/>
                <Route path="/technical-guides/phenotype" element={<Phenotype/>}/>
                <Route path="/citation" element={<Citation/>}/>
                <Route path="/glossary" element={<Glossary/>}/>
              </Route>
            </Routes>
          </Suspense>
        </div>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

App.propTypes = {
  history: PropTypes.object,
};

export default App;
