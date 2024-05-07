import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageTitle from '../../lib/ui/pageTitle';
import ExternalLink from '../../lib/ui/externalLink';
import Pass1bLandscapeGraphicalReport from './pass1bLandscapeReport';
import Pass1bMitochondriaGraphicalReport from './pass1bMitoReport';
import GraphicalClusteringIntroduction from './components/graphicalClusteringIntroduction';
import TissueSelection from './components/tissueSelection';
import { handleScroll } from './sharedLib';

function GraphicalClustering() {
  const [tissue, setTissue] = useState('SKM_GN');
  const [mitoTissue, setMitoTissue] = useState('HEART');
  const [currentView, setCurrentView] = useState('pass1b-06-landscape');
  const location = useLocation();
  const { pathname } = location;

  // Handler to set current view to either landscape or companion study
  function handleViewChange(study) {
    setCurrentView(study);
  }

  // fix toc position to the top of the page when scrolling
  if (pathname === '/graphical-clustering') {
    window.addEventListener('scroll', handleScroll);
  } else {
    window.removeEventListener('scroll', handleScroll);
  }

  return (
    <div className="graphicalClusteringPage px-3 px-md-4 mb-3 container">
      <div className="row d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center page-header">
        <Helmet>
          <html lang="en" />
          <title>Tissue-level graphical analysis results - MoTrPAC Data Hub</title>
        </Helmet>
        <PageTitle
          title={`Tissue-level visualization of graphical results${
            currentView === 'pass1b-06-mitochondria'
              ? ' (Mitochondria-related features only)'
              : ''
          }`}
        />
        <div className="btn-toolbar mb-3">
          <div
            className="btn-group"
            role="group"
            aria-label="graphical-clustering button group"
          >
            <button
              type="button"
              className={`btn btn-outline-primary btn-sm ${
                currentView === 'pass1b-06-landscape' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'pass1b-06-landscape')}
            >
              <span className="d-flex align-items-center">Landscape</span>
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary btn-sm ${
                currentView === 'pass1b-06-mitochondria' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'pass1b-06-mitochondria')}
            >
              <span className="d-flex align-items-center">Mitochondria</span>
            </button>
          </div>
        </div>
      </div>
      <div className="row graphical-clustering-container">
        {currentView === 'pass1b-06-landscape' && (
          <LandscapeGraphicalClustering tissue={tissue} setTissue={setTissue} />
        )}
        {currentView === 'pass1b-06-mitochondria' && (
          <MitoChondriaGraphicalAnalysis
            tissue={mitoTissue}
            setTissue={setMitoTissue}
          />
        )}
      </div>
    </div>
  );
}

export default GraphicalClustering;

// Landscape graphical clustering component
function LandscapeGraphicalClustering({ tissue, setTissue }) {
  return (
    <div className="graphical-clustering-summary-container row mb-2">
      <div className="lead col-12 page-summary">
        Explore multi-omic changes and associated pathway enrichment results
        over the training time course per tissue in adult rats. Compare
        responses between male and female rats, identify pathways affected in
        single or multiple omes' and explore what molecules drive those
        enrichments. See the
        {' '}
        <ExternalLink
          to="https://www.nature.com/articles/s41586-023-06877-w"
          label="main animal endurance training study"
        />
        {' '}
        and the
        {' '}
        <ExternalLink
          to="https://motrpac.github.io/MotrpacRatTraining6mo/articles/MotrpacRatTraining6mo.html"
          label="documentation"
        />
        {' '}
        to learn more.
      </div>
      <GraphicalClusteringIntroduction currentView="pass1b-06-landscape" />
      <TissueSelection
        tissue={tissue}
        toggleTissue={setTissue}
        currentView="pass1b-06-landscape"
      />
      <div className="graphical-clustering-content-container pt-3">
        <Pass1bLandscapeGraphicalReport tissue={tissue} />
      </div>
    </div>
  );
}

// Mitochondria graphical analysis component
function MitoChondriaGraphicalAnalysis({ tissue, setTissue }) {
  return (
    <div className="graphical-clustering-summary-container row mb-2">
      <div className="lead col-12 page-summary">
        Explore the mitochondria-selected (using
        {' '}
        <ExternalLink
          to="https://www.broadinstitute.org/mitocarta/mitocarta30-inventory-mammalian-mitochondrial-proteins-and-pathways"
          label="MitoCarta"
        />
        ) multi-omic changes and associated pathway enrichment results over the
        training time course per tissue in adult rats. Compare responses between
        male and female rats, identify pathways affected in single or multiple
        omes' and explore what molecules drive those enrichments. See the
        {' '}
        <ExternalLink
          to="https://doi.org/10.1016/j.cmet.2023.12.021"
          label="animal mitochondrial response study"
        />
        {' '}
        to learn more.
      </div>
      <GraphicalClusteringIntroduction currentView="pass1b-06-mitochondria" />
      <TissueSelection
        tissue={tissue}
        toggleTissue={setTissue}
        currentView="pass1b-06-mitochondria"
      />
      <div className="graphical-clustering-content-container pt-3">
        <Pass1bMitochondriaGraphicalReport tissue={tissue} />
      </div>
    </div>
  );
}
