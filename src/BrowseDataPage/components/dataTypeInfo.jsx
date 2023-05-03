import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EmailLink from '../../lib/ui/emailLink';

function DataTypeInfo({ grid }) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Event handler for "Show prior releases" button
  const toggleShowMoreSummary = (e) => {
    e.preventDefault();
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div className={`browse-data-summary-content ${grid}`}>
      <div className="bd-callout bd-callout-info">
        <h4>Data Types</h4>
        <ul className="mt-1 mb-2">
          <li>
            Assay-specific <Link to="/search">differential analysis</Link> and
            normalized data
          </li>
          <li>
            Assay-specific quantitative results, experiment metadata, and QA/QC
            reports
          </li>
          <li>
            Cross-platform merged metabolomics data tables for named metabolites
          </li>
          <li>Phenotypic data</li>
        </ul>
        <div className="collapse mb-2" id="collapseSummary">
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
            <span>{!showMoreInfo ? 'See' : 'Hide'} additional note</span>
            <i className="material-icons">
              {!showMoreInfo ? 'expand_more' : 'expand_less'}
            </i>
          </button>
        </div>
      </div>
    </div>
  );
}

DataTypeInfo.propTypes = {
  grid: PropTypes.string.isRequired,
};

export default DataTypeInfo;
