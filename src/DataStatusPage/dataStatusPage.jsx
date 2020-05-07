import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import StatusReportMetabolomics from './statusReportMetabolomics';
import StatusReportRNASeq from './statusReportRNASeq';
import StatusReportRRBS from './statusReportRRBS';
import StatusReportATACSeq from './statusReportATACSeq';
import DataStatusActions from './dataStatusActions';

/**
 * Renders the data qc status page
 *
 * @param {Boolean} isAuthenticated Redux state for user's authentication status
 *
 * @returns {object} JSX representation of the data qc status page
 */
export function DataStatusPage({
  isAuthenticated,
  dataStatusView,
  dataStatusViewChange,
}) {
  // Send users back to homepage if not authenticated
  if (!isAuthenticated) {
    return (<Redirect to="/" />);
  }

  // Render different tables given the button selection
  function renderView() {
    switch (dataStatusView) {
      case 'metabolomics':
        return <StatusReportMetabolomics />;
      case 'rna-seq':
        return <StatusReportRNASeq />;
      case 'rrbs':
        return <StatusReportRRBS />;
      case 'atac-seq':
        return <StatusReportATACSeq />;
      default:
        return <StatusReportMetabolomics />;
    }
  }

  return (
    <div className="col-md-9 ml-sm-auto col-lg-10 px-4 dataStatusPage">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3>Submitted Data QC Status</h3>
        </div>
        <div className="btn-toolbar">
          <div className="btn-group omics-selection" role="group" aria-label="Release button group">
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${dataStatusView === 'metabolomics' ? 'active' : ''}`}
              onClick={() => dataStatusViewChange('metabolomics')}
            >
              Metabolomics
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${dataStatusView === 'rnaseq' ? 'active' : ''}`}
              onClick={() => dataStatusViewChange('rnaseq')}
            >
              RNA-Seq
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${dataStatusView === 'rrbs' ? 'active' : ''}`}
              onClick={() => dataStatusViewChange('rrbs')}
            >
              RRBS
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${dataStatusView === 'atacseq' ? 'active' : ''}`}
              onClick={() => dataStatusViewChange('atacseq')}
            >
              ATAC-Seq
            </button>
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary ${dataStatusView === 'help' ? 'active' : ''}`}
              onClick={() => dataStatusViewChange('help')}
            >
              Help
            </button>
          </div>
        </div>
      </div>
      <div className="data-qc-status-panel">
        {renderView()}
      </div>
    </div>
  );
}

DataStatusPage.propTypes = {
  isAuthenticated: PropTypes.bool,
  dataStatusView: PropTypes.string.isRequired,
  dataStatusViewChange: PropTypes.func.isRequired,
};

DataStatusPage.defaultProps = {
  isAuthenticated: false,
};

const mapStateToProps = (state) => ({
  ...(state.dataStatus),
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  dataStatusViewChange: (value) => dispatch(DataStatusActions.dataStatusViewChange(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataStatusPage);
