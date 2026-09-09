import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import useCollectionSelection from '../useCollectionSelection';
import { findCollection } from '../../lib/collectionFiles';
import { studyName, studyOf } from '../../lib/collectionScope';
import { KIND_LABELS } from '../../lib/studyDataCards';

/**
 * Picks which collections the file browser has loaded.
 *
 * This sits where the Genome Assembly facet used to. Once the browser is scoped
 * to a collection, `reference_genome` is single-valued -- the collection decides
 * it -- so filtering by it could only ever return everything or nothing. Picking
 * the collection is the useful control, and it names its genome inline.
 *
 * It follows the same rule as the Tissue, Omics and Assay facets below it:
 * nothing checked means no constraint, which here is every collection in scope.
 * So there is no select-all, only Clear.
 *
 * Every collection the user is entitled to is listed at all times; the ones
 * whose study is not currently in scope are disabled rather than hidden, so the
 * panel keeps its shape and the corpus stays legible while studies are toggled.
 *
 * Unlike those facets this changes what is *loaded*, not what is shown, so it
 * goes through the URL rather than `activeFilters`.
 */
function CollectionFilterModule({ userType = undefined }) {
  const loadingFiles = useSelector((state) => state.browseData.loadingFiles);
  const { inFileBrowser, available, entitled, selected, apply, toggle } =
    useCollectionSelection(userType);

  // A picker with a single permanently-on option is noise, and this control only
  // means anything inside the browser it scopes.
  if (!inFileBrowser || entitled.length <= 1) {
    return null;
  }

  // Labels are only unique within a study: "Quant-ID c1.0" exists in
  // rat-training-06, rat-acute-06 and human-precovid. The options are grouped
  // under their study so the short label stays readable and the ambiguity is
  // resolved by position.
  const inScope = new Set(available);
  const groups = [];
  entitled.forEach((prefix) => {
    const owner = findCollection(prefix);
    const code = studyOf(prefix);
    let group = groups.find((candidate) => candidate.code === code);
    if (!group) {
      group = { code, name: studyName(code) || code, options: [] };
      groups.push(group);
    }
    group.options.push({
      prefix,
      label: `${KIND_LABELS[owner.kind] || owner.kind} ${owner.version.collection}`,
      genome: owner.version.referenceGenome,
      enabled: inScope.has(prefix),
    });
  });
  const grouped = groups.length > 1;

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
        {groups.map((group) => (
          <div key={group.code} className="collection-filter-group">
            {grouped && (
              <div className="collection-filter-study text-muted">{group.name}</div>
            )}
            {group.options.map((option) => (
              <button
                key={option.prefix}
                type="button"
                disabled={loadingFiles || !option.enabled}
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
        ))}
      </div>
    </div>
  );
}

CollectionFilterModule.propTypes = {
  userType: PropTypes.string,
};

export default CollectionFilterModule;
