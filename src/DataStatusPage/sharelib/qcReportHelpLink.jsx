import React from 'react';
import PropTypes from 'prop-types';

function QcReportHelpLink({ qcReportViewChange = null }) {
  return (
    <div className="help-page-link d-flex align-items-center mb-4">
      <span className="material-icons">help_center</span>
      <button
        type="button"
        className="btn btn-link ml-1"
        onClick={() => qcReportViewChange('help')}
      >
        See terms and definitions
      </button>
    </div>
  );
}

QcReportHelpLink.propTypes = {
  qcReportViewChange: PropTypes.func,
};

export default QcReportHelpLink;
