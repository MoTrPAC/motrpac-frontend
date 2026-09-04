import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import BrowseDataFilter from '../browseDataFilter';
import SelectiveDataDownloads from './selectiveDataDownloads';
import StudyDataExplorer from './studyDataExplorer';
import ExternalLink from '../../lib/ui/externalLink';
import { resolveScope } from '../../lib/collectionScope';
import actions from '../browseDataActions';

function DataDownloadsMain({
  profile = {},
  filteredFiles,
  activeFilters,
  onChangeFilter,
  onResetFilters,
  handleDownloadRequest,
  downloadRequestResponse,
  waitingForResponse,
  surveySubmitted,
  downloadedData,
}) {
  const location = useLocation();
  const dispatch = useDispatch();

  // anonymous user or authenticated user
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // The URL is the source of truth for what is loaded, so a reload, a bookmark
  // or the browser's back button all reconstruct the same view.
  const scope = resolveScope(location, userType);
  // A primitive key so the effect compares by value, not array identity.
  const collectionsKey = scope.prefixes.join(',');
  const selectionKey = scope.selected.join(',');
  const loadedKey = useSelector((state) => state.browseData.loadedCollections.join(','));

  useEffect(() => {
    // The picker navigates *and* dispatches, so skip the reload when the store
    // already holds exactly what the URL is asking for.
    if (collectionsKey && collectionsKey !== loadedKey) {
      dispatch(
        actions.selectCollections(
          collectionsKey.split(','),
          selectionKey ? selectionKey.split(',') : []
        )
      );
    }
  }, [collectionsKey, selectionKey, loadedKey, dispatch]);

  // An empty scope inside the file browser means the URL named collections this
  // user may not see; falling through to the download page is the destination.
  if (scope.prefixes.length) {
    return (
      <SelectiveDataDownloads
        profile={profile}
        filteredFiles={filteredFiles}
        activeFilters={activeFilters}
        onChangeFilter={onChangeFilter}
        onResetFilters={onResetFilters}
        handleDownloadRequest={handleDownloadRequest}
        downloadRequestResponse={downloadRequestResponse}
        waitingForResponse={waitingForResponse}
        selectedData={collectionsKey}
      />
    );
  }

  // Custom render page title with info button
  function renderPageTitle() {
    return (
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-3">
        <div className="page-title">
          <h1 className="mb-0 flex-grow-1">Data Download</h1>
        </div>
        <div className="btn-group show-main-data-download-info-link">
          <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-info-circle-fill"></i>
            <span className="ml-1">Show Info</span>
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <h5 className="border-bottom mt-1 mb-2 pb-2">Data types available to download:</h5>
            <ul className="pl-3">
              <li>
                <span className="font-weight-bold">Quant-ID</span> (Quantification &amp;
                Identification) - assay-specific quantitative results, experiment
                metadata and QA/QC reports
              </li>
              <li>
                <span className="font-weight-bold">Analysis</span> - normalized data
                tables, differential analysis results (e.g., log2 fold-change, p-values,
                adjusted p-values), and cross-platform merged metabolomics data tables
                for named metabolites
              </li>
              <li>
                <span className="font-weight-bold">Phenotype</span> - phenotypic data
              </li>
            </ul>
            <p>
              <span className="font-weight-bold">Note:</span> Raw files are not
              currently available for direct download through the Data Hub portal.
              Please{' '}
              <Link to="/contact">submit your requests to our helpdesk</Link> and
              specify the relevant tissues/assays if you would like to get access
              to the raw files.
            </p>
            {userType && userType === 'internal' && (
              <p className="mb-0">
                <span className="font-weight-bold">GCP bucket:</span> reveals the
                Google Cloud Storage path for a data type, to copy into{' '}
                <code>gsutil</code>. Requires separate Google Cloud authorization.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-download-overview container">
      {renderPageTitle()}
      <div className="browse-data-summary-container row mb-4">
        <div className="col-12">
          <div className="mb-2">
            Explore and download MoTrPAC multi-omics datasets, including phenotype, quantitative
            and summary-level results of molecular changes from exercise across multiple tissues. Currently
            available under the
            {' '}
            <Link to="/license">CC BY 4.0 license</Link>
            :
            {' '}
            <ul className="mt-2">
              <li>
                <span className="font-weight-bold">Endurance training in young adult rats study</span> - complete dataset (
                <ExternalLink
                  to="https://www.nature.com/articles/s41586-023-06877-w"
                  label="Nature publication"
                />
                )
              </li>
              <li>
                <span className="font-weight-bold">Acute exercise in human sedentary adults study</span> -
                {' '}
                <Link to="/search">summary-level results</Link>
                {' '}
                representing a subset of participants who underwent an acute exercise bout before the study
                was suspended due to COVID-19.
              </li>
            </ul>
          </div>
            {userType && userType === 'internal' && (
              <p className="mb-2">
                The acute exercise in young adult rats study datasets are currently available to consortium
                members only in the early preview phase.
              </p>
            )}
          <p className="mb-2">
            For study designs, protocols, and updates on upcoming data releases, visit our
            {' '}
            <Link to="/project-overview">Project Overview</Link>
            {' '}
            page.
          </p>
        </div>
        <div className="col-12 mt-4">
          <h2>Find MoTrPAC data by study or by release</h2>
          <p>
            Every MoTrPAC dataset lives in a{' '}
            <span className="font-weight-bold">collection</span>{' '}
            — a versioned package of Quantification & Identification, Analysis, or
            Phenotype data for one study. Start from a study to see everything it
            offers, or browse by release stage to see what is public,
            consortium-only, or still in early access. It is recommended to download
            the phenotypic data along with the omics data for a comprehensive
            analysis. Learn more about the
            {' '}
            <Link to="/technical-guides/phenotype">phenotypic data</Link>
            {' '}
            in MoTrPAC studies.
          </p>
          <StudyDataExplorer userType={userType} profile={profile} />
        </div>
        {/* Additional data information */}
        {userType && userType === 'internal' ? (
          <div className="browse-data-summary-content col-12 col-md-12">
            <div className="bd-callout bd-callout-info">
              <h4>Additional Information</h4>
              <p>
                The currently available young adult rats experimental data for
                acute exercise and endurance training include all tissues and
                assays from the very last consortium data release, as well as
                additional tissues and assays made available afterwards. The
                phenotypic data sets have also been updated since then.
              </p>
              <p>
                Please refer to this
                {' '}
                <a
                  href="https://docs.google.com/document/d/1bdXcYQLZ65GpJKTjf9XwRxhrfHJSD9NIqCxhG6icL8U"
                  className="inline-link-with-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  README
                  <i className="material-icons readme-file-icon">
                    description
                  </i>
                </a>
                {' '}
                document for the data included in the very last consortium
                data release.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

DataDownloadsMain.propTypes = {
  filteredFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  profile: PropTypes.shape({
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      userid: PropTypes.string,
    }),
  }),
  activeFilters: BrowseDataFilter.propTypes.activeFilters.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  handleDownloadRequest: PropTypes.func.isRequired,
  downloadRequestResponse: PropTypes.string.isRequired,
  waitingForResponse: PropTypes.bool.isRequired,
  surveySubmitted: PropTypes.bool.isRequired,
  downloadedData: PropTypes.bool.isRequired,
};

export default DataDownloadsMain;
