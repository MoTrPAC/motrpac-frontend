import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';

/**
 * Renders a download button for reviewer R packages with signed URL fetching
 * 
 * This component fetches signed URLs from GCP buckets for downloading reviewer-specific
 * R packages. The files should be stored in the GCP bucket specified by the
 * VITE_DATA_FILE_BUCKET environment variable.
 * 
 * Expected file naming in GCP bucket:
 * - Analysis R Package: bundles/motrpac_human-precovid-sed-adu_analysis.zip
 * - Data R Package: bundles/motrpac_human-precovid-sed-adu_data.zip
 *
 * @param {String} filename - The filename in the GCP bucket
 * @param {String} label - The display label for the button
 * @param {String} icon - Bootstrap icon class name
 * @param {Object} profile - User profile object
 *
 * @returns {object} JSX representation of the download button
 */
function ReviewerDownloadButton({
  filename,
  label,
  icon = 'bi-file-zip-fill',
  profile = {}
}) {
  const [fetchStatus, setFetchStatus] = useState({
    status: null,
    fileUrl: null,
    fetching: false,
  });

  // Fetch signed URL from the API
    async function handleFileFetch(e) {
    e.preventDefault();

    setFetchStatus({
      status: 'fetching',
      fileUrl: null,
      fetching: true,
    });

    const api = import.meta.env.VITE_API_SERVICE_ADDRESS;
    const endpoint = import.meta.env.VITE_SIGNED_URL_ENDPOINT;
    const key = import.meta.env.VITE_API_SERVICE_KEY;
    const bucket = import.meta.env.VITE_DATA_FILE_BUCKET;

    if (!api || !endpoint || !key || !bucket) {
      console.error('Missing required environment variables for file download');
      setFetchStatus({ status: 'error', fileUrl: null, fetching: false });
      return Promise.reject(new Error('Configuration error'));
    }

    try {
      const response = await axios.get(
        `${api}${endpoint}?bucket=${bucket}&object=${filename}&key=${key}`,
      );
      setFetchStatus({
        status: 'success',
        fileUrl: response.data.url,
        fetching: false,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      if (err.response && err.response.data) {
        console.log('Error:', err.response.data);
      } else {
        console.log('Error:', err.message);
      }
      setFetchStatus({
        status: 'error',
        fileUrl: null,
        fetching: false,
      });
    }
  }

  // Reset state upon user clicking download link
  function handleFileDownload() {
    const userID =
      profile && profile.userid
        ? profile.userid.substring(profile.userid.indexOf('|') + 1)
        : 'anonymous';
    trackEvent('Reviewer Data Download', 'reviewer_package', userID, filename);
    setFetchStatus({
      status: null,
      fileUrl: null,
      fetching: false,
    });
  }

  // Render fetching state
  if (fetchStatus.fetching) {
    return (
      <button
        type="button"
        className="reviewer-data-download-link btn btn-primary mr-4 disabled"
        disabled
      >
        <div
          className="spinner-border spinner-border-sm mr-1"
          role="status"
          style={{ width: '1rem', height: '1rem' }}
        >
          <span className="sr-only">Loading...</span>
        </div>
        <span>{label}</span>
      </button>
    );
  }

  // Render download link when URL is ready
  if (fetchStatus.fileUrl && !fetchStatus.fetching) {
    return (
      <a
        href={fetchStatus.fileUrl}
        className="reviewer-data-download-link btn btn-primary mr-4 ready-to-download"
        download
        onClick={handleFileDownload}
      >
        <i className={`bi ${icon} mr-1`}></i>
        <span>Click to download</span>
      </a>
    );
  }

  // Render error state
  if (fetchStatus.status === 'error') {
    return (
      <button
        type="button"
        className="reviewer-data-download-link btn btn-danger mr-4 error"
        onClick={(e) => {
          e.preventDefault();
          setFetchStatus({
            status: null,
            fileUrl: null,
            fetching: false,
          });
        }}
      >
        <i className="bi bi-exclamation-triangle mr-1"></i>
        <span>Error - Try again</span>
      </button>
    );
  }

  // Render default state with fetch button
  return (
    <button
      type="button"
      className="reviewer-data-download-link btn btn-primary mr-4"
      onClick={handleFileFetch}
    >
      <i className={`bi ${icon} mr-1`}></i>
      <span>{label}</span>
    </button>
  );
}

ReviewerDownloadButton.propTypes = {
  filename: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.object,
    app_metadata: PropTypes.object,
  }),
};

export default ReviewerDownloadButton;
