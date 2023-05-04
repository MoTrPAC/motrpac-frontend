import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Typeahead } from 'react-bootstrap-typeahead';
import PageTitle from '../../lib/ui/pageTitle';
import AnalysisActions from '../analysisActions';
import { defaultGeneSearchParams } from '../analysisReducer';
import GeneCentricTrainingResultsTable from './geneCentricTrainingResultsTable';
import GeneCentricSearchResultFilters from './geneCentricSearchResultFilters';
import AnimatedLoadingIcon from '../../lib/ui/loading';
import { genes } from '../../data/genes';

// Import as a module in your JS
import 'react-bootstrap-typeahead/css/Typeahead.css';

function GeneCentricView({
  geneSearchResults,
  geneSearchParams,
  geneSearching,
  genSearchError,
  handleGeneCentricSearch,
  geneSearchReset,
  geneSearchChangeFilter,
  scope,
  hasResultFilters,
}) {
  const [multiSelections, setMultiSelections] = useState([]);
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

  // FIXME: Change 'keys' prop type to array so that it is not needed
  // to be converted to string
  function formatSearchInput() {
    const newArr = [];
    multiSelections.forEach((item) => newArr.push(item.id));
    return newArr.join(', ');
  }

  return (
    <div className="geneCentricViewPage px-3 px-md-4 mb-3">
      <form id="geneCentricSearchForm" name="geneCentricSearchForm">
        <PageTitle title="Gene-centric View" />
        <div className="gene-centric-view-container">
          <div className="gene-centric-view-summary-container row mb-4">
            <div className="lead col-12">
              Search by gene IDs to examine{' '}
              <span className="summary-tooltip-anchor training-definition">
                training
              </span>{' '}
              differential abundance data and visualize the{' '}
              <span className="summary-tooltip-anchor timewise-definition">
                timewise
              </span>{' '}
              endurance training response across omes' (e.g. transcript,
              protein, protein phosphorylation/acetylation and promoter
              methylation) for that gene over 8 weeks of training in adult rats.
            </div>
            <Tooltip anchorSelect=".timewise-definition" place="top">
              Per-training-time effects
            </Tooltip>
            <Tooltip anchorSelect=".training-definition" place="top">
              Select differential analytes
            </Tooltip>
          </div>
          <div className="es-search-ui-container d-flex align-items-center w-100 pb-2">
            <div className="search-box-input-group d-flex align-items-center flex-grow-1">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text material-icons">
                    pest_control_rodent
                  </span>
                </div>
                <Typeahead
                  id="basic-typeahead-multiple"
                  labelKey="id"
                  multiple
                  onChange={setMultiSelections}
                  options={genes}
                  placeholder="Example: BRD2, SMAD3, ID1"
                  selected={multiSelections}
                  minLength={2}
                />
              </div>
              <div className="search-button-group d-flex justify-content-end ml-4">
                <button
                  type="submit"
                  className="btn btn-primary search-submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGeneCentricSearch(
                      geneSearchParams,
                      formatSearchInput(),
                      'all'
                    );
                  }}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-secondary search-reset ml-2"
                  onClick={() => {
                    geneSearchReset('all');
                    setMultiSelections([]);
                  }}
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
                    geneSearchInputValue={formatSearchInput()}
                    geneSearchReset={geneSearchReset}
                    hasResultFilters={hasResultFilters}
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
  geneSearchResults: PropTypes.shape({
    result: PropTypes.object,
    total: PropTypes.number,
  }),
  geneSearching: PropTypes.bool,
  genSearchError: PropTypes.string,
  geneSearchParams: PropTypes.shape({
    ktype: PropTypes.string,
    keys: PropTypes.string,
    omics: PropTypes.arrayOf(PropTypes.string),
    filters: PropTypes.shape({
      assay: PropTypes.arrayOf(PropTypes.string),
      tissue: PropTypes.arrayOf(PropTypes.string),
    }),
    fields: PropTypes.arrayOf(PropTypes.string),
    size: PropTypes.number,
    start: PropTypes.number,
    debug: PropTypes.bool,
    save: PropTypes.bool,
  }),
  handleGeneCentricSearch: PropTypes.func.isRequired,
  geneSearchReset: PropTypes.func.isRequired,
  geneSearchChangeFilter: PropTypes.func.isRequired,
  scope: PropTypes.string,
  hasResultFilters: PropTypes.shape({
    assay: PropTypes.object,
    tissue: PropTypes.object,
  }),
};

GeneCentricView.defaultProps = {
  geneSearchResults: {},
  geneSearching: false,
  genSearchError: '',
  geneSearchParams: { ...defaultGeneSearchParams },
  scope: 'all',
  hasResultFilters: {},
};

const mapStateToProps = (state) => ({
  ...state.analysis,
});

const mapDispatchToProps = (dispatch) => ({
  handleGeneCentricSearch: (params, geneInputValue, scope) =>
    dispatch(
      AnalysisActions.handleGeneCentricSearch(params, geneInputValue, scope)
    ),
  geneSearchReset: (scope) => dispatch(AnalysisActions.geneSearchReset(scope)),
  geneSearchChangeFilter: (field, value) =>
    dispatch(AnalysisActions.geneSearchChangeFilter(field, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneCentricView);
