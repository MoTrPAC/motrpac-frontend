import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { KIND_LABELS, KIND_ORDER } from '../../lib/studyDataCards';
import { visibleVersions } from '../../lib/studyDataAccess';
import CollectionActionButtons from './collectionActionButtons';
import CollectionLine from './collectionLine';
import KindChip from './kindChip';
import StageBadge from './stageBadge';

const DESIGN_MODIFIERS = {
  'Acute exercise': 'acute',
  'Endurance training': 'endurance',
};

function KindCell({ kind, versions, userType, onBrowseFiles }) {
  const [showOlder, setShowOlder] = useState(false);

  if (versions.length === 0) {
    return (
      <div className="study-collection-kind-cell is-empty col px-4 py-3">
        <KindChip kind={kind} />
        <p className="empty-msg text-muted mt-2 mb-0">
          No {KIND_LABELS[kind]} collections available.
        </p>
      </div>
    );
  }

  const [latest, ...otherVersions] = versions;

  return (
    <div className="study-collection-kind-cell col px-4 py-3">
      <div className="kind-cell-label-wrapper d-flex align-items-center justify-content-between">
        <KindChip kind={kind} />
        <StageBadge stage={latest.releaseStage} />
      </div>
      <div className="mt-2">
        <CollectionLine version={latest} latestLabel="Latest" />
      </div>
      <CollectionActionButtons
        storageLocation={latest.storageLocation}
        userType={userType}
        onBrowseFiles={onBrowseFiles}
      />
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
            <span className="material-icons ml-1">
              {showOlder ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {showOlder && (
            <div className="other-versions-list mt-2 rounded-lg p-3">
              <div className="earlier-collections-heading text-muted text-uppercase mb-2">
                Earlier collections
              </div>
              {otherVersions.map((version) => (
                <div key={version.collection} className="other-version-list-item">
                  <CollectionLine version={version} showStage />
                  <CollectionActionButtons
                    storageLocation={version.storageLocation}
                    userType={userType}
                    onBrowseFiles={onBrowseFiles}
                  />
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
  versions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

function StudyCollectionCard({ study, userType = undefined, onBrowseFiles = () => {} }) {
  const designModifier = DESIGN_MODIFIERS[study.studyDesign] || 'acute';

  return (
    <div
      className={`study-collection-card study-collection-card-${designModifier} rounded-lg shadow-sm w-100`}
    >
      <div className="study-collection-head">
        <div className="d-flex align-items-start justify-content-between">
          <div className="study-collection-identity">
            <h4 className="study-collection-name mb-1">{study.name}</h4>
            <div className="study-collection-code text-muted">
              <code>{study.code}</code>
              {study.cohort && <span className="ml-1">· {study.cohort}</span>}
            </div>
          </div>
          <div className="study-collection-badges text-right ml-3 d-flex align-items-center">
            <span className="species-badge badge badge-pill mr-1 d-inline-flex align-items-center">
              <span className="material-icons mr-1">{study.icon}</span>
              <span className="text-uppercase">{study.species}</span>
            </span>
            {study.studyDesign && (
              <span
                className={`design-badge design-badge-${designModifier} badge badge-pill`}
              >
                {study.studyDesign}
              </span>
            )}
          </div>
        </div>
        <p className="study-collection-desc text-muted mt-3 mb-0">{study.description}</p>
      </div>
      <div className="study-collection-kind-row row no-gutters">
        {KIND_ORDER.map((kind) => (
          <KindCell
            key={kind}
            kind={kind}
            versions={visibleVersions(study.dataTypes[kind] || [], userType)}
            userType={userType}
            onBrowseFiles={onBrowseFiles}
          />
        ))}
      </div>
    </div>
  );
}

StudyCollectionCard.propTypes = {
  study: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    studyDesign: PropTypes.string,
    cohort: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dataTypes: PropTypes.shape({}).isRequired,
  }).isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

export default StudyCollectionCard;
