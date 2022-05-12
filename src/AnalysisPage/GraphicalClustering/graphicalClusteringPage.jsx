import React, { useRef, useState } from 'react';
import IframeResizer from 'iframe-resizer-react';

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

export default function GraphicalClustering() {
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
