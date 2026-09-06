import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DESIGN_MODIFIERS } from '../../lib/studyDataCards';
import { orderedCollections } from '../../lib/bundleDataCards';
import BundleDownloadButton from './bundleDownloadButton';
import ExternalLink from '../../lib/ui/externalLink';

/**
 * One pre-bundled dataset, as a cell inside its card.
 *
 * Mirrors the collection cards' kind cells so bundles and collections read as
 * the same kind of thing. Some bundles ship a second file built against a newer
 * reference genome; both are offered rather than one being hidden behind the
 * other, because neither supersedes the other for a user who needs a specific
 * assembly.
 */
/**
 * One downloadable collection of a bundle.
 *
 * The size is not shown here: it is written into the bundle's description, so
 * the reader gets it in context rather than as a number under a button.
 */
function BundleCollection({ collection, profile }) {
  return (
    <div className="bundle-collection">
      <BundleDownloadButton
        bundlefile={collection.name}
        label={`Get Collection ${collection.collection}`}
        profile={profile}
      />
    </div>
  );
}

BundleCollection.propTypes = {
  collection: PropTypes.shape({
    collection: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({}).isRequired,
};

function BundleDatasetCell({ dataset, badgeFields, profile }) {
  const [showOlder, setShowOlder] = useState(false);
  const [latest, ...older] = orderedCollections(dataset);

  return (
    <div className="bundle-dataset-cell col d-flex flex-column px-4 py-3">
      <div className="bundle-dataset-info flex-grow-1">
        <div className="bundle-dataset-heading d-flex align-items-center">
          <span
            className="bundle-dataset-icon d-inline-flex align-items-center justify-content-center mr-2"
            aria-hidden="true"
          >
            <i className="material-icons">folder</i>
          </span>
          <h5 className="bundle-dataset-title mb-0">{dataset.title}</h5>
        </div>
        {badgeFields.length > 0 && (
          <div className="bundle-dataset-badges mt-2">
            {badgeFields.map((field) => (
              <span key={field} className="participant-badge badge badge-pill mr-1">
                {dataset[field]}
              </span>
            ))}
          </div>
        )}
        <p className="bundle-dataset-desc text-muted mt-2 mb-0">{dataset.description}</p>
      </div>
      <div className="bundle-dataset-actions d-flex flex-wrap justify-content-center mt-3">
        <BundleCollection collection={latest} profile={profile} />
      </div>
      {/* Older collections stay behind a toggle, as they do on the study
          collection cards, so a bundle leads with its current release. */}
      {older.length > 0 && (
        <div className="other-versions mt-2 text-center">
          <button
            type="button"
            className="btn btn-link btn-sm more-btn d-inline-flex align-items-center"
            aria-expanded={showOlder}
            onClick={() => setShowOlder(!showOlder)}
          >
            <span>Other versions</span>
            <span className="ml-1">({older.length})</span>
            <span className="material-icons ml-1" aria-hidden="true">
              {showOlder ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          {showOlder && (
            <div className="other-versions-list mt-2 rounded-lg p-3">
              <div className="earlier-collections-heading text-muted text-uppercase mb-2">
                Earlier collections
              </div>
              <div className="bundle-older-collections d-flex flex-wrap justify-content-center">
                {older.map((collection) => (
                  <BundleCollection
                    key={collection.name}
                    collection={collection}
                    profile={profile}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

BundleDatasetCell.propTypes = {
  badgeFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataset: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    participant_type: PropTypes.string,
    study_group: PropTypes.string,
    collections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  profile: PropTypes.shape({}).isRequired,
};

/**
 * Fields worth badging on each bundle: only those the card's bundles disagree
 * on. A cohort every bundle shares is already in the card's own title, so
 * repeating it on all seventeen rows is noise.
 */
function varyingFields(datasets, fields) {
  return fields.filter((field) => {
    const values = new Set(datasets.map((dataset) => dataset[field]).filter(Boolean));
    return values.size > 1;
  });
}

/** One bundle group, styled as a study collection card. */
function BundleDatasetCard({ card, profile = {} }) {
  const designModifier = DESIGN_MODIFIERS[card.studyDesign] || 'acute';
  const badgeFields = varyingFields(card.datasets, ['participant_type', 'study_group']);

  return (
    <div
      className={`study-collection-card bundle-dataset-card study-collection-card-${designModifier} rounded-lg shadow-sm w-100`}
    >
      <div className="study-collection-head">
        <div className="d-flex align-items-start justify-content-between">
          <div className="study-collection-identity">
            <h4 className="study-collection-name mb-1">{card.name}</h4>
            <div className="study-collection-code text-muted">
              <code>{card.code}</code>
              {card.cohort && <span className="ml-1">· {card.cohort}</span>}
              <span className="ml-1">
                · {card.datasets.length} {card.datasets.length === 1 ? 'bundle' : 'bundles'}
              </span>
            </div>
          </div>
          <div className="study-collection-badges text-right ml-3 d-flex align-items-center">
            <span className="species-badge badge badge-pill mr-1 d-inline-flex align-items-center">
              <span className="material-icons mr-1">{card.icon}</span>
              <span className="text-uppercase">{card.species}</span>
            </span>
            {card.studyDesign && (
              <span className={`design-badge design-badge-${designModifier} badge badge-pill`}>
                {card.studyDesign}
              </span>
            )}
          </div>
        </div>
        <p className="study-collection-desc text-muted mt-3 mb-0">{card.description}</p>
      </div>
      <div className="bundle-dataset-row row no-gutters row-cols-1 row-cols-lg-2">
        {card.datasets.map((dataset) => (
          <BundleDatasetCell
            key={dataset.title}
            dataset={dataset}
            badgeFields={badgeFields}
            profile={profile}
          />
        ))}
      </div>
      {card.notice && (
        <div className="bundle-dataset-notice bd-callout bd-callout-primary m-3">
          <span className="font-weight-normal">
            <i className={`bi ${card.notice.icon} mr-2 text-primary bundle-dataset-notice-icon`} />
            <span>
              {card.notice.before}
              {/* ExternalLink keeps target/rel correct by construction and gives
                  both notices the same external-link affordance. */}
              <ExternalLink to={card.notice.href} label={card.notice.linkText} />
              {card.notice.after}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

BundleDatasetCard.propTypes = {
  card: PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    cohort: PropTypes.string,
    studyDesign: PropTypes.string,
    description: PropTypes.string.isRequired,
    notice: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      before: PropTypes.string,
      linkText: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      after: PropTypes.string,
    }),
    datasets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  profile: PropTypes.shape({}),
};

export default BundleDatasetCard;
