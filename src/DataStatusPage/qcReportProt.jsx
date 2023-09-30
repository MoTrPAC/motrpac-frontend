import React from 'react';
import PropTypes from 'prop-types';
import { qcReportProtTabs } from './sharelib/qcReportByOmicTabList';
import QcReportProtTabContent from './qcReportProtTabContent';

/**
 * Renders proteomics QC report samples with sub tabs
 *
 * @param {Array} qcData QC'd processed data
 * @param {Array} qcDataRaw QC'd raw data
 *
 * @returns {object} JSX representation of proteomics QC report
 */
function QcReportProteomics({ qcData, qcDataRaw }) {
  // Render proteomics QC report with sub tabs
  function renderQcReportProtTabs() {
    return (
      <ul className="nav nav-tabs" role="tablist">
        {qcReportProtTabs.map((item, i) => {
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

  // Render proteomics QC report with sub tab panes
  function renderQcReportProtTabPanes() {
    return (
      <div className="tab-content mt-4">
        {qcReportProtTabs.map((item, i) => {
          return (
            <div
              key={`${item.navLinkHref}`}
              className={`tab-pane fade ${i === 0 && 'show active'}`}
              id={item.navLinkHref}
              role="tabpanel"
              aria-labelledby={item.navLinkHref}
            >
              <QcReportProtTabContent
                qcData={qcData}
                qcDataRaw={qcDataRaw}
                qcFiles={item.qcFiles}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="QCReportProteomics content-wrapper">
      {/* tabs for proteomics QC reports */}
      {renderQcReportProtTabs()}
      {/* tab panes for proteomics QC reports */}
      {renderQcReportProtTabPanes()}
    </div>
  );
}

QcReportProteomics.propTypes = {
  qcData: PropTypes.arrayOf(PropTypes.object),
  qcDataRaw: PropTypes.arrayOf(PropTypes.object),
};

QcReportProteomics.defaultProps = {
  qcData: [],
  qcDataRaw: [],
};

export default QcReportProteomics;
