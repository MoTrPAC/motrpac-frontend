import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DESIGN_MODIFIERS, KIND_LABELS, KIND_ORDER } from '../../lib/studyDataCards';
import { allVersions, visibleSeries } from '../../lib/studyDataAccess';
import CollectionActionButtons from './collectionActionButtons';
import CollectionLine from './collectionLine';
import KindChip from './kindChip';
import SeriesHeading from './seriesHeading';
import StageBadge from './stageBadge';

function VersionSeries({ series, userType, onBrowseFiles }) {
  const [showOlder, setShowOlder] = useState(false);
  const [latest, ...otherVersions] = series.versions;

  return (
    <div className="kind-cell-series">
      <SeriesHeading series={series} />
      <div className="kind-cell-latest-line d-flex align-items-center justify-content-between mt-2">
        <CollectionLine version={latest} latestLabel="Latest" />
        <StageBadge stage={latest.releaseStage} />
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
                <div key={version.storageLocation} className="other-version-list-item">
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

VersionSeries.propTypes = {
  series: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    versions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

/**
 * One family column. A kind can hold several independent series -- Human Main
 * Study's phenotype arrives as separate sub-collections, each with its own
 * versions -- so each gets its own latest and its own "other collections" list.
 * Collapsing them into one list would present c2.0 of one as a later version of
 * c1.0 of another.
 */
function KindCell({ kind, declared, series, userType, onBrowseFiles }) {
  if (series.length === 0) {
    // Two different reasons for an empty cell, and they must not read alike.
    // Nothing declared means the data does not exist yet. Something declared
    // but not visible to this user means it exists and is withheld -- saying
    // "in preparation" there is simply false.
    const withheld = declared.length > 0;
    const note = declared.find((version) => version.accessNote)?.accessNote;

    return (
      <div className="study-collection-kind-cell is-empty col px-4 py-3">
        <div className="kind-cell-label-wrapper d-flex align-items-center justify-content-between">
          <KindChip kind={kind} />
          <span className={`${withheld ? 'restricted-badge' : 'pending-badge'} badge badge-pill`}>
            {withheld ? 'Restricted' : 'Pending'}
          </span>
        </div>
        <p className="empty-msg text-muted mt-2 mb-0">
          {withheld
            ? note || `${KIND_LABELS[kind]} collections are not available for direct download.`
            : `${KIND_LABELS[kind]} results are in preparation — no released collections yet.`}
        </p>
      </div>
    );
  }

  return (
    <div className="study-collection-kind-cell col px-4 py-3">
      <div className="kind-cell-label-wrapper d-flex align-items-center justify-content-between">
        <KindChip kind={kind} />
      </div>
      {series.map((entry, index) => (
        <VersionSeries
          key={entry.name || `series-${index}`}
          series={entry}
          userType={userType}
          onBrowseFiles={onBrowseFiles}
        />
      ))}
    </div>
  );
}

KindCell.propTypes = {
  kind: PropTypes.oneOf(KIND_ORDER).isRequired,
  declared: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  series: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  userType: PropTypes.string,
  onBrowseFiles: PropTypes.func,
};

function StudyCollectionCard({ study, userType = undefined, onBrowseFiles = () => {} }) {
  const designModifier = DESIGN_MODIFIERS[study.studyDesign] || 'acute';

  // A missing `dataTypes` key means the kind does not apply to this card at all
  // -- the supporting human collections are phenotype-only and will never have
  // Quant-ID or Analysis. An empty array means the kind applies but has nothing
  // released yet, which renders as Pending. The two are deliberately different:
  // "not applicable" should not look like "coming soon".
  const applicableKinds = KIND_ORDER.filter((kind) => study.dataTypes[kind] !== undefined);

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
        {applicableKinds.map((kind) => (
          <KindCell
            key={kind}
            kind={kind}
            declared={allVersions(study.dataTypes[kind])}
            series={visibleSeries(study.dataTypes[kind], userType)}
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
