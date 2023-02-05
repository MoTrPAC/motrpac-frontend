import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PageTitle from '../../lib/ui/pageTitle';
import AnalysisActions from '../analysisActions';
import { defaultGeneSearchParams } from '../analysisReducer';
import GeneCentricTrainingResultsTable from './geneCentricTrainingResultsTable';
import GeneCentricSearchResultFilters from './geneCentricSearchResultFilters';
import AnimatedLoadingIcon from '../../lib/ui/loading';

function GeneCentricView({
  geneSearchInputValue,
  geneSearchResults,
  geneSearchParams,
  geneSearching,
  genSearchError,
  geneSearchInputChange,
  handleGeneCentricSearch,
  geneSearchReset,
  geneSearchChangeFilter,
  scope,
  enabledFilters,
}) {
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
  if (
    geneSearchResults.result &&
    Object.keys(geneSearchResults.result).length > 0
  ) {
    Object.keys(geneSearchResults.result).forEach((key) => {
      if (key.indexOf('timewise') > -1) {
        timewiseResults.push(...mapKeyToValue(geneSearchResults.result[key]));
      } else if (key.indexOf('training') > -1) {
        trainingResults.push(...mapKeyToValue(geneSearchResults.result[key]));
      }
    });
  }

  return (
    <div className="geneCentricViewPage px-3 px-md-4 mb-3">
      <form id="geneCentricSearchForm" name="geneCentricSearchForm">
        <PageTitle title="Gene-centric View" />
        <div className="gene-centric-view-container">
          <div className="gene-centric-view-summary-container row mb-4">
            <div className="lead col-12">
              Search by gene ID to examine and visualize the timewise endurance
              training response across omes' (e.g. transcript, protein, protein
              phosphorylation/acetylation and promoter methylation) for that
              gene over 8 weeks of training in adult rats.
            </div>
          </div>
          <div className="es-search-ui-container d-flex align-items-center w-100">
            <div className="search-box-input-group d-flex align-items-center flex-grow-1">
              <input
                type="text"
                id="keys"
                name="keys"
                pattern="[a-zA-Z0-9]+"
                className="form-control search-input-kype flex-grow-1"
                placeholder="Example: BRD2, SMAD3, ID1"
                value={geneSearchInputValue}
                onChange={(e) => geneSearchInputChange(e.target.value)}
              />
              <div className="search-button-group d-flex justify-content-end ml-4">
                <button
                  type="submit"
                  className="btn btn-primary search-submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGeneCentricSearch(
                      geneSearchParams,
                      geneSearchInputValue,
                      'all'
                    );
                  }}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-secondary search-reset ml-2"
                  onClick={() => geneSearchReset()}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="search-body-container mt-4 mb-2">
            {geneSearching && (
              <AnimatedLoadingIcon isFetching={geneSearching} />
            )}
            {!geneSearching && genSearchError ? (
              <div className="alert alert-danger">{genSearchError}</div>
            ) : null}
            {!geneSearching &&
            !geneSearchResults.result &&
            geneSearchResults.errors &&
            scope === 'all' ? (
              <div className="alert alert-warning">
                {geneSearchResults.errors} Please modify the gene symbol and try
                again.
              </div>
            ) : null}
            {!geneSearching &&
            (geneSearchResults.result ||
              (geneSearchResults.errors && scope === 'filters')) ? (
              <div className="search-results-wrapper-container row">
                <div className="search-sidebar-container col-md-3">
                  <GeneCentricSearchResultFilters
                    geneSearchParams={geneSearchParams}
                    handleGeneCentricSearch={handleGeneCentricSearch}
                    geneSearchChangeFilter={geneSearchChangeFilter}
                    geneSearchInputValue={geneSearchInputValue}
                    enabledFilters={enabledFilters}
                  />
                </div>
                <div className="search-results-content-container col-md-9">
                  {trainingResults.length ? (
                    <GeneCentricTrainingResultsTable
                      trainingData={trainingResults}
                      timewiseData={timewiseResults}
                      geneSymbol={geneSearchParams.keys}
                    />
                  ) : (
                    scope === 'filters' && (
                      <p className="mt-4">
                        {geneSearchResults.errors &&
                        geneSearchResults.errors.indexOf('No results found') !==
                          -1 ? (
                          <span>
                            No matches found for the selected filters. Please
                            refer to the{' '}
                            <Link to="/summary">Summary Table</Link> for data
                            that are available.
                          </span>
                        ) : (
                          geneSearchResults.errors
                        )}
                      </p>
                    )
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}

GeneCentricView.propTypes = {
  geneSearchInputValue: PropTypes.string,
  geneSearchResults: PropTypes.shape({
    result: PropTypes.object,
    total: PropTypes.number,
  }),
  geneSearching: PropTypes.bool,
  genSearchError: PropTypes.string,
  geneSearchParams: PropTypes.shape({
    ktype: PropTypes.string,
    keys: PropTypes.string,
    omics: PropTypes.string,
    filters: PropTypes.shape({
      assay: PropTypes.arrayOf(PropTypes.string),
      tissue: PropTypes.arrayOf(PropTypes.string),
    }),
    fields: PropTypes.arrayOf(PropTypes.string),
    debug: PropTypes.bool,
    save: PropTypes.bool,
  }),
  geneSearchInputChange: PropTypes.func.isRequired,
  handleGeneCentricSearch: PropTypes.func.isRequired,
  geneSearchReset: PropTypes.func.isRequired,
  geneSearchChangeFilter: PropTypes.func.isRequired,
  scope: PropTypes.string,
  enabledFilters: PropTypes.shape({
    assay: PropTypes.object,
    tissue: PropTypes.object,
  }),
};

GeneCentricView.defaultProps = {
  geneSearchInputValue: '',
  geneSearchResults: {},
  geneSearching: false,
  genSearchError: '',
  geneSearchParams: { ...defaultGeneSearchParams },
  scope: 'all',
  enabledFilters: {},
};

const mapStateToProps = (state) => ({
  ...state.analysis,
});

const mapDispatchToProps = (dispatch) => ({
  geneSearchInputChange: (geneInputValue) =>
    dispatch(AnalysisActions.geneSearchInputChange(geneInputValue)),
  handleGeneCentricSearch: (params, geneInputValue, scope) =>
    dispatch(
      AnalysisActions.handleGeneCentricSearch(params, geneInputValue, scope)
    ),
  geneSearchReset: () => dispatch(AnalysisActions.geneSearchReset()),
  geneSearchChangeFilter: (field, value) =>
    dispatch(AnalysisActions.geneSearchChangeFilter(field, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneCentricView);
