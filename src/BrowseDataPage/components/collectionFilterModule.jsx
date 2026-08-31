import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import useCollectionSelection from '../useCollectionSelection';
import { findCollection } from '../../lib/collectionFiles';
import { KIND_LABELS } from '../../lib/studyDataCards';

/**
 * Picks which of the current study's collections the file browser has loaded.
 *
 * This sits where the Genome Assembly facet used to. Once the browser is scoped
 * to a collection, `reference_genome` is single-valued -- the collection decides
 * it -- so filtering by it could only ever return everything or nothing. Picking
 * the collection is the useful control, and it names its genome inline.
 *
 * It follows the same rule as the Tissue, Omics and Assay facets below it:
 * nothing checked means no constraint, which here is every collection in the
 * study. So there is no select-all, only Clear.
 *
 * Unlike those facets this changes what is *loaded*, not what is shown, so it
 * goes through the URL rather than `activeFilters`.
 */
function CollectionFilterModule({ userType = undefined }) {
  const loadingFiles = useSelector((state) => state.browseData.loadingFiles);
  const { studyCode, available, selected, apply, toggle } = useCollectionSelection(userType);

  // A picker with a single permanently-on option is noise.
  if (!studyCode || available.length <= 1) {
    return null;
  }

  const options = available.map((prefix) => {
    const owner = findCollection(prefix);
    return {
      prefix,
      label: `${KIND_LABELS[owner.kind] || owner.kind} ${owner.version.collection}`,
      genome: owner.version.referenceGenome,
    };
  });

  return (
    <div className="card filter-module collection-filter-module mb-4">
      <div className="card-header font-weight-bold d-flex align-items-center">
        <div>Collection</div>
        {selected.length > 0 && (
          <button
            type="button"
            className="btn btn-link btn-sm ml-auto p-0 collection-filter-clear"
            disabled={loadingFiles}
            onClick={() => apply([])}
          >
            Clear
          </button>
        )}
      </div>
      <div className="card-body">
        {options.map((option) => (
          <button
            key={option.prefix}
            type="button"
            disabled={loadingFiles}
            aria-pressed={selected.includes(option.prefix)}
            className={`btn filterBtn ${selected.includes(option.prefix) ? 'activeFilter' : ''}`}
            onClick={() => toggle(option.prefix)}
          >
            {option.label}
            {option.genome && (
              <span className="collection-filter-genome ml-1">{option.genome}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

CollectionFilterModule.propTypes = {
  userType: PropTypes.string,
};

export default CollectionFilterModule;
