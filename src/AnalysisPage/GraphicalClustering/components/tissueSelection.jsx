import React from 'react';
import PropTypes from 'prop-types';

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

// Tissue selection dropdown component
function TissueSelection({ tissue, toggleTissue, currentView }) {
  const tissueKeys = Object.keys(reportTissues);

  if (currentView === 'pass1b-06-mitochondria') {
    tissueKeys.splice(tissueKeys.indexOf('CORTEX'), 1);
    tissueKeys.splice(tissueKeys.indexOf('HIPPOC'), 1);
    tissueKeys.splice(tissueKeys.indexOf('HYPOTH'), 1);
    tissueKeys.splice(tissueKeys.indexOf('PLASMA'), 1);
  }

  return (
    <div className="controlPanelContainer pt-3 col-xs-12 col-sm-4 col-md-3">
      <div className="controlPanel d-flex align-items-center">
        <div className="controlLabel mr-2 font-weight-bold">Tissue:</div>
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
                  onClick={toggleTissue.bind(this, key)}
                >
                  {reportTissues[key]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

TissueSelection.propTypes = {
  tissue: PropTypes.string.isRequired,
  toggleTissue: PropTypes.func.isRequired,
  currentView: PropTypes.string.isRequired,
};

export default TissueSelection;
