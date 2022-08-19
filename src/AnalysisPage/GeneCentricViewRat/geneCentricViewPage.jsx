import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    <div className="geneCentricViewPage">
      <form id="geneCentricSearchForm" name="geneCentricSearchForm">
        <div className="main-content-container">
          <div className="mt-4 mb-4">
            Search by gene symbol and examine the training response of its
            related molecules (e.g. protein phosphorylation/acetylation,
            promoter methylation, transcript) in PASS1B 6-month data.
          </div>
          <div className="es-search-ui-container d-flex align-items-center w-100">
            <div className="search-box-input-group d-flex align-items-center flex-grow-1">
              <input
                type="text"
                id="keys"
                name="keys"
                pattern="[a-zA-Z0-9]+"
                className="form-control search-input-kype flex-grow-1"
                placeholder="Enter a gene symbol (Example: SMAD3)"
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
                      geneSearchInputValue
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
            geneSearchResults.errors ? (
              <div className="alert alert-warning">
                {geneSearchResults.errors} Please modify the gene symbol and try
                again.
              </div>
            ) : null}
            {!geneSearching && geneSearchResults.result ? (
              <div className="search-results-wrapper-container row">
                <div className="search-sidebar-container col-md-3">
                  <GeneCentricSearchResultFilters
                    geneSearchParams={geneSearchParams}
                    handleGeneCentricSearch={handleGeneCentricSearch}
                    geneSearchChangeFilter={geneSearchChangeFilter}
                    geneSearchInputValue={geneSearchInputValue}
                  />
                </div>
                <div className="search-results-content-container col-md-9">
                  <GeneCentricTrainingResultsTable
                    trainingData={trainingResults}
                    timewiseData={timewiseResults}
                    geneSymbol={geneSearchParams.keys}
                  />
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
};

GeneCentricView.defaultProps = {
  geneSearchInputValue: '',
  geneSearchResults: {},
  geneSearching: false,
  genSearchError: '',
  geneSearchParams: { ...defaultGeneSearchParams },
};

const mapStateToProps = (state) => ({
  ...state.analysis,
});

const mapDispatchToProps = (dispatch) => ({
  geneSearchInputChange: (geneInputValue) =>
    dispatch(AnalysisActions.geneSearchInputChange(geneInputValue)),
  handleGeneCentricSearch: (params, geneInputValue) =>
    dispatch(AnalysisActions.handleGeneCentricSearch(params, geneInputValue)),
  geneSearchReset: () => dispatch(AnalysisActions.geneSearchReset()),
  geneSearchChangeFilter: (field, value) =>
    dispatch(AnalysisActions.geneSearchChangeFilter(field, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneCentricView);
