import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { TrackEvent } from '../GoogleAnalytics/googleAnalytics';
import IconSet from '../lib/iconSet';
import ToolTip from '../lib/ui/tooltip';
import ExternalLink from '../lib/ui/externalLink';
import StudyDocumentsTable from '../lib/studyDocumentsTable';
import ReleaseDescFileExtract from './releaseDescFileExtract';
import ReleaseDescReadme from './releaseDescReadme';
import ReleaseRawFilesDownload from './releaseRawFilesDownload';
import ReleaseDataTableInternalByPhase from './ReleaseDataTables/releaseDataTableInternalByPhase';
import ReleaseDataTableInternal from './ReleaseDataTables/releaseDataTableInternal';
import ReleaseDataTableExternal from './ReleaseDataTables/releaseDataTableExternal';

const releaseData = require('./releases');

const emojiMap = {
  rocket: '🚀',
  sparkles: '✨',
  zap: '⚡️',
  tada: '🎉',
  dna: '🧬',
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
  });
  const [visibleReleases, setVisibleReleases] = useState(2);

  const releases = releaseData.filter((release) => release.target === currentView);
  const userType = profile.user_metadata && profile.user_metadata.userType;

  // Event handler for "Show prior releases" button
  const toggleViewReleaseLength = (e) => {
    e.preventDefault();
    setVisibleReleases(visibleReleases === 2 ? releases.length : 2);
  };

  // Event handler for select/deselect checkboxes
  function handleCheckboxEvent(target) {
    const el = document.querySelector(`#${target}`);
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      el.innerHTML = 'check_box_outline_blank';
    } else {
      el.classList.add('active');
      el.innerHTML = 'check_box';
    }
  }

  // Render intermediate files download section content
  function renderIntermediateFilesDownloadSectionContent(files) {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <p className="card-text">
            Due to the large sizes of intermediate data files, we recommend users
            who wish to download intermediate files using the
            {' '}
            <ExternalLink to="https://cloud.google.com/storage/docs/quickstart-gsutil" label="gsutil command" />
            . Below are example commands for downloading intermediate files of different omics.
          </p>
          <p className="card-text">
            Intermediate files of genomics, epigenomics and transcriptomic:
            <code>{`gsutil -m cp -r gs://${files.get.bucket_name}/* .`}</code>
          </p>
          <p className="card-text">
            Intermediate files of metabolomics:
            <code>{`gsutil -m cp -r gs://${files.metabolomics.bucket_name}/* .`}</code>
          </p>
          <p className="card-text">
            Intermediate files of proteomics:
            <code>{`gsutil -m cp -r gs://${files.proteomics.bucket_name}/* .`}</code>
          </p>
        </div>
      </div>
    );
  }

  // Render tooltip content on copy-to-clipboard hover
  function renderTooltipContent(objectPath, data) {
    return (
      <div>
        <code id={data}>{`gsutil -m cp -r ${objectPath}`}</code>
        <span>Copy to clipboard</span>
      </div>
    );
  }

  // Handle 'copy to clipboard' click event
  function handleCopyClick(path, data) {
    const command = document.querySelector(`#${data}`).innerHTML;
    const tempInput = document.createElement('INPUT');
    document.body.appendChild(tempInput);
    tempInput.setAttribute('value', command);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  // Fetch file url from Google Storage API
  function fetchFile(bucket, filename) {
    return axios.get(`https://data-link-access.motrpac-data.org/${bucket}/${filename}`)
      .then((response) => {
        setFileUrl(response.data.url);
        setModalStatus({
          status: 'success',
          file: filename,
          message: 'Click this link to download the requested file.',
        });
        setFetching(false);
      }).catch((err) => {
        // eslint-disable-next-line no-console
        console.log(`${err.error}: ${err.errorDescription}`);
        setModalStatus({
          status: 'error',
          file: filename,
          message: 'Error occurred. Please close the dialog box and try again.',
        });
        setFetching(false);
      });
  }

  // Handle modal download button click event
  function handleGAEvent(releaseVersion) {
    TrackEvent(`Release ${releaseVersion} Downloads (${currentView})`, modalStatus.file, profile.user_metadata.name);
  }

  // Render modal message
  function renderModalMessage(releaseVersion) {
    if (modalStatus.status !== 'success') {
      return <span className="modal-message">{modalStatus.message}</span>;
    }

    return (
      <span className="modal-message">
        <a href={fileUrl} download onClick={handleGAEvent(releaseVersion)}>{modalStatus.message}</a>
      </span>
    );
  }

  // Render modal
  function renderModal(releaseVersion) {
    return (
      <div className="modal fade data-download-modal" id="dataDownloadModal" tabIndex="-1" role="dialog" aria-labelledby="dataDownloadModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">File Download</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!fetching
                ? renderModalMessage(releaseVersion) : <div className="loading-spinner"><img src={IconSet.Spinner} alt="" /></div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render data type row
  function renderDataTypeRow(bucket, item, version) {
    const objectPath = item.type === 'all' ? `gs://${bucket}/${item.object_zipfile} .` : `gs://${bucket}${item.object_path}/* .`;
    return (
      <tr key={`${item.type}-${version}`}>
        <td>
          <div className="d-flex align-items-center justify-content-start">
            <img src={IconSet[item.icon]} alt={item.icon_alt} />
            <span>{item.title}</span>
          </div>
        </td>
        {currentView === 'internal'
          ? (
            <td className="release-data-download-link">
              <div className="copy-to-clipboard-wrapper">
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <span
                  role="button"
                  tabIndex="-1"
                  className="copy-to-clipboard-button"
                  onClick={handleCopyClick.bind(this, objectPath, item.tooltip_id)}
                >
                  <i className="material-icons release-data-download-icon">file_copy</i>
                </span>
                <ToolTip
                  content={renderTooltipContent(objectPath, item.tooltip_id)}
                />
              </div>
            </td>
          )
          : null}
        {item.object_zipfile && item.object_zipfile.length
          ? (
            <td className="release-data-download-link">
              <button
                type="button"
                className="btn-data-download"
                data-toggle="modal"
                data-target=".data-download-modal"
                onClick={fetchFile.bind(this, bucket, item.object_zipfile)}
              >
                <i className="material-icons release-data-download-icon">save_alt</i>
              </button>
              <span className="file-size">{`(${item.object_zipfile_size})`}</span>
            </td>
          )
          : (
            <td><span>Not available</span></td>
          )}
      </tr>
    );
  }

  // Render individual release entry
  function renderReleaseEntry() {
    let entries;
    if (releases && releases.length) {
      // eslint-disable-next-line arrow-body-style
      entries = releases.slice(0, visibleReleases).map((release, idx) => {
        return (
          <div key={release.version} className={`release-entry-container ${currentView}`}>
            <div className="release-entry-item pt-2 pt-md-0 pb-3 pb-md-0 clearfix label-latest">
              {/* release timeline marker */}
              <div className="d-none d-md-block flex-wrap flex-items-center col-12 col-md-3 col-lg-2 px-md-3 pb-1 pb-md-4 pt-md-4 float-left text-md-right v-align-top release-timeline">
                {idx < 1
                  ? (
                    <div className="flex-auto flex-self-start">
                      <span className={`badge ${currentView === 'internal' ? 'badge-success' : 'badge-warning'}`}>Latest release</span>
                    </div>
                  )
                  : null}
                <ul className="d-none d-md-block mt-2 list-style-none">
                  <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                    <i className="material-icons release-version-marker-icon">local_offer</i>
                    <span className="release-version-marker">{`v${release.version}`}</span>
                  </li>
                  {userType === 'internal'
                    ? (
                      <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                        <i className="material-icons release-version-marker-icon">local_offer</i>
                        <span className="release-view">{currentView}</span>
                      </li>
                    )
                    : null}
                  <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                    <i className="material-icons release-date-marker-icon">calendar_today</i>
                    <span className="release-date">{release.date}</span>
                  </li>
                </ul>
              </div>
              {/* release content */}
              <div className="col-12 col-md-9 col-lg-10 pl-md-3 py-md-4 release-main-section float-left">
                <h2 className="release-header">
                  {release.emoji
                    ? (
                      <span role="img" aria-label={release.emoji}>{`${emojiMap[release.emoji]} `}</span>
                    )
                    : null}
                  {release.label}
                </h2>
                <div className="release-content mb-3">
                  <div className="card mb-3">
                    <div className="card-body">
                      <p className="release-description">{release.description}</p>
                      <ReleaseDescFileExtract currentView={currentView} />
                      <ReleaseDescReadme
                        releaseVersion={release.version}
                        fileLocation={release.readme_file_location}
                      />
                      {currentView === 'internal' && release.version === '2.0' ? (
                        <ReleaseDataTableInternalByPhase
                          release={release}
                          renderDataTypeRow={renderDataTypeRow}
                        />
                      ) : null}
                      {currentView === 'internal' && release.version.match(/1.0|1.1|1.2|1.2.1/g) ? (
                        <ReleaseDataTableInternal
                          release={release}
                          renderDataTypeRow={renderDataTypeRow}
                        />
                      ) : null}
                      {currentView === 'external' && release.version === '1.0' ? (
                        <ReleaseDataTableExternal
                          release={release}
                          renderDataTypeRow={renderDataTypeRow}
                        />
                      ) : null}
                      {renderModal(release.version)}
                    </div>
                  </div>
                  {currentView === 'internal' && release.raw_files
                    ? (
                      <>
                        <h6 className="additional-release-download-header">Additional Downloads</h6>
                        <div className="raw-files-download-section">
                          <p className="d-block mb-2 d-flex align-items-center justify-content-start raw-files-download-option">
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                            <i
                              role="button"
                              tabIndex="-1"
                              className="material-icons download-checkbox"
                              data-toggle="collapse"
                              data-target={`#raw-files-release-${idx}`}
                              aria-expanded="false"
                              aria-controls={`raw-files-release-${idx}`}
                              id={`raw-files-release-${idx}-checkbox`}
                              onClick={handleCheckboxEvent.bind(this, `raw-files-release-${idx}-checkbox`)}
                            >
                              check_box_outline_blank
                            </i>
                            <span>
                              Raw
                              {release.version.match(/1.0|1.1|1.2|1.2.1/g) ? null : ' and intermediate'}
                              {' '}
                              files downloads
                            </span>
                          </p>
                          <div className="collapse" id={`raw-files-release-${idx}`}>
                            <ReleaseRawFilesDownload
                              releaseVersion={release.version}
                              files={release.raw_files}
                            />
                          </div>
                        </div>
                        {release.version.match(/1.0|1.1|1.2|1.2.1/g) && (
                          <div className="intermediate-files-download-section">
                            <p className="d-block mb-2 d-flex align-items-center justify-content-start intermediate-files-download-option">
                              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                              <i
                                role="button"
                                tabIndex="-1"
                                className="material-icons download-checkbox"
                                data-toggle="collapse"
                                data-target={`#intermediate-files-release-${idx}`}
                                aria-expanded="false"
                                aria-controls={`intermediate-files-release-${idx}`}
                                id={`intermediate-files-release-${idx}-checkbox`}
                                onClick={handleCheckboxEvent.bind(this, `intermediate-files-release-${idx}-checkbox`)}
                              >
                                check_box_outline_blank
                              </i>
                              <span>Intermediate files downloads</span>
                            </p>
                            <div className="collapse" id={`intermediate-files-release-${idx}`}>
                              {renderIntermediateFilesDownloadSectionContent(
                                release.intermediate_files,
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )
                    : null}
                  {release.documentation
                    ? (
                      <>
                        <h6 className="additional-release-download-header">Documentation</h6>
                        <div className="release-documentation-section">
                          <StudyDocumentsTable />
                          {currentView === 'internal'
                            ? (
                              <p>
                                <ExternalLink
                                  to="https://www.motrpac.org/secure/documents/dspList.cfm?documentFolderCurrent=BEC8E9C5-C740-4D8F-91F2-5977E98CF6A0"
                                  label="Manuals of Procedures for Preclinical Animal Study Sites"
                                />
                                {' '}
                                (login required)
                              </p>
                            ) : null}
                        </div>
                      </>
                    )
                    : null}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }

    return (
      <>
        {entries}
        {releases.length > 1
          ? (
            <div className="view-more-button-container pt-2 pt-md-0 pb-3 pb-md-0 clearfix">
              <div className="d-none d-md-block col-12 col-md-3 col-lg-2 px-md-3 pb-1 pb-md-4 pt-md-4 float-left">
                <span>&nbsp;</span>
              </div>
              <div className="view-more-button-wrapper mb-4 col-12 col-md-9 col-lg-10 float-left">
                <button
                  type="button"
                  className={visibleReleases === 2 ? 'btn btn-secondary btn-sm' : 'btn btn-danger btn-sm'}
                  onClick={toggleViewReleaseLength}
                >
                  {visibleReleases === 2 ? 'Show prior releases' : 'Back to recent releases'}
                </button>
              </div>
            </div>
          )
          : null}
      </>
    );
  }

  return (
    <div className="data-release-content-container">
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
