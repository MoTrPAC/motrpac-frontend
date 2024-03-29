import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import StatusReportGetData from './statusReportGetData';
import StatusReportImmunoAssay from './statusReportImmunoAssay';
import QcReportByPhase from './qcReportByPhase.jsx';
import QcReportHelp from './qcReportHelp';
import DataStatusActions from './dataStatusActions';
import qcReportButtonList from './sharelib/qcReportButtonList';
import AnimatedLoadingIcon from '../lib/ui/loading';
import QcReportHelpLink from './sharelib/qcReportHelpLink';
import QcReportMetabolomics from './qcReportMetab';
import QcReportProteomics from './qcReportProt';

/**
 * Renders the data qc status page
 *
 * @param {Object} profile Redux state for user's profile
 *
 * @returns {object} JSX representation of the data qc status page
 */
export function DataStatusPage({
  qcReportView,
  qcData,
  isFetchingQcData,
  errMsg,
  qcReportViewChange,
  profile,
}) {
  // Send users to default page if they are not consortium members
  const userType = profile.user_metadata && profile.user_metadata.userType;
  if (userType === 'external') {
    return <Redirect to="/home" />;
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
                  qcReportView === item.qcReport ? 'active' : ''
                }`}
                onClick={() => qcReportViewChange(item.qcReport)}
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
    switch (qcReportView) {
      case 'phase':
        return <QcReportByPhase phaseData={qcData} />;
      case 'metabolomics':
        return (
          <>
            <QcReportMetabolomics
              qcData={qcData.metabolomics}
              qcDataRaw={qcData.metabolomicsRaw}
            />
            <QcReportHelpLink qcReportViewChange={qcReportViewChange} />
          </>
        );
      case 'proteomics':
        return (
          <>
            <QcReportProteomics
              qcData={qcData.proteomics}
              qcDataRaw={qcData.proteomicsRaw}
            />
            <QcReportHelpLink qcReportViewChange={qcReportViewChange} />
          </>
        );
      case 'rnaseq':
        return (
          <>
            <StatusReportGetData qcData={qcData.rnaSeq} />
            <QcReportHelpLink qcReportViewChange={qcReportViewChange} />
          </>
        );
      case 'rrbs':
        return (
          <>
            <StatusReportGetData qcData={qcData.rrbs} />
            <QcReportHelpLink qcReportViewChange={qcReportViewChange} />
          </>
        );
      case 'methylcapseq':
        return (
          <>
            <StatusReportGetData qcData={qcData.methylcapSeq} />
            <QcReportHelpLink qcReportViewChange={qcReportViewChange} />
          </>
        );
      case 'atacseq':
        return (
          <>
            <StatusReportGetData qcData={qcData.atacSeq} />
            <QcReportHelpLink qcReportViewChange={qcReportViewChange} />
          </>
        );
      case 'immunoassay':
        return (
          <>
            <StatusReportImmunoAssay qcData={qcData.immunoAssay} />
            <QcReportHelpLink qcReportViewChange={qcReportViewChange} />
          </>
        );
      case 'help':
        return <QcReportHelp />;
      default:
        return <QcReportByPhase phaseData={qcData} />;
    }
  }

  return (
    <div className="dataStatusPage px-3 px-md-4 mb-3 w-100">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 page-header">
        <div className="page-title">
          <h1 className="mb-0">QC Data Monitor</h1>
        </div>
        {renderButtonGroup()}
      </div>
      {isFetchingQcData && (
        <AnimatedLoadingIcon isFetching={isFetchingQcData} />
      )}
      {!isFetchingQcData && !errMsg && (
        <div className="data-qc-status-panel">{renderReport()}</div>
      )}
      {!isFetchingQcData && errMsg && (
        <div className="data-qc-status-panel">{errMsg}</div>
      )}
    </div>
  );
}

DataStatusPage.propTypes = {
  qcReportView: PropTypes.string.isRequired,
  qcData: PropTypes.shape({
    atacSeq: PropTypes.arrayOf(PropTypes.object),
    immunoAssay: PropTypes.arrayOf(PropTypes.object),
    metabolomics: PropTypes.arrayOf(PropTypes.object),
    metabolomicsRaw: PropTypes.arrayOf(PropTypes.object),
    proteomics: PropTypes.arrayOf(PropTypes.object),
    proteomicsRaw: PropTypes.arrayOf(PropTypes.object),
    rnaSeq: PropTypes.arrayOf(PropTypes.object),
    rrbs: PropTypes.arrayOf(PropTypes.object),
    methylcapSeq: PropTypes.arrayOf(PropTypes.object),
    lastModified: PropTypes.string,
  }),
  isFetchingQcData: PropTypes.bool,
  errMsg: PropTypes.string,
  qcReportViewChange: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
};

DataStatusPage.defaultProps = {
  qcData: {
    atacSeq: [],
    immunoAssay: [],
    metabolomics: [],
    metabolomicsRaw: [],
    proteomics: [],
    proteomicsRaw: [],
    rnaSeq: [],
    rrbs: [],
    methylcapSeq: [],
    lastModified: '',
  },
  isFetchingQcData: false,
  errMsg: '',
  profile: {},
};

const mapStateToProps = (state) => ({
  ...state.dataStatus,
  profile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  qcReportViewChange: (value) =>
    dispatch(DataStatusActions.qcReportViewChange(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataStatusPage);
