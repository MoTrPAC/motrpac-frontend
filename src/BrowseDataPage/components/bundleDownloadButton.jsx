import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import surveyModdalActions from '../../UserSurvey/userSurveyActions';
import { trackEvent } from '../../GoogleAnalytics/googleAnalytics';

function BundleDownloadButton({
  bundlefile,
  profile,
  handleUserSurveyOpenOnBundledDownload,
}) {
  const [fetchStatus, setFetchStatus] = useState({
    status: null,
    fileUrl: null,
    fetching: false,
  });
  const dispatch = useDispatch();

  // fetch signed url upon user's initial button click
  function handleFileFetch(e, bucket, filename) {
    e.preventDefault();

    setFetchStatus({
      status: 'fetching',
      fileUrl: null,
      fetching: true,
    });

    const api = process.env.REACT_APP_API_SERVICE_ADDRESS;
    const endpoint = process.env.REACT_APP_SIGNED_URL_ENDPOINT;
    const key = process.env.REACT_APP_API_SERVICE_KEY;
    return axios
      .get(`${api}${endpoint}?bucket=${bucket}&object=${filename}&key=${key}`)
      .then((response) => {
        setFetchStatus({
          status: 'success',
          fileUrl: response.data.url,
          fetching: false,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(`${err.error}: ${err.errorDescription}`);
        setFetchStatus({
          status: 'error',
          fileUrl: null,
          fetching: false,
        });
      });
  }

  // reset state upon user clicking download link
  function handleFileDownload(file) {
    dispatch(surveyModdalActions.userDownloadedData());
    const userID =
      profile && profile.userid
        ? profile.userid.substring(profile.userid.indexOf('|') + 1)
        : 'anonymous';
    trackEvent('Data Download', 'bundled_files', userID, file);
    setTimeout(() => {
      setFetchStatus({
        status: null,
        fileUrl: null,
        fetching: false,
      });
    }, 1500);
    if (typeof handleUserSurveyOpenOnBundledDownload === 'function') {
      handleUserSurveyOpenOnBundledDownload();
    }
  }

  // render button with fetch state
  function renderFetchingDownloadButton() {
    return (
      <button
        type="button"
        className="btn btn-primary btn-bundle-data-download d-flex align-items-center"
        disabled
      >
        <div
          className="spinner-border spinner-border-sm text-light mr-1"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <span className="file-size">Get</span>
      </button>
    );
  }

  // render button with successful fetch
  function renderSuccessDownloadButton(file) {
    return (
      <a
        id={file}
        href={fetchStatus.fileUrl}
        className="btn-bundle-data-download ready-to-download-link px-3"
        download
        onClick={(e) => handleFileDownload(file, e)}
      >
        Click to download
      </a>
    );
  }

  // render button with error state
  function renderErrorDownloadButton() {
    return (
      <button
        type="button"
        className="btn btn-danger btn-bundle-data-download px-3"
        onClick={(e) => {
          e.preventDefault();
          setFetchStatus({
            status: null,
            fileUrl: null,
            fetching: false,
          });
        }}
      >
        Something went wrong. Try again.
      </button>
    );
  }

  // render button with default state
  function renderDefaultDownloadButton(file) {
    return (
      <button
        type="button"
        className="btn btn-primary btn-bundle-data-download d-flex align-items-center"
        onClick={(e) =>
          handleFileFetch(e, process.env.REACT_APP_DATA_FILE_BUCKET, file)
        }
      >
        <i className="material-icons open-access-bundle-data-download-icon">
          file_download
        </i>
        <span className="file-size">Get</span>
      </button>
    );
  }

  return (
    <div className="open-access-bundle-data-download-container d-flex justify-content-end">
      {fetchStatus.fetching &&
        !fetchStatus.fileUrl &&
        renderFetchingDownloadButton()}
      {!fetchStatus.fetching &&
        fetchStatus.fileUrl &&
        fetchStatus.fileUrl.length &&
        renderSuccessDownloadButton(bundlefile)}
      {!fetchStatus.fetching &&
        !fetchStatus.status &&
        renderDefaultDownloadButton(bundlefile)}
      {!fetchStatus.fetching &&
        fetchStatus.status &&
        fetchStatus.status === 'error' &&
        renderErrorDownloadButton()}
    </div>
  );
}

BundleDownloadButton.propTypes = {
  bundlefile: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    userid: PropTypes.string,
    user_metadata: PropTypes.shape({
      userType: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  handleUserSurveyOpenOnBundledDownload: PropTypes.func,
};

BundleDownloadButton.defaultProps = {
  profile: {},
  handleUserSurveyOpenOnBundledDownload: null,
};

export default BundleDownloadButton;
