import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { KIND_LABELS, KIND_ORDER } from '../../lib/studyDataCards';
import { visibleVersions } from '../../lib/studyDataAccess';

const STAGE_LABELS = {
  public: 'Public',
  consortium: 'Consortium',
};

function CollectionActionButtons({ storageLocation, userType, onBrowseFiles = () => {} }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="kind-cell-actions mt-3">
      <div className="kind-cell-action-button-wrapper d-flex align-items-center">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => onBrowseFiles()}
        >
          Browse Files
        </button>
        {userType === 'internal' && (
          <button
            type="button"
            className="btn btn-secondary btn-sm gcs-toggle ml-2"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            GCP Storage
          </button>
        )}
      </div>
      {expanded && (
        <div className="gcs-path-wrapper mt-2 border rounded-lg p-3 bg-light">
          <code className="gcs-path font-monospace text-break d-block border rounded-lg p-2 bg-white" title={storageLocation}>
            {storageLocation}
          </code>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary mt-3"
            onClick={() => navigator.clipboard.writeText(storageLocation)}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

CollectionActionButtons.propTypes = {
  storageLocation: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  onBrowseFiles: PropTypes.func,
};

function KindCell({ kind, versions, userType }) {
  if (versions.length === 0) {
    return (
      <div className="study-collection-kind-cell is-empty">
        <div className="kind-cell-label">{KIND_LABELS[kind]}</div>
        <p className="empty-msg text-muted">No {KIND_LABELS[kind]} data</p>
      </div>
    );
  }

  const [latest, ...otherVersions] = versions;
  const [showOlder, setShowOlder] = useState(false);

  return (
    <div className="study-collection-kind-cell col px-4 mt-3">
      <div className="kind-cell-label-wrapper d-flex align-items-center justify-content-between">
        <div className="kind-cell-label font-weight-bold text-dark">{KIND_LABELS[kind]}</div>
        <div className="kind-cell-release-stage text-muted">
          <span className="badge badge-pill badge-success py-1 px-2">{STAGE_LABELS[latest.releaseStage]}</span>
        </div>
      </div>
      <div className="collection-info-row d-flex align-items-center">
        <span className="collection-label text-muted mr-1">Collection:</span>
        <span className="collection-version font-weight-bold mr-2">{latest.collection}</span>
        {latest.referenceGenome && (
          <span className="badge badge-pill badge-secondary py-1 px-2 mr-2">{latest.referenceGenome}</span>
        )}
        <span className="latest-tag text-muted">Latest</span>
      </div>
      <CollectionActionButtons storageLocation={latest.storageLocation} userType={userType} />
      {otherVersions.length > 0 && (
        <div className="other-versions mt-3">
          <button
            type="button"
            className="btn btn-link btn-sm more-btn d-flex align-items-center"
            aria-expanded={showOlder}
            onClick={() => setShowOlder(!showOlder)}
          >
            <span>Other collections</span>
            <span className="ml-1">({otherVersions.length})</span>
            <span className="material-icons ml-1">{showOlder ? 'expand_less' : 'expand_more'}</span>
          </button>
          {showOlder && (
            <div className="other-versions-list mt-2 border rounded-lg p-3 bg-light">
              {otherVersions.map((version) => (
                <div key={version.collection} className="other-version-list-item">
                  <div className="collection-info-row d-flex align-items-center">
                    <span className="collection-label text-muted mr-1">Collection:</span>
                    <span className="font-weight-bold mr-2">{version.collection}</span>
                    {version.referenceGenome && (
                      <span className="badge badge-pill badge-secondary py-1 px-2 mr-2">{version.referenceGenome}</span>
                    )}
                    <span className="badge badge-pill badge-success py-1 px-2">
                      {STAGE_LABELS[version.releaseStage]}
                    </span>
                  </div>
                  <CollectionActionButtons storageLocation={version.storageLocation} userType={userType} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

KindCell.propTypes = {
  kind: PropTypes.oneOf(KIND_ORDER).isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      collection: PropTypes.string.isRequired,
      referenceGenome: PropTypes.string,
      storageLocation: PropTypes.string.isRequired,
      releaseStage: PropTypes.oneOf(Object.keys(STAGE_LABELS)).isRequired,
    })
  ).isRequired,
  userType: PropTypes.string,
};

function StudyCollectionCard({ study, userType = undefined }) {
  return (
    <div className="study-collection-card bd-callout bd-callout-info rounded-lg shadow-sm w-100">
      <div className="study-collection-head">
        <div className="study-collection-header-row d-flex align-items-center justify-content-between">
          <h4 className="study-collection-name text-dark">{study.name}</h4>
          <div className="study-collection-icon-badge badge badge-pill badge-warning">
            <span className="material-icons study-collection-icon">{study.icon}</span>
          </div>
        </div>
        <div className="study-collection-badges">
          <span className="badge badge-pill badge-info mr-1 py-1 px-2">{study.studyDesign}</span>
          <span className="badge badge-pill badge-info mr-1 py-1 px-2">{study.cohort}</span>
        </div>
        <p className="study-collection-desc text-muted mt-3">{study.description}</p>
      </div>
      <div className="study-collection-kind-row d-flex mt-3 border-top">
        {KIND_ORDER.map((kind) => (
          <KindCell
            key={kind}
            kind={kind}
            versions={visibleVersions(study.dataTypes[kind] || [], userType)}
            userType={userType}
          />
        ))}
      </div>
    </div>
  );
}

StudyCollectionCard.propTypes = {
  study: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    studyDesign: PropTypes.string,
    cohort: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dataTypes: PropTypes.shape({}).isRequired,
  }).isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

export default StudyCollectionCard;
