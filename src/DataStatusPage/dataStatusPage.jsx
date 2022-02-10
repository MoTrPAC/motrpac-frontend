import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AuthContentContainer from '../lib/ui/authContentContainer';
import StatusReportMetabolomics from './statusReportMetabolomics';
import StatusReportProteomics from './statusReportProteomics';
import StatusReportRnaSeq from './statusReportRNASeq';
import StatusReportRRBS from './statusReportRRBS';
import StatusReportAtacSeq from './statusReportATACSeq';
import StatusReportImmunoAssay from './statusReportImmunoAssay';
import DataStatusActions from './dataStatusActions';
import qcReportButtonList from './sharelib/qcReportButtonList';

/**
 * Renders the data qc status page
 *
 * @param {Object} profile Redux state for user's profile
 *
 * @returns {object} JSX representation of the data qc status page
 */
export function DataStatusPage({
  dataStatusView,
  qcData,
  isFetchingQcData,
  errMsg,
  dataStatusViewChange,
  expanded,
  profile,
}) {
  // Send users to default page if they are not consortium members
  const userType = profile.user_metadata && profile.user_metadata.userType;
  if (userType === 'external') {
    return <Redirect to="/dashboard" />;
  }

  // Render button group
  function renderButtonGroup() {
    return (
      <div className="btn-toolbar">
        <div
          className="btn-group omics-selection"
          role="group"
          aria-label="QCReport button group"
        >
          {qcReportButtonList.map((item) => {
            return (
              <button
                key={item.qcReport}
                type="button"
                className={`btn btn-sm btn-outline-primary ${
                  dataStatusView === item.qcReport ? 'active' : ''
                }`}
                onClick={() => dataStatusViewChange(item.qcReport)}
              >
                {item.buttonLabel}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Render different tables given the button selection
  function renderReport() {
    switch (dataStatusView) {
      case 'metabolomics':
        return (
          <StatusReportMetabolomics metabolomicsData={qcData.metabolomics} />
        );
      case 'proteomics':
        return <StatusReportProteomics proteomicsData={qcData.proteomics} />;
      case 'rnaseq':
        return <StatusReportRnaSeq rnaSeqData={qcData.rnaSeq} />;
      case 'rrbs':
        return <StatusReportRRBS rrbsData={qcData.rrbs} />;
      case 'atacseq':
        return <StatusReportAtacSeq atacSeqData={qcData.atacSeq} />;
      case 'immunoassay':
        return <StatusReportImmunoAssay immunoAssayData={qcData.immunoAssay} />;
      default:
        return (
          <StatusReportMetabolomics metabolomicsData={qcData.metabolomics} />
        );
    }
  }

  return (
    <AuthContentContainer classes="dataStatusPage" expanded={expanded}>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div className="page-title">
          <h3 className="mb-0">Data QC Reports</h3>
        </div>
        {renderButtonGroup()}
      </div>
      <div className="data-qc-status-panel">{renderReport()}</div>
    </AuthContentContainer>
  );
}

DataStatusPage.propTypes = {
  dataStatusView: PropTypes.string.isRequired,
  qcData: PropTypes.shape({
    atacSeq: PropTypes.arrayOf(PropTypes.object),
    immunoAssay: PropTypes.arrayOf(PropTypes.object),
    metabolomics: PropTypes.arrayOf(PropTypes.object),
    proteomics: PropTypes.arrayOf(PropTypes.object),
    rnaSeq: PropTypes.arrayOf(PropTypes.object),
    rrbs: PropTypes.arrayOf(PropTypes.object),
    lastModified: PropTypes.string,
  }),
  isFetchingQcData: PropTypes.bool,
  errMsg: PropTypes.string,
  dataStatusViewChange: PropTypes.func.isRequired,
  expanded: PropTypes.bool,
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

DataStatusPage.defaultProps = {
  qcData: {
    atacSeq: [],
    immunoAssay: [],
    metabolomics: [],
    proteomics: [],
    rnaSeq: [],
    rrbs: [],
    lastModified: '',
  },
  isFetchingQcData: false,
  errMsg: '',
  expanded: false,
  profile: {},
};

const mapStateToProps = (state) => ({
  ...state.dataStatus,
  expanded: state.sidebar.expanded,
  profile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  dataStatusViewChange: (value) =>
    dispatch(DataStatusActions.dataStatusViewChange(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataStatusPage);
