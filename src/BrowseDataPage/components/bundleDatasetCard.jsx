import React from 'react';
import PropTypes from 'prop-types';
import { DESIGN_MODIFIERS } from '../../lib/studyDataCards';
import BundleDownloadButton from './bundleDownloadButton';

/**
 * One pre-bundled dataset, as a cell inside its card.
 *
 * Mirrors the collection cards' kind cells so bundles and collections read as
 * the same kind of thing. Some bundles ship a second file built against a newer
 * reference genome; both are offered rather than one being hidden behind the
 * other, because neither supersedes the other for a user who needs a specific
 * assembly.
 */
function BundleDatasetCell({ dataset, badgeFields, profile }) {
  return (
    <div className="bundle-dataset-cell col d-flex flex-column px-4 py-3">
      <div className="bundle-dataset-info flex-grow-1">
        <div className="bundle-dataset-heading d-flex align-items-center">
          <span
            className="bundle-dataset-icon d-inline-flex align-items-center justify-content-center mr-2"
            aria-hidden="true"
          >
            <i className="material-icons">cloud_download</i>
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
      {/* Below the description, centred. Two builds sit side by side and wrap
          if the column is too narrow for both. */}
      <div className="bundle-dataset-actions d-flex flex-wrap justify-content-center mt-3">
        <BundleDownloadButton
          bundlefile={dataset.object_zipfile}
          bundlefileSize={dataset.object_zipfile_size}
          profile={profile}
        />
        {dataset.object_rn7_zipfile && (
          <BundleDownloadButton
            bundlefile={dataset.object_rn7_zipfile}
            bundlefileSize={dataset.object_rn7_zipfile_size}
            profile={profile}
          />
        )}
      </div>
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
    object_zipfile: PropTypes.string.isRequired,
    object_zipfile_size: PropTypes.string,
    object_rn7_zipfile: PropTypes.string,
    object_rn7_zipfile_size: PropTypes.string,
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
            key={dataset.object_zipfile}
            dataset={dataset}
            badgeFields={badgeFields}
            profile={profile}
          />
        ))}
      </div>
    </div>
  );
}

BundleDatasetCard.propTypes = {
  card: PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    studyDesign: PropTypes.string,
    description: PropTypes.string.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  profile: PropTypes.shape({}),
};

export default BundleDatasetCard;
