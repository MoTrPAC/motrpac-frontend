import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { KIND_ORDER, STAGE_CODES, STAGE_LABELS } from '../../lib/studyDataCards';
import CollectionActionButtons from './collectionActionButtons';
import CollectionLine from './collectionLine';
import KindChip from './kindChip';

const STAGE_SECTIONS = [
  {
    key: 'public',
    name: 'Public Release',
    description:
      'Available to the research community through the public Data Hub and Google Cloud, subject to any study-specific access controls.',
  },
  {
    key: 'consortium',
    name: 'Consortium Release',
    description:
      'Coordinated release for authorized MoTrPAC consortium users, through the Data Hub and Google Cloud.',
  },
];

const DESIGN_MODIFIERS = {
  'Acute exercise': 'acute',
  'Endurance training': 'endurance',
};

/**
 * Release stage is a property of a collection, not of a study, so one study can
 * appear under more than one stage - rat-training-06 Quant-ID is public at c1.0
 * and c2.0, and consortium-only at c3.0. Each row therefore lists only the kinds
 * that actually have a collection at the stage being rendered.
 */
function studyRowsForStage(studies, stage) {
  return studies
    .map((study) => ({
      study,
      kinds: KIND_ORDER.map((kind) => ({
        kind,
        versions: (study.dataTypes[kind] || []).filter(
          (version) => version.releaseStage === stage
        ),
      })).filter(({ versions }) => versions.length > 0),
    }))
    .filter(({ kinds }) => kinds.length > 0);
}

function collectionCount(rows) {
  return rows.reduce(
    (total, { kinds }) =>
      total + kinds.reduce((subtotal, { versions }) => subtotal + versions.length, 0),
    0
  );
}

function ReleaseCollectionItem({ kind, versions, stageCode, userType, onBrowseFiles }) {
  const [latest, ...earlier] = versions;
  const [showEarlier, setShowEarlier] = useState(false);

  return (
    <div className="data-release-kind-cell h-100 rounded-lg p-3">
      <KindChip kind={kind} />
      <div className="mt-2">
        <CollectionLine version={latest} latestLabel={`Latest ${stageCode}`} />
      </div>
      <CollectionActionButtons
        storageLocation={latest.storageLocation}
        userType={userType}
        onBrowseFiles={onBrowseFiles}
      />
      {earlier.length > 0 && (
        <div className="other-versions mt-3">
          <button
            type="button"
            className="btn btn-link btn-sm more-btn d-flex align-items-center"
            aria-expanded={showEarlier}
            onClick={() => setShowEarlier(!showEarlier)}
          >
            <span>Other collections</span>
            <span className="ml-1">({earlier.length})</span>
            <span className="material-icons ml-1">
              {showEarlier ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {showEarlier && (
            <div className="other-versions-list mt-2 rounded-lg p-3">
              <div className="earlier-collections-heading text-muted text-uppercase mb-2">
                Earlier {stageCode} collections
              </div>
              {earlier.map((version) => (
                <div key={version.collection} className="other-version-list-item">
                  <CollectionLine version={version} />
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

ReleaseCollectionItem.propTypes = {
  kind: PropTypes.oneOf(KIND_ORDER).isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      collection: PropTypes.string.isRequired,
      referenceGenome: PropTypes.string,
      storageLocation: PropTypes.string.isRequired,
      releaseStage: PropTypes.oneOf(Object.keys(STAGE_LABELS)).isRequired,
    })
  ).isRequired,
  stageCode: PropTypes.string.isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

function ReleaseStudyRow({ study, kinds, stageCode, userType, onBrowseFiles }) {
  return (
    <div className="data-release-study-row row no-gutters">
      <div className="data-release-study col-12 col-lg-3 pr-lg-4">
        <h5 className="data-release-study-name mb-1">{study.name}</h5>
        <div className="data-release-study-code text-muted mb-2">
          <code>{study.code}</code>
          {study.cohort ? ` · ${study.cohort}` : ''}
        </div>
        <div className="data-release-study-badges mb-3">
          <span className="species-badge badge badge-pill mr-1 d-inline-flex align-items-center">
            <span className="material-icons mr-1">{study.icon}</span>
            <span className="text-uppercase">{study.species}</span>
          </span>
          {study.studyDesign && (
            <span
              className={`design-badge design-badge-${DESIGN_MODIFIERS[study.studyDesign] || 'acute'} badge badge-pill`}
            >
              {study.studyDesign}
            </span>
          )}
        </div>
      </div>
      <div className="data-release-kind-row col-12 col-lg-9">
        <div className="row no-gutters">
          {kinds.map(({ kind, versions }) => (
            <div key={kind} className="col-12 col-xl-4 p-1">
              <ReleaseCollectionItem
                kind={kind}
                versions={versions}
                stageCode={stageCode}
                userType={userType}
                onBrowseFiles={onBrowseFiles}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReleaseStudyRow.propTypes = {
  study: PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    cohort: PropTypes.string,
    studyDesign: PropTypes.string,
  }).isRequired,
  kinds: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  stageCode: PropTypes.string.isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

function DataReleaseCards({ studies, userType = undefined, onBrowseFiles = () => {} }) {
  // Consortium collections are never rendered for external or anonymous users -
  // the whole section is absent rather than empty.
  const sections = STAGE_SECTIONS.filter(
    (section) => section.key === 'public' || userType === 'internal'
  );

  return (
    <div className="data-releases-panel">
      {sections.map((section) => {
        const rows = studyRowsForStage(studies, section.key);
        const count = collectionCount(rows);

        return (
          <section
            key={section.key}
            className={`data-release-section data-release-section-${section.key} rounded-lg shadow-sm`}
            aria-labelledby={`release-stage-${section.key}`}
          >
            <header className="data-release-head d-flex align-items-start justify-content-between">
              <div className="d-flex align-items-center">
                <span
                  className={`data-release-icon-badge data-release-icon-badge-${section.key} d-inline-flex align-items-center justify-content-center`}
                  aria-hidden="true"
                >
                  {STAGE_CODES[section.key]}
                </span>
                <div className="ml-3">
                  <h4 id={`release-stage-${section.key}`} className="data-release-name mb-0">
                    {section.name}
                  </h4>
                  <p className="data-release-desc text-muted mb-0 mt-1">{section.description}</p>
                </div>
              </div>
              <span className="data-release-count text-muted text-nowrap ml-3">
                {count} {count === 1 ? 'collection' : 'collections'}
              </span>
            </header>
            {rows.length === 0 ? (
              <p className="text-muted mb-0 px-3 pb-3">No collections at this release stage.</p>
            ) : (
              rows.map(({ study, kinds }) => (
                <ReleaseStudyRow
                  key={study.code}
                  study={study}
                  kinds={kinds}
                  stageCode={STAGE_CODES[section.key]}
                  userType={userType}
                  onBrowseFiles={() => onBrowseFiles(study)}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}

DataReleaseCards.propTypes = {
  studies: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

export default DataReleaseCards;
