import React, { useState } from 'react';
import {
  SearchProvider,
  WithSearch,
  ErrorBoundary,
  SearchBox,
  Facet,
} from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import runRequest from './runRequest';
import buildState from './buildState';
import TimewiseResultsTable from './timewiseTable';
import TrainingResultsTable from './trainingResultsTable';

export default function GeneCentricSearch() {
  const [searchContext, setSearchContext] = useState('genes');

  // Configure the search provider
  const config = {
    debug: true,
    hasA11yNotifications: true,
    intialState: { searchTerm: 'Brd2', resultsPerPage: 20 },
    onAutocomplete: async ({ searchTerm }) => {
      // Not implemented yet
    },
    onSearch: async (state) => {
      const { resultsPerPage } = state;
      const responseJson = await runRequest(state.searchTerm, searchContext);
      return buildState(responseJson, resultsPerPage);
    },
  };

  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ searchTerm, setSearchTerm, results }) => ({
          searchTerm,
          setSearchTerm,
          results,
        })}
      >
        {({ searchTerm, setSearchTerm, results }) => {
          const timewiseResults = results.filter(
            (item) => item.analysis.raw === 'Timewise'
          );
          const trainingResults = results.filter(
            (item) => item.analysis.raw === 'Training'
          );
          return (
            <div className="analysis-animal-gene-centric-results-container">
              <h6 className="mt-4 mb-3">
                Search by gene symbol, protein ID, or metabolite name to examine
                the training response of its related molecules.
              </h6>
              <ErrorBoundary>
                <div className="gene-search-ui-container d-flex align-items-center w-100">
                  <RadioButton
                    searchContext={searchContext}
                    onEvent={(e) => setSearchContext(e.target.value)}
                  />
                  <SearchBox
                    inputProps={{
                      placeholder: 'Enter a gene symbol (e.g. BRD2), protein ID (e.g. NP_001004217.2), or metabolite name (e.g. Arginine)',
                    }}
                  />
                </div>
                <div className="search-body-container my-4">
                  {results && results.length ? (
                    <>
                      <h5>{`Search Term: ${searchTerm.toUpperCase()}`}</h5>
                      <div className="tabbed-content mb-4 w-100">
                        {/* nav tabs */}
                        <ul
                          className="nav nav-tabs"
                          id="dataTab"
                          role="tablist"
                        >
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
                        <div className="tab-content mt-4">
                          <div
                            className="tab-pane fade show active"
                            id="timewise_dea"
                            role="tabpanel"
                            aria-labelledby="timewise_dea_tab"
                          >
                            <TimewiseResultsTable
                              timewiseData={timewiseResults}
                            />
                          </div>
                          <div
                            className="tab-pane fade"
                            id="training_dea"
                            role="tabpanel"
                            aria-labelledby="training_dea_tab"
                          >
                            <TrainingResultsTable
                              trainingData={trainingResults}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}

// Radio buttons for selecting the search context
function RadioButton({ searchContext, onEvent }) {
  return (
    <div className="search-context">
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="searchContext"
          id="inlineRadioGeneSymbol"
          value="genes"
          checked={searchContext === 'genes'}
          onChange={onEvent.bind(this)}
        />
        <label className="form-check-label" htmlFor="inlineRadioGeneSymbol">
          Gene
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="searchContext"
          id="inlineRadioProteinId"
          value="proteins"
          checked={searchContext === 'proteins'}
          onChange={onEvent.bind(this)}
        />
        <label className="form-check-label" htmlFor="inlineRadioProteinId">
          Protein ID
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="searchContext"
          id="inlineRadioMetabolite"
          value="metabolites"
          checked={searchContext === 'metabolites'}
          onChange={onEvent.bind(this)}
        />
        <label className="form-check-label" htmlFor="inlineRadioMetabolite">
          Metabolite
        </label>
      </div>
    </div>
  );
}
