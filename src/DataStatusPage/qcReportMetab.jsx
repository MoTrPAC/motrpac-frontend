import React from 'react';
import PropTypes from 'prop-types';
import { qcReportMetabTabs } from './sharelib/qcReportByOmicTabList';
import QcReportMetabTabContent from './qcReportMetabTabContent';

/**
 * Renders Metabolomics QC report samples with sub tabs
 *
 * @param {Array} qcData QC'd processed data
 * @param {Array} qcDataRaw QC'd raw data
 *
 * @returns {object} JSX representation of metabolomics QC report
 */
function QcReportMetabolomics({ qcData = [], qcDataRaw= [] }) {
  // Render metabolomics QC report with sub tabs
  function renderQcReportMetabTabs() {
    return (
      <ul className="nav nav-tabs" role="tablist">
        {qcReportMetabTabs.map((item, i) => {
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

  // Render metabolomics QC report with sub tab panes
  function renderQcReportMetabTabPanes() {
    return (
      <div className="tab-content mt-4">
        {qcReportMetabTabs.map((item, i) => {
          return (
            <div
              key={`${item.navLinkHref}`}
              className={`tab-pane fade ${i === 0 && 'show active'}`}
              id={item.navLinkHref}
              role="tabpanel"
              aria-labelledby={item.navLinkHref}
            >
              <QcReportMetabTabContent
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
    <div className="QCReportMetabolomics content-wrapper">
      {/* tabs for metabolomics QC reports */}
      {renderQcReportMetabTabs()}
      {/* tab panes for metabolomics QC reports */}
      {renderQcReportMetabTabPanes()}
    </div>
  );
}

QcReportMetabolomics.propTypes = {
  qcData: PropTypes.arrayOf(PropTypes.object),
  qcDataRaw: PropTypes.arrayOf(PropTypes.object),
};

export default QcReportMetabolomics;
