import React, { useRef, useState } from 'react';
import IframeResizer from 'iframe-resizer-react';
import PageTitle from '../../lib/ui/pageTitle';

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

  return (
    <div className="graphicalClusteringPage px-3 px-md-4 mb-3">
      <PageTitle title="Graphical Clustering" />
      <div className="graphical-clustering-container">
        <div className="graphical-clustering-summary-container row mb-4">
          <div className="lead col-12">
            Examine similarities, differences, and potential time lagged
            response across tissues of 6-month old rats in endurance training.
          </div>
          <div className="graphical-clustering-content-container mt-2">
            <ReportControls tissue={tissue} toggleReport={setTissue} />
            <IframeResizer
              forwardRef={iframeRef}
              heightCalculationMethod="max"
              src={`/static-assets/graphical-analysis-reports/graphical-analysis-results_${tissue}.html`}
              style={{
                height: '72vh',
                width: '1px',
                minWidth: '1200px',
                border: 'none',
              }}
              scrolling
              sizeHeight
              sizeWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphicalClustering;

function ReportControls({ tissue, toggleReport }) {
  const tissueKeys = Object.keys(reportTissues);

  return (
    <div className="controlPanelContainer mt-3 ml-3">
      <div className="controlPanel">
        <div className="controlRow d-flex align-items-center">
          <div className="controlLabel mr-2 font-weight-bold">Tissues:</div>
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
