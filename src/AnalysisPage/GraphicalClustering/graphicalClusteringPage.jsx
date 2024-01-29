import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [currentView, setCurrentView] = useState('landscape');
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
        <PageTitle
          title={`Tissue-level visualization of graphical results${
            currentView === 'mitochondria'
              ? ': MITOCHONDRIA-RELATED FEATURES ONLY'
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
                currentView === 'landscape' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'landscape')}
            >
              <span className="d-flex align-items-center">Landscape</span>
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary btn-sm ${
                currentView === 'mitochondria' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'mitochondria')}
            >
              <span className="d-flex align-items-center">Mitochondria</span>
            </button>
          </div>
        </div>
      </div>
      <div className="row graphical-clustering-container">
        {currentView === 'landscape' && (
          <LandscapeGraphicalClustering tissue={tissue} setTissue={setTissue} />
        )}
        {currentView === 'mitochondria' && (
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
        enrichments. See the{' '}
        <ExternalLink
          to="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v3"
          label="study's landscape preprint"
        />{' '}
        and the{' '}
        <ExternalLink
          to="https://motrpac.github.io/MotrpacRatTraining6mo/articles/MotrpacRatTraining6mo.html"
          label="documentation"
        />{' '}
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
        Explore the mitochondria-selected (using{' '}
        <ExternalLink
          to="https://www.broadinstitute.org/mitocarta/mitocarta30-inventory-mammalian-mitochondrial-proteins-and-pathways"
          label="MitoCarta"
        />
        ) multi-omic changes and associated pathway enrichment results over the
        training time course per tissue in adult rats. Compare responses between
        male and female rats, identify pathways affected in single or multiple
        omes' and explore what molecules drive those enrichments. To learn more,
        see the{' '}
        <ExternalLink
          to="https://www.biorxiv.org/content/10.1101/2023.01.13.523698v1"
          label="MoTrPAC mitochondrial companion preprint"
        />
        .
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
