import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { trackEvent } from '../GoogleAnalytics/googleAnalytics';
import IconSet from '../lib/iconSet';
import EmailLink from '../lib/ui/emailLink';
import ReleaseDescFileExtract from './releaseDescFileExtract';
import ReleaseDescReadme from './releaseDescReadme';
import ReleaseDataTableInternalByPhase from './ReleaseDataTables/releaseDataTableInternalByPhase';
import ReleaseDataTableInternal from './ReleaseDataTables/releaseDataTableInternal';
import ReleaseDataTableExternal from './ReleaseDataTables/releaseDataTableExternal';

const releaseData = require('./releases.json');

const emojiMap = {
  tada: '🎉',
};

/**
 * Renders UIs for individual release items
 *
 * @param {Object} profile      Redux state for authenticated user's info.
 * @param {String} currentView  Prop to flag internal or external release view.
 *
 * @returns {object} JSX representation of each data release item.
 */
// FIXME: This component needs to be refactored and broken up into smaller modules
function ReleaseEntry({ profile, currentView }) {
  const [fileUrl, setFileUrl] = useState('');
  const [fetching, setFetching] = useState(true);
  const [modalStatus, setModalStatus] = useState({
    status: null,
    file: null,
    message: '',
    releaseVersion: null,
  });
  const [visibleReleases, setVisibleReleases] = useState(0);

  const releases = releaseData.filter(
    (release) => release.target === currentView
  );
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Event handler for "Show prior releases" button
  const toggleViewReleaseLength = (e) => {
    e.preventDefault();
    setVisibleReleases(visibleReleases === 0 ? releases.length : 0);
  };

  // Fetch file url from Google Storage API
  function fetchFile(bucket, filename, version) {
    const api =
      process.env.NODE_ENV !== 'production'
        ? process.env.REACT_APP_API_SERVICE_ADDRESS_DEV
        : process.env.REACT_APP_API_SERVICE_ADDRESS;
    const endpoint = process.env.REACT_APP_SIGNED_URL_ENDPOINT;
    const key =
      process.env.NODE_ENV !== 'production'
        ? process.env.REACT_APP_API_SERVICE_KEY_DEV
        : process.env.REACT_APP_API_SERVICE_KEY;
    return axios
      .get(`${api}${endpoint}?bucket=${bucket}&object=${filename}&key=${key}`)
      .then((response) => {
        setFileUrl(response.data.url);
        setModalStatus({
          status: 'success',
          file: filename,
          message: 'Click this link to download the requested file.',
          releaseVersion: version,
        });
        setFetching(false);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(`${err.error}: ${err.errorDescription}`);
        setModalStatus({
          status: 'error',
          file: filename,
          message: 'Error occurred. Please close the dialog box and try again.',
          releaseVersion: version,
        });
        setFetching(false);
      });
  }

  // Render modal message
  function renderModalMessage() {
    if (modalStatus.status !== 'success') {
      return <span className="modal-message">{modalStatus.message}</span>;
    }

    return (
      <span className="modal-message">
        <a
          id={`${currentView}-${modalStatus.releaseVersion}-${modalStatus.file}`}
          href={fileUrl}
          download
          onClick={trackEvent.bind(
            this,
            `Release ${modalStatus.releaseVersion} Downloads (${currentView})`,
            modalStatus.file,
            profile.user_metadata.name
          )}
        >
          {modalStatus.message}
        </a>
      </span>
    );
  }

  // Render modal
  function renderModal() {
    return (
      <div
        className="modal fade data-download-modal"
        id="dataDownloadModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="dataDownloadModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">File Download</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!fetching ? (
                renderModalMessage()
              ) : (
                <div className="loading-spinner">
                  <img src={IconSet.Spinner} alt="" />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render data type row
  function renderDataTypeRow(bucket, item, version) {
    return (
      <tr key={`${item.type}-${version}`}>
        <td>
          <div className="d-flex align-items-center justify-content-start">
            <img src={IconSet[item.icon]} alt={item.icon_alt} />
            <span>{item.title}</span>
          </div>
        </td>
        {item.object_zipfile && item.object_zipfile.length ? (
          <td className="release-data-download-link">
            {currentView === 'external' ? (
              <button
                type="button"
                className="btn-data-download"
                data-toggle="modal"
                data-target=".data-download-modal"
                onClick={fetchFile.bind(
                  this,
                  bucket,
                  item.object_zipfile,
                  version
                )}
              >
                <i className="material-icons release-data-download-icon">
                  save_alt
                </i>
              </button>
            ) : (
              <button
                type="button"
                className="btn-data-download disabled"
                disabled
              >
                <i className="material-icons release-data-download-icon">
                  save_alt
                </i>
              </button>
            )}
            <span className="file-size">{`(${item.object_zipfile_size})`}</span>
          </td>
        ) : (
          <td>
            <span>Not available</span>
          </td>
        )}
      </tr>
    );
  }

  // Render individual release entry
  function renderReleaseEntry() {
    let entries;
    const defaultEntries = currentView === 'external' ? 1 : visibleReleases;
    if (releases && releases.length) {
      // eslint-disable-next-line arrow-body-style
      entries = releases.slice(0, defaultEntries).map((release, idx) => {
        return (
          <div
            key={release.version}
            className={`release-entry-container ${currentView}`}
          >
            <div className="release-entry-item pt-2 pt-md-0 pb-3 pb-md-0 clearfix label-latest">
              {/* release timeline marker */}
              <div className="d-none d-md-block flex-wrap flex-items-center col-12 col-md-3 col-lg-2 px-md-3 pb-1 pb-md-4 pt-md-4 float-left text-md-right v-align-top release-timeline">
                {idx < 1 && currentView === 'external' ? (
                  <div className="flex-auto flex-self-start">
                    <span
                      className={`badge ${
                        currentView === 'internal'
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}
                    >
                      Latest release
                    </span>
                  </div>
                ) : null}
                <ul className="d-none d-md-block mt-2 list-style-none">
                  <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                    <i className="material-icons release-version-marker-icon">
                      local_offer
                    </i>
                    <span className="release-version-marker">{`v${release.version}`}</span>
                  </li>
                  {userType === 'internal' ? (
                    <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                      <i className="material-icons release-version-marker-icon">
                        local_offer
                      </i>
                      <span className="release-view">{currentView}</span>
                    </li>
                  ) : null}
                  <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                    <i className="material-icons release-date-marker-icon">
                      calendar_today
                    </i>
                    <span className="release-date">{release.date}</span>
                  </li>
                </ul>
              </div>
              {/* release content */}
              <div className="col-12 col-md-9 col-lg-10 pl-md-3 py-md-4 release-main-section float-left">
                <h2 className="release-header">
                  {release.emoji ? (
                    <span role="img" aria-label={release.emoji}>{`${
                      emojiMap[release.emoji]
                    } `}</span>
                  ) : null}
                  {release.label}
                </h2>
                <div className="release-content mb-3">
                  <div className="card mb-3">
                    <div className="card-body">
                      {currentView === 'internal' ? (
                        <p className="font-weight-bold">
                          Note: The data in this release is outdated and no
                          longer available for download from the Data Hub
                          portal. Please visit the{' '}
                          <Link to="/data-download">data download</Link> page for
                          the most up-to-date PASS1A and PASS1B data. Contact{' '}
                          <EmailLink
                            mailto="motrpac-data-requests@lists.stanford.edu"
                            label="MoTrPAC Data Requests"
                          />{' '}
                          if you need access to the data in this release.
                        </p>
                      ) : null}
                      <p className="release-description">
                        {release.description}
                      </p>
                      {currentView === 'external' ? (
                        <ReleaseDescFileExtract />
                      ) : null}
                      <ReleaseDescReadme
                        currentView={currentView}
                        fileLocation={release.readme_file_location}
                      />
                      {currentView === 'internal' &&
                      release.version === '2.0' ? (
                        <ReleaseDataTableInternalByPhase
                          release={release}
                          // eslint-disable-next-line react/jsx-no-bind
                          renderDataTypeRow={renderDataTypeRow}
                        />
                      ) : null}
                      {currentView === 'internal' &&
                      release.version.match(/1.0|1.1|1.2|1.2.1/g) ? (
                        <ReleaseDataTableInternal
                          release={release}
                          // eslint-disable-next-line react/jsx-no-bind
                          renderDataTypeRow={renderDataTypeRow}
                        />
                      ) : null}
                      {currentView === 'external' &&
                      release.version === '1.0' ? (
                        <ReleaseDataTableExternal
                          release={release}
                          // eslint-disable-next-line react/jsx-no-bind
                          renderDataTypeRow={renderDataTypeRow}
                        />
                      ) : null}
                      {renderModal()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <>
        {releases.length > 0 && currentView === 'internal' ? (
          <div className="release-data-status-info-container clearfix">
            <div className="d-none d-md-block col-12 col-md-3 col-lg-2 px-md-3 pb-1 pb-md-4 pt-md-4 float-left">
              <span>&nbsp;</span>
            </div>
            <div className="release-data-status-info pt-3 pb-4 col-12 col-md-9 col-lg-10 float-left">
              The data sets included in prior consortium releases on this page
              are now outdated. Please visit the{' '}
              <Link to="/data-download">data download</Link> page to view or
              download the most up-to-date PASS1B 6-month data. The up-to-date
              PASS1A/1C 6-month data will be soon made available to the
              consortium community. To learn more about the prior released data
              sets, please visit the{' '}
              <Link to="/announcements" className="inline-link">
                Announcements
              </Link>{' '}
              page. Contact the{' '}
              <EmailLink
                mailto="motrpac-helpdesk@lists.stanford.edu"
                label="MoTrPAC Helpdesk"
              />{' '}
              if you have any questions concerning the data in prior releases.
            </div>
          </div>
        ) : null}
        {entries}
        {releases.length > 0 && currentView === 'internal' ? (
          <div className="view-more-button-container pt-2 pt-md-0 pb-3 pb-md-0 clearfix">
            <div className="d-none d-md-block col-12 col-md-3 col-lg-2 px-md-3 pb-1 pb-md-4 pt-md-4 float-left">
              <span>&nbsp;</span>
            </div>
            <div className="view-more-button-wrapper mb-4 col-12 col-md-9 col-lg-10 float-left">
              <button
                type="button"
                className={
                  visibleReleases < 1 ? 'btn btn-secondary' : 'btn btn-danger'
                }
                onClick={toggleViewReleaseLength}
              >
                {visibleReleases < 1
                  ? 'Show prior releases'
                  : 'Back to latest release'}
              </button>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <div className="data-release-content-container border-top">
      {renderReleaseEntry()}
    </div>
  );
}

ReleaseEntry.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    user_metadata: PropTypes.object,
  }).isRequired,
  currentView: PropTypes.string.isRequired,
};

export default ReleaseEntry;
