import React, { useState } from 'react';
import { TrackEvent } from '../GoogleAnalytics/googleAnalytics';
import IconSet from '../lib/iconSet';
import ToolTip from '../lib/ui/tooltip';

const releases = require('./releases');

/**
 * Renders UIs for individual release items
 *
 * @returns {object} JSX representation of each data release item.
 */
function ReleaseEntry() {
  const [rawSelected, setRawSelected] = useState(false);
  const [intermediateSelected, setIntermediateSelected] = useState(false);

  // Event handler for select/deselect checkboxes
  function handleCheckboxEvent(target) {
    if (target === 'raw') {
      setRawSelected(!rawSelected);
    }
    if (target === 'intermediate') {
      setIntermediateSelected(!intermediateSelected);
    }
  }

  // Render each set of experiment data
  function renderExperimentSet(item) {
    return (
      <div className="card mb-3">
        <h5 className="card-header">{item.name}</h5>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm table-striped release-1-rrbs-table">
              <thead className="thead-dark">
                <tr className="table-head">
                  <th scope="col" className="col-files">Files</th>
                  <th scope="col" className="col-type">Type</th>
                  <th scope="col" className="col-filetype">Filetype</th>
                  <th scope="col" className="col-description">Description</th>
                  <th scope="col" className="col-locations">Locations</th>
                </tr>
              </thead>
              <tbody>
                {item.objects.map((object) => {
                  return (
                    <tr>
                      <td><code>{object.files}</code></td>
                      <td>{object.type}</td>
                      <td>{object.filetype}</td>
                      <td>{object.definition}</td>
                      <td><code>{object.locations.join(', ')}</code></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Render raw files download section content
  function renderRawFilesDownloadSectionContent() {
    if (!rawSelected) return null;

    return (
      <div className="card mb-3">
        <div className="card-body">
          <p className="card-text">
            Due to the large sizes of raw data files, we recommend users
            who wish to download raw data files using the&nbsp;
            <a
              href="https://cloud.google.com/storage/docs/quickstart-gsutil"
              className="inline-link-with-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              gsutil command
              <i className="material-icons external-linkout-icon">open_in_new</i>
            </a>
            . Below are example commands for downloading raw data files of different omics.
          </p>
          <p className="card-text">
            Raw data files of genomics, epigenomics and transcriptomic:
            <code>gsutil -m cp -r gs://motrpac-internal-release1-raw-get/* .</code>
          </p>
          <p className="card-text">
            Raw data files of metabolomics:
            <code>gsutil -m cp -r gs://motrpac-internal-release1-raw-metabolomics/* .</code>
          </p>
          <p className="card-text">
            Raw data files of proteomics:
            <code>gsutil -m cp -r gs://motrpac-internal-release1-raw-proteomics/* .</code>
          </p>
        </div>
      </div>
    );
  }

  // Render intermediate files download section content
  function renderIntermediateFilesDownloadSectionContent() {
    if (!intermediateSelected) return null;

    return (
      <div className="card mb-3">
        <div className="card-body">
          <p className="card-text">
            Due to the large sizes of intermediate data files, we recommend users
            who wish to download intermediate files using the&nbsp;
            <a
              href="https://cloud.google.com/storage/docs/quickstart-gsutil"
              className="inline-link-with-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              gsutil command
              <i className="material-icons external-linkout-icon">open_in_new</i>
            </a>
            . Below are example commands for downloading intermediate files of different omics.
          </p>
          <p className="card-text">
            Intermediate files of genomics, epigenomics and transcriptomic:
            <code>gsutil -m cp -r gs://motrpac-internal-release1-intermediate-get/* .</code>
          </p>
          <p className="card-text">
            Intermediate files of metabolomics:
            <code>gsutil -m cp -r gs://motrpac-internal-release1-intermediate-metabolomics/* .</code>
          </p>
          <p className="card-text">
            Intermediate files of proteomics:
            <code>gsutil -m cp -r gs://motrpac-internal-release1-intermediate-proteomics/* .</code>
          </p>
        </div>
      </div>
    );
  }

  // Render tooltip content on copy-to-clipboard hover
  function renderTooltipContent(path, data) {
    return (
      <div>
        <code id={data}>{`gsutil -m cp -r ${path}`}</code>
        <span>Copy to clipboard</span>
      </div>
    );
  }

  function handleCopyClick(path, data) {
    const command = document.querySelector(`#${data}`).innerHTML;
    const tempInput = document.createElement('INPUT');
    document.body.appendChild(tempInput);
    tempInput.setAttribute('value', command);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  // Render individual release entry
  function renderReleaseEntry() {
    let entries;
    if (releases && releases.length) {
      entries = releases.map((release, idx) => {
        return (
          <div key={release.version} className="release-entry-container">
            <div className="release-entry-item pt-2 pt-md-0 pb-3 pb-md-0 clearfix label-latest">
              {/* release timeline marker */}
              <div className="d-none d-md-block flex-wrap flex-items-center col-12 col-md-3 col-lg-2 px-md-3 pb-1 pb-md-4 pt-md-4 float-left text-md-right v-align-top release-timeline">
                {idx < 1
                  ? (
                    <div className="flex-auto flex-self-start">
                      <span className="badge badge-success">Latest release</span>
                    </div>
                  )
                  : null}
                <ul className="d-none d-md-block mt-2 list-style-none">
                  <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                    <i className="material-icons release-version-marker-icon">local_offer</i>
                    <span className="release-version-marker">{`v${release.version}`}</span>
                  </li>
                  <li className="d-block mb-1 d-flex align-items-center justify-content-end">
                    <i className="material-icons release-date-marker-icon">calendar_today</i>
                    <span className="release-date">{release.date}</span>
                  </li>
                </ul>
              </div>
              {/* release content */}
              <div className="col-12 col-md-9 col-lg-10 pl-md-3 py-md-4 release-main-section float-left">
                <h2 className="release-header"><span role="img" aria-label="rocket">🚀</span> {release.label}</h2>
                <div className="release-content mb-3">
                  <div className="card mb-3">
                    <div className="card-body">
                      <p className="release-description">{release.description}</p>
                      <p className="release-description">
                        A&nbsp;
                        <a
                          href="https://docs.google.com/document/d/1l-RtUNQr-FtC0aYe6rUXgJb_i5ZeWQiLp9nEjCl0QOk/"
                          className="inline-link-with-icon"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          README
                          <i className="material-icons readme-file-icon">description</i>
                        </a>
                        &nbsp;document has been provided detailing the different data types available
                        in this release in addition to how to access them. For any technical
                        issues, please contact us at&nbsp;
                        <a href="mailto:motrpac-helpdesk@lists.stanford.edu" className="inline-link-with-icon">
                          motrpac-helpdesk@lists.stanford.edu
                          <i className="material-icons email-icon">mail</i>
                        </a>
                      </p>
                      <table className="table table-sm release-data-links-table">
                        <thead className="thead-dark">
                          <tr className="table-head">
                            <th>Data type</th>
                            <th>Command-line download</th>
                            <th>Web download</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center justify-content-start">
                                <img src={IconSet.DNA} alt="Genomic" />
                                <span>RNA-seq data (metadata, QC and results)</span>
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <div className="copy-to-clipboard-wrapper">
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                                <span
                                  role="button"
                                  tabIndex="-1"
                                  className="copy-to-clipboard-button"
                                  onClick={handleCopyClick.bind(this, 'gs://motrpac-internal-release1-results/rna-seq/* .', 'data-rna-seq')}
                                >
                                  <i className="material-icons release-data-download-icon">file_copy</i>
                                </span>
                                <ToolTip
                                  content={renderTooltipContent('gs://motrpac-internal-release1-results/rna-seq/* .', 'data-rna-seq')}
                                />
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <a
                                href={`http://storage.googleapis.com/${release.bucket_name}${release.object_path}`}
                                onClick={() => TrackEvent('Release 1 Data', 'Download', 'RNA-seq')}
                                download
                              >
                                <i className="material-icons release-data-download-icon">save_alt</i>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center justify-content-start">
                                <img src={IconSet.DNA} alt="Genomic" />
                                <span>RRBS data (metadata, QC and results)</span>
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <div className="copy-to-clipboard-wrapper">
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                                <span
                                  role="button"
                                  tabIndex="-1"
                                  className="copy-to-clipboard-button"
                                  onClick={handleCopyClick.bind(this, 'gs://motrpac-internal-release1-results/rrbs/* .', 'data-rrbs')}
                                >
                                  <i className="material-icons release-data-download-icon">file_copy</i>
                                </span>
                                <ToolTip
                                  content={renderTooltipContent('gs://motrpac-internal-release1-results/rrbs/* .', 'data-rrbs')}
                                />
                              </div>
                            </td>
                            <td><span>Not available</span></td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center justify-content-start">
                                <img src={IconSet.Metabolite} alt="Genomic" />
                                <span>Metabolomics data (metadata, QC and results)</span>
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <div className="copy-to-clipboard-wrapper">
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                                <span
                                  role="button"
                                  tabIndex="-1"
                                  className="copy-to-clipboard-button"
                                  onClick={handleCopyClick.bind(this, 'gs://motrpac-internal-release1-results/metabolomics/* .', 'data-metabolomics')}
                                >
                                  <i className="material-icons release-data-download-icon">file_copy</i>
                                </span>
                                <ToolTip
                                  content={renderTooltipContent('gs://motrpac-internal-release1-results/metabolomics/* .', 'data-metabolomics')}
                                />
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <a
                                href={`http://storage.googleapis.com/${release.bucket_name}${release.object_path}`}
                                onClick={() => TrackEvent('Release 1 Data', 'Download', 'Metabolomics')}
                                download
                              >
                                <i className="material-icons release-data-download-icon">save_alt</i>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center justify-content-start">
                                <img src={IconSet.Protein} alt="Genomic" />
                                <span>Proteomics data (metadata, QC and results)</span>
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <div className="copy-to-clipboard-wrapper">
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                                <span
                                  role="button"
                                  tabIndex="-1"
                                  className="copy-to-clipboard-button"
                                  onClick={handleCopyClick.bind(this, 'gs://motrpac-internal-release1-results/proteomics/* .', 'data-proteomics')}
                                >
                                  <i className="material-icons release-data-download-icon">file_copy</i>
                                </span>
                                <ToolTip
                                  content={renderTooltipContent('gs://motrpac-internal-release1-results/proteomics/* .', 'data-proteomics')}
                                />
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <a
                                href={`http://storage.googleapis.com/${release.bucket_name}${release.object_path}`}
                                onClick={() => TrackEvent('Release 1 Data', 'Download', 'Proteomics')}
                                download
                              >
                                <i className="material-icons release-data-download-icon">save_alt</i>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center justify-content-start">
                                <img src={IconSet.Gender} alt="Genomic" />
                                <span>Phenotypic data</span>
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <div className="copy-to-clipboard-wrapper">
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                                <span
                                  role="button"
                                  tabIndex="-1"
                                  className="copy-to-clipboard-button"
                                  onClick={handleCopyClick.bind(this, 'gs://motrpac-internal-release1-results/phenotype/* .', 'data-phenotypic')}
                                >
                                  <i className="material-icons release-data-download-icon">file_copy</i>
                                </span>
                                <ToolTip
                                  content={renderTooltipContent('gs://motrpac-internal-release1-results/phenotype/* .', 'data-phenotypic')}
                                />
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <a
                                href={`http://storage.googleapis.com/${release.bucket_name}${release.object_path}`}
                                onClick={() => TrackEvent('Release 1 Data', 'Download', 'Phenotypic data')}
                                download
                              >
                                <i className="material-icons release-data-download-icon">save_alt</i>
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center justify-content-start">
                                <img src={IconSet.Globe} alt="Genomic" />
                                <span>All of the omics and phenotypic data</span>
                              </div>
                            </td>
                            <td className="release-data-download-link">
                              <div className="copy-to-clipboard-wrapper">
                                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                                <span
                                  role="button"
                                  tabIndex="-1"
                                  className="copy-to-clipboard-button"
                                  onClick={handleCopyClick.bind(this, 'gs://motrpac-internal-release1-results/* .', 'data-all')}
                                >
                                  <i className="material-icons release-data-download-icon">file_copy</i>
                                </span>
                                <ToolTip
                                  content={renderTooltipContent('gs://motrpac-internal-release1-results/* .', 'data-all')}
                                />
                              </div>
                            </td>
                            <td><span>Not available</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <h6 className="additional-release-download-header">Additional Downloads</h6>
                  <div className="raw-files-download-section">
                    <p className="d-block mb-2 d-flex align-items-center justify-content-start raw-files-download-option">
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                      <i
                        role="button"
                        tabIndex="-1"
                        className="material-icons download-checkbox"
                        onClick={handleCheckboxEvent.bind(this, 'raw')}
                      >
                        {rawSelected ? 'check_box' : 'check_box_outline_blank'}
                      </i>
                      <span>Raw files downloads</span>
                    </p>
                    {renderRawFilesDownloadSectionContent()}
                  </div>
                  <div className="intermediate-files-download-section">
                    <p className="d-block mb-2 d-flex align-items-center justify-content-start intermediate-files-download-option">
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                      <i
                        role="button"
                        tabIndex="-1"
                        className="material-icons download-checkbox"
                        onClick={handleCheckboxEvent.bind(this, 'intermediate')}
                      >
                        {intermediateSelected ? 'check_box' : 'check_box_outline_blank'}
                      </i>
                      <span>Intermediate files downloads</span>
                    </p>
                    {renderIntermediateFilesDownloadSectionContent()}
                  </div>
                  <h6 className="additional-release-download-header">Documentation</h6>
                  <div className="release-documentation-section">
                    <p>
                      <a
                        href="https://www.motrpac.org/secure/documents/dspList.cfm?documentFolderCurrent=BEC8E9C5-C740-4D8F-91F2-5977E98CF6A0"
                        className="inline-link-with-icon"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Manuals of Procedures for Preclinical Animal Study Sites
                        <i className="material-icons external-linkout-icon">open_in_new</i>
                      </a>
                      &nbsp;(login required)
                    </p>
                  </div>
                </div>
                {/* release.experiments.map(item => renderExperimentSet(item)) */}
              </div>
            </div>
          </div>
        );
      });
    }

    return entries;
  }

  return (
    <div className="data-release-content-container">
      {renderReleaseEntry()}
    </div>
  );
}

export default ReleaseEntry;
