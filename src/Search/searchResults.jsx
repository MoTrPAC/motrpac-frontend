import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchResultFilters from './searchResultFilters';
import SampleSearchResultTable from './sampleSearchResultTable';
import IconSet from '../lib/iconSet';

const searchIconMapping = {
  all: IconSet.Globe,
  assay: IconSet.Flask,
  biospecimenid: IconSet.Vial,
  gene: IconSet.DNA,
  sex: IconSet.Gender,
  site: IconSet.Clinic,
  species: IconSet.Rat,
  tissue: IconSet.Heart,
};

/**
 * Renders the search results
 *
 * @returns {object} JSX representation of search result content.
 */
function SearchResults({
  urlSearchParamsObj= {},
  lunrResutls = [],
  advSearchParams = [{ term: 'all', value: '', operator: 'and' }],
  quickSearchQueryString = '',
}) {
  const [visibleResults, setVisibleResults] = useState(50);

  if (urlSearchParamsObj && Object.keys(urlSearchParamsObj).length) {
    return (
      <div className="sample-search-results-container">
        <div className="sample-search-results">
          <SampleSearchResultTable params={urlSearchParamsObj} />
        </div>
      </div>
    );
  }

  // Render visuals for selected search term/value pairs
  const advSearchParamVisualContext = advSearchParams.map((item, idx) => {
    const termId = `term-${idx}`;
    const valueId = `value-${idx}`;
    return (
      <div key={`${termId}-${valueId}`} className="param-visual alert alert-info" role="alert">
        <div className="d-flex align-items-center">
          <img src={searchIconMapping[item.term]} alt={item.term} />
          {item.term === 'all' ? <span>{item.value ? item.value : 'All'}</span> : <span>{item.value}</span>}
        </div>
      </div>
    );
  });

  // Handle click event to download data in JSON format
  const SearchResultDownloadButton = () => {
    const dataStr = JSON.stringify(lunrResutls);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    return (
      <a
        className="search-result-download-button"
        title="Download results to JSON-formatted data"
        aria-label="Download results to JSON-formatted data"
        href={`data:${dataUri}`}
        download="Search-Results.json"
      >
        <span className="material-icons">get_app</span>
      </a>
    );
  };

  // Handle click event of "View More" button
  const toggleViewResultLength = (e) => {
    e.preventDefault();
    setVisibleResults(visibleResults === 50 ? lunrResutls.length : 50);
  };

  return (
    <div className="d-flex search-results-container">
      <div className="col-12 col-md-3 search-result-filters-container">
        <SearchResultFilters results={lunrResutls} />
      </div>
      <div className="col search-results-content-container">
        <div className="param-list-visual-context d-flex align-items-center mb-3">
          <h5>Search criteria:</h5>
          {quickSearchQueryString ? `"${decodeURIComponent(quickSearchQueryString)}"` : advSearchParamVisualContext}
        </div>
        <div className="search-results-panel">
          <div className="card mb-3">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <h5>{`Showing ${visibleResults} of ${lunrResutls.length} results`}</h5>
                <SearchResultDownloadButton />
              </div>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush search-result-list">
                {lunrResutls.slice(0, visibleResults).map(result => (
                  <li key={result.ref} className="list-group-item d-flex justify-content-between align-items-start search-result-list-item">
                    <div>
                      <h5>
                        <img src={IconSet.Rat} alt="Species" />
                        <span className="vial-label">
                          Vial:&nbsp;
                          {result.item.vial_label}
                          {/* temp suppression due to internal release
                          <a href={`/sample/${result.item.vial_label}`}>{result.item.vial_label}</a>
                          */}
                        </span>
                      </h5>
                      <p>
                        <span className="font-weight-bold">Tissue: </span>
                        <span className="metadata-value">{result.item.Tissue}</span>
                      </p>
                      <p>
                        <span className="font-weight-bold">Biospecimen ID: </span>
                        {result.item.BID}
                      </p>
                      <p>
                        <span className="font-weight-bold">Assay: </span>
                        {result.item.Assay}
                      </p>
                      <p>
                        <span className="font-weight-bold">Site: </span>
                        {result.item.GET_site}
                      </p>
                    </div>
                    <div>
                      {result.item.internal_avail
                        ? (
                          <div className="status-wrapper">
                            <span className="oi oi-loop-square dblue" />
                            <span className="status-label">Internally Available</span>
                          </div>
                        ) : null}
                      {result.item.external_avail
                        ? (
                          <div className="status-wrapper">
                            <span className="oi oi-circle-check green" />
                            <span className="status-label">Publicly Available</span>
                          </div>
                        ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="view-more-button-wrapper text-center mb-4">
          <button type="button" className="btn btn-outline-primary" onClick={toggleViewResultLength}>
            {visibleResults === 50 ? 'View More' : 'View Less'}
          </button>
        </div>
      </div>
    </div>
  );
}

SearchResults.propTypes = {
  urlSearchParamsObj: PropTypes.shape({
    action: PropTypes.string,
    tissue: PropTypes.string,
    phase: PropTypes.string,
    study: PropTypes.string,
    experiment: PropTypes.string,
    site: PropTypes.string,
  }),
  lunrResutls: PropTypes.arrayOf(PropTypes.shape({
    ref: PropTypes.string,
    item: PropTypes.object,
  })),
  advSearchParams: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
  })),
  quickSearchQueryString: PropTypes.string,
};

export default SearchResults;
