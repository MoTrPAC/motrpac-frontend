import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
        <div className="d-flex justify-content-between">
          <h4>Data Types</h4>
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
        <ul className="mt-1 mb-1">
          <li>
            Assay-specific
            {' '}
            <Link to="/search">differential analysis</Link>
            , normalized data, quantitative results, experiment metadata
            and QA/QC reports
          </li>
          <li>
            Cross-platform merged metabolomics data tables for named metabolites
          </li>
          <li>Phenotypic data</li>
        </ul>
        <div className="collapse" id="collapseSummary">
          <p>
            <span className="font-weight-bold">Note:</span> Raw files are not
            currently available for direct download through the Data Hub portal.
            Please{' '}
            <Link to="/contact">submit your requests to our helpdesk</Link> and
            specify the relevant tissues/assays if you would like to get access
            to the raw files.
          </p>
        </div>
      </div>
    </div>
  );
}

DataTypeInfo.propTypes = {
  grid: PropTypes.string.isRequired,
};

export default DataTypeInfo;
