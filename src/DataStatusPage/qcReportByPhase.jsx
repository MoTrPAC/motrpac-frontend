import React from 'react';
import PropTypes from 'prop-types';
import qcReportByPhaseTabList from './sharelib/qcReportByPhaseTabList';
import QCReportByPhaseTabContent from './qcReportByPhaseTabContent';

/**
 * Renders the tabbed QC report samples by phase page
 *
 * @param {Object} phaseData QC reports data
 *
 * @returns {object} JSX representation of QC report samples by phase page
 */
function QcReportByPhase({ phaseData }) {
  // Render QC report by phase tabs
  function renderQcReportByPhaseTabs() {
    return (
      <ul className="nav nav-tabs" role="tablist">
        {qcReportByPhaseTabList.map((item, i) => {
          return (
            <li key={item.navLinkId} className="nav-item" role="presentation">
              <a
                className={`nav-link ${i === 0 && 'active'}`}
                id={item.navLinkId}
                data-toggle="pill"
                href={`#${item.navLinkHref}`}
                role="tab"
                aria-controls={item.navLinkHref}
                aria-selected="true"
              >
                {item.navLinkLabel}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  // Render QC report by phase tab panes
  function renderQcReportByPhaseTabPanes() {
    return (
      <div className="tab-content mt-4">
        {qcReportByPhaseTabList.map((item, i) => {
          return (
            <div
              key={`${item.navLinkHref}`}
              className={`tab-pane fade ${i === 0 && 'show active'}`}
              id={item.navLinkHref}
              role="tabpanel"
              aria-labelledby={item.navLinkHref}
            >
              <QCReportByPhaseTabContent
                data={phaseData}
                phases={item.phases}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="QCReportByPhase content-wrapper">
      {/* tabs for QC reports by phase */}
      {renderQcReportByPhaseTabs()}
      {/* tab panes for QC reports by phase */}
      {renderQcReportByPhaseTabPanes()}
    </div>
  );
}

QcReportByPhase.propTypes = {
  phaseData: PropTypes.object,
};

QcReportByPhase.defaultProps = {
  phaseData: {},
};

export default QcReportByPhase;
