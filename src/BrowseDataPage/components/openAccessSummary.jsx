import React from 'react';
import { Link } from 'react-router-dom';
import EmailLink from '../../lib/ui/emailLink';
import ExternalLink from '../../lib/ui/externalLink';
import OpenAccessBundleDownloads from './openAccessBundleDownloads';

function OpenAccessBrowseDataSummary() {
  return (
    <div className="browse-data-summary-container row mb-4">
      <div className="lead col-12">
        Browse and download the experimental data of 6-month old rats by tissue,
        assay, or omics. The files accessible and downloadable here consist of a
        variety of data types for the animal's endurance training phases
        focusing on defining molecular changes that occur in rats. To learn more
        about this study, see the{' '}
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
      <div className="browse-data-summary-content col-6 col-md-6">
        <div className="bd-callout bd-callout-info">
          <h4>Data Types</h4>
          <ul className="mt-1 mb-2">
            <li>Assay-specific differential analysis and normalized data</li>
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
          <p>
            <span className="font-weight-bold">Note:</span> Raw files are not
            currently available for direct download through the Data Hub portal.
            Please submit your requests to{' '}
            <EmailLink
              mailto="motrpac-data-requests@lists.stanford.edu"
              label="MoTrPAC Data Requests"
            />{' '}
            and specify the relevant tissues/assays if you would like to get
            access to the raw files.
          </p>
        </div>
      </div>
      <div className="browse-data-summary-content col-6 col-md-6">
        <div className="bd-callout bd-callout-warning">
          <h4>Bundled Data Sets</h4>
          <OpenAccessBundleDownloads />
        </div>
      </div>
    </div>
  );
}

export default OpenAccessBrowseDataSummary;
