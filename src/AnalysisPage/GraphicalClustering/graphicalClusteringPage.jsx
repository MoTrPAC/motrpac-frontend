import React, { useRef, useState } from 'react';
import IframeResizer from 'iframe-resizer-react';
import ExternalLink from '../../lib/ui/externalLink';

const reportTissues = {
  ADRNL: 'Adrenal',
  BLOOD: 'Blood RNA',
  BAT: 'Brown Adipose',
  COLON: 'Colon',
  CORTEX: 'Cortex',
  SKM_GN: 'Gastrocnemius',
  HEART: 'Heart',
  HIPPOC: 'Hippocampus',
  HYPOTH: 'Hypothalamus',
  KIDNEY: 'Kidney',
  LIVER: 'Liver',
  LUNG: 'Lung',
  PLASMA: 'Plasma',
  SMLINT: 'Small Intestine',
  SPLEEN: 'Spleen',
  SKM_VL: 'Vastus Lateralis',
  WAT_SC: 'White Adipose',
};

function GraphicalClustering() {
  const iframeRef = useRef(null);
  const [tissue, setTissue] = useState('SKM_GN');
  const iframeRefMito = useRef(null);
  const [mitoTissue, setMitoTissue] = useState('HEART');
  const [currentView, setCurrentView] = useState('landscape');

  // Handler to set current view to either landscape or companion study
  function handleViewChange(study) {
    setCurrentView(study);
  }

  return (
    <div className="graphicalClusteringPage px-3 px-md-4 mb-3">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-3 page-header border-bottom">
        <div className="page-title">
          <h1 className="mb-0">Graphical Clustering</h1>
        </div>
        <div className="btn-toolbar">
          <div
            className="btn-group"
            role="group"
            aria-label="graphical-clustering button group"
          >
            <button
              type="button"
              className={`btn btn-outline-primary ${
                currentView === 'landscape' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'landscape')}
            >
              <span className="d-flex align-items-center">Landscape</span>
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary ${
                currentView === 'mitochondria' ? 'active' : ''
              }`}
              onClick={handleViewChange.bind(this, 'mitochondria')}
            >
              <span className="d-flex align-items-center">Mitochondria</span>
            </button>
          </div>
        </div>
      </div>
      <div className="graphical-clustering-container">
        {currentView === 'landscape' && (
          <LandscapeGraphicalClustering
            tissue={tissue}
            setTissue={setTissue}
            iframeRef={iframeRef}
          />
        )}
        {currentView === 'mitochondria' && (
          <MitoChondriaGraphicalAnalysis
            tissue={mitoTissue}
            setTissue={setMitoTissue}
            iframeRef={iframeRefMito}
          />
        )}
      </div>
    </div>
  );
}

export default GraphicalClustering;

// Tissue selection dropdown component
function ReportControls({ tissue, toggleReport }) {
  const tissueKeys = Object.keys(reportTissues);

  return (
    <div className="controlPanelContainer mt-3 mb-1 ml-3">
      <div className="controlPanel">
        <div className="controlRow d-flex align-items-center">
          <div className="controlLabel mr-2 font-weight-bold">
            Select a tissue:
          </div>
          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="reportViewMenu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {reportTissues[tissue]}
            </button>
            <div
              className="dropdown-menu animate slideIn"
              aria-labelledby="reportViewMenu"
            >
              {tissueKeys.map((key) => {
                return (
                  <button
                    key={key}
                    className="dropdown-item"
                    type="button"
                    onClick={toggleReport.bind(this, key)}
                  >
                    {reportTissues[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// iFrame content component
function IframeGraphicalResults({ srcPath, iframeRef }) {
  return (
    <IframeResizer
      forwardRef={iframeRef}
      heightCalculationMethod="max"
      src={srcPath}
      style={{
        height: '63vh',
        width: '1px',
        minWidth: '1200px',
        border: 'none',
      }}
      scrolling
      sizeHeight
      sizeWidth
    />
  );
}

// Landscape graphical clustering component
function LandscapeGraphicalClustering({ tissue, setTissue, iframeRef }) {
  return (
    <div className="graphical-clustering-summary-container row mb-2">
      <div className="lead col-12">
        Explore multi-omic changes and associated pathway enrichment results
        over the training time course per tissue in adult rats. Compare
        responses between male and female rats, identify pathways affected in
        single or multiple omes' and explore what molecules drive those
        enrichments. To learn more, see the{' '}
        <ExternalLink
          to="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v1"
          label="MoTrPAC Endurance Exercise Training Animal Study Landscape Preprint"
        />{' '}
        as well as the{' '}
        <ExternalLink
          to="https://motrpac.github.io/MotrpacRatTraining6mo/articles/MotrpacRatTraining6mo.html"
          label="documentation"
        />
        .
      </div>
      <div className="graphical-clustering-content-container mt-2">
        <ReportControls tissue={tissue} toggleReport={setTissue} />
        <IframeGraphicalResults
          srcPath={`/static-assets/graphical-analysis-reports/graphical-analysis-results_${tissue}.html`}
          iframeRef={iframeRef}
        />
      </div>
    </div>
  );
}

// Mitochondria graphical analysis component
function MitoChondriaGraphicalAnalysis({ tissue, setTissue, iframeRef }) {
  return (
    <div className="graphical-clustering-summary-container row mb-2">
      <div className="lead col-12">
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
      <div className="graphical-clustering-content-container mt-2">
        <ReportControls tissue={tissue} toggleReport={setTissue} />
        <IframeGraphicalResults
          srcPath={`/static-assets/mito-graphical-analysis-reports/mito-graphical-analysis-results_${tissue}.html`}
          iframeRef={iframeRef}
        />
      </div>
    </div>
  );
}
