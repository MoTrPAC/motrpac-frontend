import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimewiseResultsTable from './timewiseTable';
import TrainingResultsTable from './trainingResultsTable';
import AuthContentContainer from '../lib/ui/authContentContainer';
import EmbargoExtension from '../lib/embargoExtension';
import SearchActions from './searchActions';
import SearchResultFilters from './deaSearchResultFilters';
import AnimatedLoadingIcon from '../lib/ui/loading';
import { searchParamsDefaultProps, searchParamsPropType } from './sharedlib';
import FeatureLinks from './featureLinks';

export function SearchPage({
  profile,
  expanded,
  searchResults,
  scope,
  searching,
  searchError,
  searchParams,
  changeParam,
  changeResultFilter,
  handleSearch,
  resetSearch,
}) {
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Function to map array of keys to each array of values for each row
  function mapKeyToValue(indexObj) {
    const newArray = [];
    if (indexObj && indexObj.headers && indexObj.data) {
      const keys = indexObj.headers;
      const rows = indexObj.data;
      rows.forEach((row) => {
        const newObj = {};
        row.forEach((value, index) => {
          newObj[keys[index]] = value;
        });
        newArray.push(newObj);
      });
    }

    return newArray;
  }

  const timewiseResults = [];
  const trainingResults = [];
  if (searchResults.result && Object.keys(searchResults.result).length > 0) {
    Object.keys(searchResults.result).forEach((key) => {
      if (key.indexOf('timewise') > -1) {
        timewiseResults.push(...mapKeyToValue(searchResults.result[key]));
      } else if (key.indexOf('training') > -1) {
        trainingResults.push(...mapKeyToValue(searchResults.result[key]));
      }
    });
  }

  return (
    <AuthContentContainer classes="searchPage" expanded={expanded}>
      <form id="searchForm" name="searchForm">
        {userType === 'external' && <EmbargoExtension />}
        <div className="page-header pt-3 pb-2 mb-3 border-bottom">
          <div className="page-title">
            <h3 className="mb-0">Search differential analysis data</h3>
          </div>
        </div>
        <div className="search-content-container">
          <div className="mt-4 mb-4">
            Search by genes, protein IDs, or metabolite names to examine the
            training response of its related molecules in PASS1B 6-month data
            (excluding RRBS and ATAC-seq).{' '}
            <span className="font-weight-bolder">
              Multiple search terms MUST be separated by comma and space.
              Examples: "NP_001000006.1, NP_001001508.2, NP_001005898.3" or
              "8,9-EpETrE, C18:1 LPC plasmalogen B".
            </span>
          </div>
          <div className="es-search-ui-container d-flex align-items-center w-100">
            <RadioButton changeParam={changeParam} ktype={searchParams.ktype} />
            <div className="search-box-input-group d-flex align-items-center flex-grow-1">
              <input
                type="text"
                id="keys"
                name="keys"
                className="form-control search-input-kype flex-grow-1"
                placeholder="Example: BRD2, SMAD3, ID1"
                value={searchParams.keys}
                onChange={(e) => changeParam('keys', e.target.value)}
              />
              <PrimaryOmicsFilter
                omics={searchParams.omics}
                toggleOmics={changeParam}
              />
              <div className="search-button-group d-flex justify-content-end ml-4">
                <button
                  type="submit"
                  className="btn btn-primary search-submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch(searchParams, 'all');
                  }}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-secondary search-reset ml-2"
                  onClick={() => resetSearch('all')}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {!searching &&
            !searchError &&
            !searchResults.result &&
            !searchResults.errors && <FeatureLinks />}
          <div className="search-body-container mt-4 mb-2">
            {searching && <AnimatedLoadingIcon isFetching={searching} />}
            {!searching && searchError ? (
              <div className="alert alert-danger">{searchError}</div>
            ) : null}
            {!searching &&
            !searchResults.result &&
            searchResults.errors &&
            scope === 'all' ? (
              <div className="alert alert-warning">
                {searchResults.errors} Please modify your search parameters and
                try again.
              </div>
            ) : null}
            {!searching &&
            (searchResults.result ||
              (searchResults.errors && scope === 'filters')) ? (
              <div className="search-results-wrapper-container row">
                <div className="search-sidebar-container col-md-3">
                  <SearchResultFilters
                    searchParams={searchParams}
                    changeResultFilter={changeResultFilter}
                    handleSearch={handleSearch}
                    resetSearch={resetSearch}
                  />
                </div>
                <div className="tabbed-content col-md-9">
                  {/* nav tabs */}
                  <ul className="nav nav-tabs" id="dataTab" role="tablist">
                    <li
                      className="nav-item font-weight-bold"
                      role="presentation"
                    >
                      <a
                        className="nav-link active"
                        id="timewise_dea_tab"
                        data-toggle="pill"
                        href="#timewise_dea"
                        role="tab"
                        aria-controls="timewise_dea"
                        aria-selected="true"
                      >
                        Timewise
                      </a>
                    </li>
                    <li
                      className="nav-item font-weight-bold"
                      role="presentation"
                    >
                      <a
                        className="nav-link"
                        id="training_dea_tab"
                        data-toggle="pill"
                        href="#training_dea"
                        role="tab"
                        aria-controls="training_dea"
                        aria-selected="false"
                      >
                        Training
                      </a>
                    </li>
                  </ul>
                  {/* tab panes */}
                  <div className="tab-content mt-3">
                    <div
                      className="tab-pane fade show active"
                      id="timewise_dea"
                      role="tabpanel"
                      aria-labelledby="timewise_dea_tab"
                    >
                      {timewiseResults.length ? (
                        <TimewiseResultsTable
                          timewiseData={timewiseResults}
                          searchParams={searchParams}
                          changeResultFilter={changeResultFilter}
                          handleSearch={handleSearch}
                          downloadPath={searchResults.path}
                          profile={profile}
                        />
                      ) : (
                        scope === 'filters' && (
                          <p className="mt-4">{searchResults.errors}</p>
                        )
                      )}
                    </div>
                    <div
                      className="tab-pane fade"
                      id="training_dea"
                      role="tabpanel"
                      aria-labelledby="training_dea_tab"
                    >
                      {trainingResults.length ? (
                        <TrainingResultsTable
                          trainingData={trainingResults}
                          searchParams={searchParams}
                          changeResultFilter={changeResultFilter}
                          handleSearch={handleSearch}
                          downloadPath={searchResults.path}
                          profile={profile}
                        />
                      ) : (
                        scope === 'filters' && (
                          <p className="mt-4">{searchResults.errors}</p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </AuthContentContainer>
  );
}

// Radio buttons for selecting the search context
function RadioButton({ changeParam, ktype }) {
  return (
    <div className="search-context">
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="ktype"
          id="inlineRadioGene"
          value="gene"
          checked={ktype === 'gene'}
          onChange={(e) => changeParam('ktype', e.target.value)}
        />
        <label className="form-check-label" htmlFor="inlineRadioGene">
          Gene
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="ktype"
          id="inlineRadioProtein"
          value="protein"
          checked={ktype === 'protein'}
          onChange={(e) => changeParam('ktype', e.target.value)}
        />
        <label className="form-check-label" htmlFor="inlineRadioProtein">
          Protein ID
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="ktype"
          id="inlineRadioMetab"
          value="metab"
          checked={ktype === 'metab'}
          onChange={(e) => changeParam('ktype', e.target.value)}
        />
        <label className="form-check-label" htmlFor="inlineRadioMetabolite">
          Metabolite
        </label>
      </div>
    </div>
  );
}

function PrimaryOmicsFilter({ omics, toggleOmics }) {
  const omicsDictionary = {
    all: 'All omics',
    epigenomics: 'Epigenomics',
    metabolomics: 'Metabolomics',
    proteomics: 'Proteomics',
    transcriptomics: 'Transcriptomics',
  };

  return (
    <div className="controlPanelContainer ml-2">
      <div className="controlPanel">
        <div className="controlRow">
          <div className="dropdown">
            <button
              className="btn btn-primary btn-outline-primary dropdown-toggle"
              type="button"
              id="reportViewMenu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {omicsDictionary[omics]}
            </button>
            <div
              className="dropdown-menu animate slideIn"
              aria-labelledby="reportViewMenu"
            >
              {Object.keys(omicsDictionary).map((key) => {
                return (
                  <button
                    key={key}
                    className="dropdown-item"
                    type="button"
                    onClick={toggleOmics.bind(this, 'omics', key)}
                  >
                    {omicsDictionary[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SearchPage.propTypes = {
  profile: PropTypes.shape({
    user_metadata: PropTypes.object,
  }),
  expanded: PropTypes.bool,
  searchResults: PropTypes.shape({
    data: PropTypes.object,
  }),
  scope: PropTypes.string,
  searching: PropTypes.bool,
  searchError: PropTypes.string,
  searchParams: PropTypes.shape({ ...searchParamsPropType }),
  changeParam: PropTypes.func.isRequired,
  changeResultFilter: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
};

SearchPage.defaultProps = {
  profile: {},
  expanded: true,
  searchResults: {},
  scope: 'all',
  searching: false,
  searchError: '',
  searchParams: { ...searchParamsDefaultProps },
};

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.search,
  expanded: state.sidebar.expanded,
});

const mapDispatchToProps = (dispatch) => ({
  changeParam: (field, value) =>
    dispatch(SearchActions.changeParam(field, value)),
  changeResultFilter: (field, value, bound) =>
    dispatch(SearchActions.changeResultFilter(field, value, bound)),
  handleSearch: (params, scope) =>
    dispatch(SearchActions.handleSearch(params, scope)),
  resetSearch: (scope) => dispatch(SearchActions.searchReset(scope)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
