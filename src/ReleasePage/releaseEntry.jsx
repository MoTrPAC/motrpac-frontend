import React, { useState } from 'react';

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
          <p className="card-text">Download description goes here.</p>
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
          <p className="card-text">Download description goes here.</p>
        </div>
      </div>
    );
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
                <h4 className="release-header"><span role="img" aria-label="rocket">🚀</span> {release.label}</h4>
                <div className="release-description mb-3">
                  <p>{release.description}</p>
                  <p className="mb-2">
                    <a
                      href={`http://storage.googleapis.com/${release.bucket_name}${release.object_path}`}
                      className="d-block d-flex align-items-center justify-content-start release-data-download-link"
                      download
                    >
                      <i className="material-icons release-data-download-icon">save_alt</i>
                      <span>Download experiment metadata and QC results</span>
                    </a>
                  </p>
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
                      <span>Raw files download access</span>
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
                      <span>QC intermediate files download access</span>
                    </p>
                    {renderIntermediateFilesDownloadSectionContent()}
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
