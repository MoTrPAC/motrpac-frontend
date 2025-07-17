import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Helmet } from 'react-helmet';
import PageTitle from '../lib/ui/pageTitle';
import TimewiseResultsTable from './timewiseTable';
import TrainingResultsTable from './trainingResultsTable';
import HumanResultsTable from './humanResultsTable';
import RatsAcuteExerciseResultsTable from './ratsAcuteResultsTable';
import SearchActions from './searchActions';
import surveyModdalActions from '../UserSurvey/userSurveyActions';
import SearchResultFilters from './deaSearchResultFilters';
import AnimatedLoadingIcon from '../lib/ui/loading';
import { searchParamsDefaultProps, searchParamsPropType } from './sharedlib';
import IconSet from '../lib/iconSet';
import searchStructuredData from '../lib/searchStructuredData/search';
import UserSurveyModal from '../UserSurvey/userSurveyModal';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';
import { genes } from '../data/genes';
import { metabolites } from '../data/metabolites';
import { proteins } from '../data/proteins';
import { humanGenes } from '../data/human_genes';
import { humanMetabolites } from '../data/human_metabolites';
import { ratAcuteGenes } from '../data/rat_acute_genes';
import { ratAcuteMetabolites } from '../data/rat_acute_metabolites';
import { ratAcuteProteins } from '../data/rat_acute_proteins';
import DifferentialAbundanceSummary from './components/differentialAbundanceSummary';

import '@styles/search.scss';

export function SearchPage({
  profile = {},
  searchResults = {},
  scope = 'all',
  searching = false,
  searchError = '',
  searchParams = { ...searchParamsDefaultProps },
  changeParam,
  changeResultFilter,
  handleSearch,
  resetSearch,
  downloadResults = {},
  downloading = false,
  downloadError = '',
  handleSearchDownload,
  hasResultFilters,
}) {
  const [multiSelections, setMultiSelections] = useState([]);
  const inputRef = useRef(null);
  const showUserSurveyModal = useSelector(
    (state) => state.userSurvey.showUserSurveyModal,
  );
  const surveyId = useSelector((state) => state.userSurvey.surveyId);

  const userType = profile.user_metadata && profile.user_metadata.userType;

  useEffect(() => {
    if (showUserSurveyModal) {
      const userSurveyModalRef = document.querySelector('body');
      userSurveyModalRef.classList.add('modal-open');
    }
  }, [showUserSurveyModal]);

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
  const humanResults = [];
  const ratAcuteExerciseResults = [];
  if (searchParams.study === 'pass1b06' && searchResults.result && Object.keys(searchResults.result).length > 0) {
    Object.keys(searchResults.result).forEach((key) => {
      if (key.indexOf('timewise') > -1) {
        timewiseResults.push(...mapKeyToValue(searchResults.result[key]));
      } else if (key.indexOf('training') > -1) {
        trainingResults.push(...mapKeyToValue(searchResults.result[key]));
      }
    });
  }
  if (searchParams.study === 'pass1a06' && searchResults.result && Object.keys(searchResults.result).length > 0) {
    ratAcuteExerciseResults.push(...mapKeyToValue(searchResults.result));
  }
  if (searchParams.study === 'precawg' && searchResults.result && Object.keys(searchResults.result).length > 0) {
    humanResults.push(...mapKeyToValue(searchResults.result));
  }

  // get options based on selected search context
  // for automatic suggestions in the primary search input field
  function getOptions() {
    if (searchParams.study === 'pass1b06') {
      switch (searchParams.ktype) {
        case 'gene':
          return genes;
        case 'metab':
          return metabolites;
        case 'protein':
          return proteins;
        default:
          return [];
      }
    }
    if (searchParams.study === 'pass1a06') {
      switch (searchParams.ktype) {
        case 'gene':
          return ratAcuteGenes;
        case 'metab':
          return ratAcuteMetabolites;
        case 'protein':
          return ratAcuteProteins;
        default:
          return [];
      }
    }
    if (searchParams.study === 'precawg') {
      switch (searchParams.ktype) {
        case 'gene':
          return humanGenes;
        case 'metab':
          return humanMetabolites;
        default:
          return [];
      }
    }
    return [];
  }

  // render placeholder text in primary search input field
  function renderPlaceholder() {
    if (searchParams.study === 'precawg') {
      if (searchParams.ktype === 'protein') {
        return 'Example: p14854, q8tep8_s76s';
      }
      if (searchParams.ktype === 'metab') {
        return 'Example: "aminobutyric acid", "coa(3:0, 3-oh)"';
      }
      return 'Example: bag3, myom2, prag1';
    }

    if (searchParams.ktype === 'protein') {
      return 'Example: "atpase inhibitor, mitochondrial", "global ischemia-induced protein 11"';
    }
    if (searchParams.ktype === 'metab') {
      return 'Example: "amino acids and peptides", "c10:2 carnitine"';
    }
    return 'Example: brd2, smad3, vegfa';
  }

  // selector for manually entered keyword input configured with auto-suggest
  const inputEl = document.querySelector('.rbt-input-main');
  // selector for manually entered protein ID input for human species
  const inputElProteinId = document.querySelector('.search-input-ktype');

  // Transform input values
  // Keep react-bootstrap-typeahead state array as is
  // Convert manually entered gene/protein/metabolite string input to array
  function formatSearchInput() {
    const newArr = [];
    // react-bootstrap-typeahead state array has values
    if (multiSelections.length) {
      multiSelections.forEach((item) => newArr.push(item.id));
      return newArr;
    }
    // Handle manually entered gene/protein/metabolite string input
    // convert formatted string to array
    if (inputEl.value && inputEl.value.length) {
      const inputStr = inputEl.value;
      // Match terms enclosed in double quotes or not containing commas
      const terms = inputStr.match(/("[^"]+"|[^, ]+)/g);
      // Remove double quotes from terms that are enclosed and trim any extra spaces
      return terms.map((term) => term.replace(/"/g, '').trim());
    }
    return newArr;
  }

  // Clear manually entered gene/protein/metabolite input
  const clearSearchTermInput = () => {
    if (searchParams.ktype === 'protein' && searchParams.species === 'human') {
      if (inputElProteinId && inputElProteinId.value && inputElProteinId.value.length) {
        inputElProteinId.value = '';
      }
    } else if (inputEl && inputEl.value && inputEl.value.length) {
      inputRef.current.clear();
    }
  };

  const handleStudyChange = (value) => {
    resetSearch('all');
    clearSearchTermInput();
    setMultiSelections([]);
    if (inputEl && inputEl.value && inputEl.value.length) {
      inputEl.value = '';
    }
    // Set study type and automatically determine species
    changeParam('study', value);
    if (value === 'precawg') {
      changeParam('species', 'human');
    } else {
      changeParam('species', 'rat');
    }
  };

  return (
    <div className="searchPage px-3 px-md-4 mb-3 w-100">
      <Helmet>
        <html lang="en" />
        <title>Search Differential Abundance Data - MoTrPAC Data Hub</title>
        <script type="application/ld+json">
          {JSON.stringify(searchStructuredData)}
        </script>
      </Helmet>
      <form id="searchForm" name="searchForm">
        <PageTitle title="Search differential abundance data" />
        <div className="search-content-container">
          <DifferentialAbundanceSummary userType={userType} species={searchParams.species} study={searchParams.study} />
          <div className="search-form-container mt-3 mb-4 border shadow-sm rounded px-4 pt-2 pb-3">
            <div className="search-summary-toggle-container row">
              <a
                className="btn btn-link show-collapse-summary-link mx-auto"
                role="button"
                data-toggle="collapse"
                href="#collapseDifferentialAbundanceSummary"
                aria-expanded="false"
                aria-controls="collapseDifferentialAbundanceSummary"
              >
                <span className="material-icons">drag_handle</span>
              </a>
            </div>
            {userType && userType === 'internal' && (
              <StudySelectButtonGroup
                onChange={handleStudyChange}
                defaultSelected={searchParams.study}
              />
            )}
            <div className="es-search-ui-container d-flex align-items-center w-100 mt-3 pb-2">

              <RadioButton
                searchParams={searchParams}
                changeParam={changeParam}
                ktype={searchParams.ktype}
                resetSearch={resetSearch}
                clearInput={clearSearchTermInput}
                setMultiSelections={setMultiSelections}
                inputEl={inputEl}
              />
              <div className="search-box-input-group d-flex align-items-center flex-grow-1">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text search-icon">
                      <img src={searchParams.ktype === 'gene' ? IconSet.DNA : (searchParams.ktype === 'protein' ? IconSet.Protein : IconSet.Metabolite)} alt="" />
                    </div>
                  </div>
                  {searchParams.ktype === 'protein' && searchParams.species === 'human' ? (
                    <input
                      type="text"
                      id="keys"
                      name="keys"
                      className="form-control search-input-ktype flex-grow-1"
                      placeholder={renderPlaceholder()}
                      value={searchParams.keys}
                      onChange={(e) => changeParam('keys', e.target.value)}
                    />
                  ) : (
                    <Typeahead
                      id="dea-search-typeahead-multiple"
                      labelKey="id"
                      multiple
                      onChange={setMultiSelections}
                      options={getOptions()}
                      placeholder={renderPlaceholder()}
                      selected={multiSelections}
                      minLength={2}
                      ref={inputRef}
                    />
                  )}
                </div>
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
                      handleSearch(
                        searchParams,
                        (multiSelections && multiSelections.length)
                          || (inputEl && inputEl.value && inputEl.value.length)
                          ? formatSearchInput()
                          : searchParams.keys,
                        'all',
                      );
                      // track event in Google Analytics 4
                      trackEvent(
                        'Differential Abundance Search',
                        'keyword_search',
                        profile && profile.userid
                          ? profile.userid.substring(profile.userid.indexOf('|') + 1)
                          : 'anonymous',
                        (multiSelections && multiSelections.length)
                          || (inputEl && inputEl.value && inputEl.value.length)
                          ? formatSearchInput()
                          : searchParams.keys,
                      );
                    }}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary search-reset ml-2"
                    onClick={() => {
                      clearSearchTermInput();
                      resetSearch('all');
                      setMultiSelections([]);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="search-body-container mt-4 mb-2">
            {searching && <AnimatedLoadingIcon isFetching={searching} />}
            {!searching && searchError ? (
              <div className="alert alert-danger">{searchError}</div>
            ) : null}
            {!searching
              && !searchResults.result
              && searchResults.errors
              && scope === 'all' ? (
                <div className="alert alert-warning">
                  {searchResults.errors}
                  {' '}
                  Please modify your search parameters and
                  try again.
                </div>
              ) : null}
            {!searching && !searchResults.result && searchResults.total === 0 ? (
              <div className="alert alert-warning">
                  {searchResults.errors}
                  {' '}
                  No matches found. Please modify your search
                  parameters and try again.
                </div>
              ) : null}
            {!searching
              && (searchResults.result
                || (searchResults.errors && scope === 'filters')) ? (
                  <div className="search-results-wrapper-container row">
                    <div className="search-sidebar-container col-md-3">
                      <SearchResultFilters
                        searchParams={searchParams}
                        changeResultFilter={changeResultFilter}
                        handleSearch={handleSearch}
                        resetSearch={resetSearch}
                        hasResultFilters={hasResultFilters}
                        profile={profile}
                      />
                    </div>
                    {/* render search results for rats endurance training */}
                    {searchParams.study === 'pass1b06' && (
                      <div className="tabbed-content col-md-9">
                        {/* nav tabs */}
                        <ul className="nav nav-tabs" id="dataTab" role="tablist">
                          <li
                            className="nav-item font-weight-bold"
                            role="presentation"
                          >
                            <a
                              className="nav-link active timewise-definition"
                              id="timewise_dea_tab"
                              data-toggle="pill"
                              href="#timewise_dea"
                              role="tab"
                              aria-controls="timewise_dea"
                              aria-selected="true"
                            >
                              Timewise
                            </a>
                            <Tooltip anchorSelect=".timewise-definition" place="top">
                              Select time-point-specific differential analytes
                            </Tooltip>
                          </li>
                          <li
                            className="nav-item font-weight-bold"
                            role="presentation"
                          >
                            <a
                              className="nav-link training-definition"
                              id="training_dea_tab"
                              data-toggle="pill"
                              href="#training_dea"
                              role="tab"
                              aria-controls="training_dea"
                              aria-selected="false"
                            >
                              Training
                            </a>
                            <Tooltip anchorSelect=".training-definition" place="top">
                              Select overall training differential analytes
                            </Tooltip>
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
                                handleSearchDownload={handleSearchDownload}
                              />
                            ) : (
                              scope === 'filters' && (
                                <p className="mt-4">
                                  {searchResults.errors &&
                                  searchResults.errors.indexOf('No results found') !==
                                    -1 ? (
                                    <span>
                                      No matches found for the selected filters.
                                      Please refer to the{' '}
                                      <Link to="/summary">Summary Table</Link> for
                                      data that are available.
                                    </span>
                                  ) : (
                                    searchResults.errors
                                  )}
                                </p>
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
                                handleSearchDownload={handleSearchDownload}
                              />
                            ) : (
                              scope === 'filters' && (
                                <p className="mt-4">
                                  {searchResults.errors &&
                                  searchResults.errors.indexOf('No results found') !==
                                    -1 ? (
                                    <span>
                                      No matches found for the selected filters.
                                      Please refer to the{' '}
                                      <Link to="/summary">Summary Table</Link> for
                                      data that are available.
                                    </span>
                                  ) : (
                                    searchResults.errors
                                  )}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* render search results for rats acute exercise study */}
                    {searchParams.study === 'pass1a06' && (
                      <div className="rats-acute-exercise-results-content-container tabbed-content col-md-9">
                        <div className="tab-content mt-3">
                          {ratAcuteExerciseResults.length ? (
                            <RatsAcuteExerciseResultsTable
                              ratsAcuteExerciseData={ratAcuteExerciseResults}
                              searchParams={searchParams}
                              handleSearchDownload={handleSearchDownload}
                            />
                          ) : (
                            scope === 'filters' && (
                              <p className="mt-4">
                                {searchResults.errors
                                && searchResults.errors.indexOf('No results found') !== -1 ? (
                                  <span>
                                    No matches found for the selected filters.
                                    Please refer to the
                                    {' '}
                                    <Link to="/summary">Summary Table</Link>
                                    {' '}
                                    for data that are available.
                                  </span>
                                  ) : (
                                    searchResults.errors
                                  )}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                    {/* render search results for pre-covid human sed adults study */}
                    {searchParams.study === 'precawg' && (
                      <div className="human-da-results-content-container tabbed-content col-md-9">
                        <div className="tab-content mt-3">
                          {humanResults.length ? (
                            <HumanResultsTable
                              humanData={humanResults}
                              searchParams={searchParams}
                              handleSearchDownload={handleSearchDownload}
                            />
                          ) : (
                            scope === 'filters' && (
                              <p className="mt-4">
                                {searchResults.errors
                                && searchResults.errors.indexOf('No results found') !== -1 ? (
                                  <span>
                                    No matches found for the selected filters.
                                    Please refer to the
                                    {' '}
                                    <Link to="/summary">Summary Table</Link>
                                    {' '}
                                    for data that are available.
                                  </span>
                                  ) : (
                                    searchResults.errors
                                  )}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
              ) : null}
            <ResultsDownloadModal
              downloadPath={downloadResults.path}
              downloadError={downloadError}
              downloading={downloading}
              profile={profile}
              study={searchParams.study}
            />
          </div>
        </div>
        <UserSurveyModal
          userID={profile && profile.email ? profile.email : (surveyId ? surveyId : 'anonymous')}
          dataContext="search_results"
        />
      </form>
    </div>
  );
}

function RadioButtonComponent({ ktype, keyType, elId, label, eventHandler }) {
  return (
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="radio"
        name="ktype"
        id={elId}
        value={keyType}
        checked={ktype === keyType}
        onChange={(e) => eventHandler(e)}
      />
      <label className="form-check-label" htmlFor={elId}>
        {label}
      </label>
    </div>
  );
}

// Radio buttons for selecting the search context
function RadioButton({
  searchParams,
  changeParam,
  ktype,
  resetSearch,
  clearInput,
  setMultiSelections,
  inputEl,
}) {
  const radioButtonOptions = [
    {
      keyType: 'gene',
      id: 'inlineRadioGene',
      label: 'Gene symbol',
    },
    {
      keyType: 'protein',
      id: 'inlineRadioProtein',
      label: searchParams.study === 'precawg' ? 'Protein ID' : 'Protein name',
    },
    {
      keyType: 'metab',
      id: 'inlineRadioMetab',
      label: 'Metabolite name',
    },
  ];

  const handleRadioChange = (e) => {
    const selectedSpecis = searchParams.species;
    const selectedStudy = searchParams.study;
    resetSearch('all');
    clearInput();
    setMultiSelections([]);
    changeParam('ktype', e.target.value);
    if (inputEl && inputEl.value && inputEl.value.length) {
      inputEl.value = '';
    }
    changeParam('species', selectedSpecis);
    changeParam('study', selectedStudy);
  };

  return (
    <div className="search-context">
      {radioButtonOptions.map((item) => (
        <RadioButtonComponent
          key={item.id}
          ktype={ktype}
          keyType={item.keyType}
          elId={item.id}
          label={item.label}
          eventHandler={handleRadioChange}
        />
      ))}
    </div>
  );
}

function PrimaryOmicsFilter({ omics = 'all', toggleOmics }) {
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

// Render study selection button group
function StudySelectButtonGroup({
  onChange,
  defaultSelected = 'pass1b06',
  disabled = false,
}) {
  const [selected, setSelected] = useState(defaultSelected);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const handleSelect = (value) => {
    if (disabled) return;

    setSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  const studyOptions = [
    { value: 'pass1b06', label: 'Endurance Trained Young Adult Rats' },
    { value: 'pass1a06', label: 'Acute Exercise Young Adult Rats' },
    { value: 'precawg', label: 'Pre-COVID Human Sedentary Adults' }
  ];

  return (
    <div className="search-study-select-container row">
      <div className="col-12 d-flex justify-content-center">
        <div className="btn-group" role="group" aria-label="Study selection">
          {studyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`d-flex align-items-center btn ${selected === option.value ? 'active' : ''}`}
              onClick={() => handleSelect(option.value)}
              disabled={disabled}
            >
              <span className="btn-icon material-icons mr-1">
                {option.value === 'precawg' ? 'person' : 'pest_control_rodent'}
              </span>
              <span className="btn-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


// Render modal message
function ResultsDownloadLink({
  downloadPath = '', downloadError = '', profile = {}, study = 'pass1b06',
}) {
  const dispatch = useDispatch();

  // track event when user clicks download link
  function handleSearchResultsDownload() {
    // update store to show that user has downloaded data
    dispatch(surveyModdalActions.userDownloadedData());
    // track event in Google Analytics 4
    trackEvent(
      'Data Download',
      'search_results',
      profile && profile.userid
        ? profile.userid.substring(profile.userid.indexOf('|') + 1)
        : 'anonymous',
      resultDownloadFilePath,
    );
  }

  const ratDataHost =
    import.meta.env.DEV
      ? import.meta.env.VITE_ES_PROXY_HOST_DEV
      : import.meta.env.VITE_ES_PROXY_HOST;

  const humanDataHost =
    import.meta.env.DEV
      ? import.meta.env.VITE_ES_PROXY_PRECAWG_HOST_DEV
      : import.meta.env.VITE_ES_PROXY_PRECAWG_HOST;

  const host = study === 'pass1b06' ? ratDataHost : humanDataHost;

  const resultDownloadFilePath =
    downloadPath &&
    downloadPath.substring(downloadPath.indexOf('search_results'));

  if (downloadError && downloadError.length) {
    return <span className="modal-message">{downloadError}</span>;
  }

  return (
    <span className="modal-message">
      {resultDownloadFilePath ? (
        <a
          id={resultDownloadFilePath}
          href={`${host}/${resultDownloadFilePath}`}
          download
          onClick={handleSearchResultsDownload}
        >
          Click this link to download the search results.
        </a>
      ) : null}
    </span>
  );
}

// Render modal
function ResultsDownloadModal({
  downloadPath = '',
  downloadError = '',
  downloading = false,
  profile = {},
  study = 'pass1b06',
}) {
  const dispatch = useDispatch();

  // get states from store
  const surveySubmitted = useSelector(
    (state) => state.userSurvey.surveySubmitted,
  );
  const downloadedData = useSelector(
    (state) => state.userSurvey.downloadedData,
  );

  // show modal if user downloaded data and has not submitted survey
  function handleSearchResultsDownloadModalClose() {
    if (downloadedData && !surveySubmitted) {
      setTimeout(() => {
        dispatch(surveyModdalActions.toggleUserSurveyModal(true));
      }, 1000);
    }
  }

  return (
    <div
      className="modal fade data-download-modal"
      id="dataDownloadModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="dataDownloadModalLabel"
      aria-hidden="true"
      data-backdrop="static"
      data-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Download Results</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleSearchResultsDownloadModalClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {!downloading ? (
              <ResultsDownloadLink
                downloadPath={downloadPath}
                downloadError={downloadError}
                profile={profile}
                study={study}
              />
            ) : (
              <div className="loading-spinner w-100 text-center my-3">
                <img src={IconSet.Spinner} alt="" />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={handleSearchResultsDownloadModalClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
/* End: Download modal */

SearchPage.propTypes = {
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.object,
  }),
  searchResults: PropTypes.shape({
    result: PropTypes.object,
    uniqs: PropTypes.object,
    total: PropTypes.number,
  }),
  scope: PropTypes.string,
  searching: PropTypes.bool,
  searchError: PropTypes.string,
  searchParams: PropTypes.shape({ ...searchParamsPropType }),
  changeParam: PropTypes.func.isRequired,
  changeResultFilter: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  downloadResults: PropTypes.shape({
    total: PropTypes.number,
    path: PropTypes.string,
  }),
  downloading: PropTypes.bool,
  downloadError: PropTypes.string,
  handleSearchDownload: PropTypes.func.isRequired,
  hasResultFilters: PropTypes.shape({
    assay: PropTypes.object,
    comparison_group: PropTypes.object,
    sex: PropTypes.object,
    tissue: PropTypes.object,
  }),
};

const mapStateToProps = (state) => ({
  ...state.auth,
  ...state.search,
  allFiles: state.browseData.allFiles,
});

const mapDispatchToProps = (dispatch) => ({
  changeParam: (field, value) =>
    dispatch(SearchActions.changeParam(field, value)),
  changeResultFilter: (field, value, bound) =>
    dispatch(SearchActions.changeResultFilter(field, value, bound)),
  handleSearch: (params, geneInputValue, scope) =>
    dispatch(SearchActions.handleSearch(params, geneInputValue, scope)),
  resetSearch: (scope) => dispatch(SearchActions.searchReset(scope)),
  handleSearchDownload: (params, analysis) =>
    dispatch(SearchActions.handleSearchDownload(params, analysis)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
