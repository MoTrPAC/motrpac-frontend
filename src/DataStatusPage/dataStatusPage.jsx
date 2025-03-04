import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Tooltip } from 'react-tooltip';
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

import '@styles/dataStatusPage.scss';

/**
 * Renders the data qc status page
 *
 * @param {Object} profile Redux state for user's profile
 *
 * @returns {object} JSX representation of the data qc status page
 */
export function DataStatusPage({
    qcData = {
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
  isFetchingQcData = false,
  errMsg = '',
  qcReportView,
  qcReportViewChange,
  profile,
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Send users to default page if they are not consortium members
  const userType = profile.user_metadata && profile.user_metadata.userType;
  if (userType === 'external') {
    return <Navigate to="/home" />;
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

  // Render data transfer guidelines link
  function renderDataTransferGuidelinesLink() {
    let link = '';

    switch (qcReportView) {
      case 'metabolomics':
        link = 'https://docs.google.com/document/d/13i-EQcZ0LYylhoyaTdI4vf-BgZYAbzcGU4m9GKSJCnA/edit?usp=sharing';
        break;
      case 'proteomics':
        link = 'https://docs.google.com/document/d/1U60mx7Wl0sNKsy_S72lJsRdEdB3HbuXQ86Hw7lLWV-w/edit?usp=sharing';
        break;
      default:
        link = 'https://docs.google.com/document/d/1W1b5PVp2yjam4FU2IidGagqdA7lYpkTaD_LMeaN_n_k/edit?usp=sharing';
    }
    return link;
  }

  return (
    <div className="dataStatusPage px-3 px-md-4 mb-3 w-100">
      <Helmet>
        <html lang="en" />
        <title>QC Data Monitor - MoTrPAC Data Hub</title>
      </Helmet>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4 page-header">
        <div className="page-title d-flex align-items-end">
          <h1 className="mb-0">QC Data Monitor</h1>
          {qcReportView.match(/metabolomics|proteomics|rnaseq|rrbs|methylcapseq|atacseq|immunoassay/) && (
            <>
              <a
                href={renderDataTransferGuidelinesLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="data-transfer-guidelines-link mb-0 ml-2 text-info"
                data-tooltip-id="data-transfer-guidelines-link-tooltip"
                data-tooltip-content="Data Transfer Guidelines"
                data-tooltip-place="right"
                onMouseEnter={() => setIsOpen(true)}
                onClick={() => setIsOpen(false)}
              >
                <span className="material-icons">
                  description
                </span>
              </a>
              <Tooltip
                id="data-transfer-guidelines-link-tooltip"
                defaultIsOpen={isOpen}
                globalCloseEvents={{ clickOutsideAnchor: true }}
              >
                Data Transfer Guidelines
              </Tooltip>
            </>
          )}
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

const mapStateToProps = (state) => ({
  ...state.dataStatus,
  profile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  qcReportViewChange: (value) =>
    dispatch(DataStatusActions.qcReportViewChange(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataStatusPage);
