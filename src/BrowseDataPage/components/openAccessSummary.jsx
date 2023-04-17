import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmailLink from '../../lib/ui/emailLink';
import ExternalLink from '../../lib/ui/externalLink';
import OpenAccessBundleDownloads from './openAccessBundleDownloads';

function OpenAccessBrowseDataSummary() {
  const [showMoreSummary, setShowMoreSummary] = useState(false);

  // Event handler for "Show prior releases" button
  const toggleShowMoreSummary = (e) => {
    e.preventDefault();
    setShowMoreSummary(!showMoreSummary);
  };

  return (
    <div className="browse-data-summary-container row mb-4">
      <div className="lead col-12">
        Browse and download experimental data from endurance trained (1wk, 2wks,
        4wks or 8wks) compared to untrained adult rats (6 months old). The files
        accessible and downloadable here consist of results and analyses from a
        variety of data types focusing on defining the molecular changes that
        occur with training across tissues. Files can be filtered by tissue,
        omics and assay. To learn more about this study, see the{' '}
        <ExternalLink
          to="https://www.biorxiv.org/content/10.1101/2022.09.21.508770v1"
          label="MoTrPAC Endurance Exercise Training Animal Study Landscape Preprint"
        />{' '}
        as well as the <Link to="/methods">documentation</Link> on animal study
        protocols. Also check out the{' '}
        <ExternalLink
          to="https://www.cell.com/cell/fulltext/S0092-8674(20)30691-7"
          label="first published MoTrPAC paper"
        />{' '}
        that provides more information on the entire study.
      </div>
      <div className="browse-data-summary-content col-4 col-md-4">
        <div className="bd-callout bd-callout-info">
          <h4>Data Types</h4>
          <ul className="mt-1 mb-2">
            <li>
              Assay-specific <Link to="/search">differential analysis</Link> and
              normalized data
            </li>
            <li>
              Assay-specific quantitative results, experiment metadata, and
              QA/QC reports
            </li>
            <li>
              Cross-platform merged metabolomics data tables for named
              metabolites
            </li>
            <li>Phenotypic data</li>
          </ul>
          <div className="collapse mb-2" id="collapseSummary">
            <p>
              <span className="font-weight-bold">Note:</span> Raw files are not
              currently available for direct download through the Data Hub
              portal. Please submit your requests to{' '}
              <EmailLink
                mailto="motrpac-data-requests@lists.stanford.edu"
                label="MoTrPAC Data Requests"
              />{' '}
              and specify the relevant tissues/assays if you would like to get
              access to the raw files.
            </p>
          </div>
          <div>
            <button
              className="btn btn-link btn-sm show-collapse-summary-link d-flex align-items-center"
              type="button"
              data-toggle="collapse"
              data-target="#collapseSummary"
              aria-expanded="false"
              aria-controls="collapseSummary"
              onClick={toggleShowMoreSummary}
            >
              <span>{!showMoreSummary ? 'See' : 'Hide'} additional note</span>
              <i className="material-icons">
                {!showMoreSummary ? 'expand_more' : 'expand_less'}
              </i>
            </button>
          </div>
        </div>
      </div>
      <div className="browse-data-summary-content col-8 col-md-8">
        <div className="bd-callout bd-callout-warning">
          <h4 className="bundle-data-callout-title-container d-flex align-items-center justify-content-between">
            <div className="bundle-data-callout-title">Bundled Data Sets</div>
            <div className="bundle-data-callout-show-more-button">
              <button
                type="button"
                className="btn btn-link"
                data-toggle="modal"
                data-target="#openAccessBundleDataDownloadModal"
              >
                Show more
              </button>
            </div>
          </h4>
          {/* bundle data download modal */}
          <div
            className="modal fade"
            id="openAccessBundleDataDownloadModal"
            data-backdrop="static"
            data-keyboard="false"
            tabIndex="-1"
            aria-labelledby="openAccessBundleDataDownloadModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable modal-xl">
              <div className="modal-content">
                <div className="modal-header d-flex align-items-center pb-3">
                  <div>
                    <h3
                      className="modal-title text-black"
                      id="openAccessBundleDataDownloadModalLabel"
                    >
                      Bundled Data Sets
                    </h3>
                    <p className="lead">
                      Endurance Exercise Training Young Adult Rats (6 months)
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary d-flex align-items-center modal-close-button"
                    data-dismiss="modal"
                  >
                    <span className="material-icons">close</span>
                    <span className="ml-1 button-text">Close</span>
                  </button>
                </div>
                <div className="modal-body">
                  <OpenAccessBundleDownloads sets="all" />
                </div>
              </div>
            </div>
          </div>
          <OpenAccessBundleDownloads />
        </div>
      </div>
    </div>
  );
}

export default OpenAccessBrowseDataSummary;
