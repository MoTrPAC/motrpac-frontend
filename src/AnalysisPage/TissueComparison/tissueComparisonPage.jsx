import React, { useRef, useState } from 'react';
import IframeResizer from 'iframe-resizer-react';

const reportTissues = {
  HYPOTH: 'Hypothalamus',
  HIPPOC: 'Hippocampus',
  SKM_GN: 'Gastrocnemius',
  KIDNEY: 'Kidney',
  PLASMA: 'Blood Plasma',
  BLOOD: 'Whole Blood',
};

export default function TissueComparison() {
  const iframeRef = useRef(null);
  const [tissue, setTissue] = useState('HYPOTH');

  return (
    <div className="tissueComparisonPage">
      <div className="main-content-container">
        <ReportControls tissue={tissue} toggleReport={setTissue} />
        <IframeResizer
          forwardRef={iframeRef}
          heightCalculationMethod="max"
          src={`/static-assets/graphical-analysis-reports/graphical-analysis-results_${tissue}.html`}
          style={{
            height: '75vh',
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
  );
}

function ReportControls({ tissue, toggleReport }) {
  const tissueKeys = Object.keys(reportTissues);

  return (
    <div className="controlPanelContainer mt-3 ml-3">
      <div className="controlPanel">
        <div className="controlRow d-flex align-items-center">
          <div className="controlLabel mr-2">Tissues:</div>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-primary dropdown-toggle"
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
