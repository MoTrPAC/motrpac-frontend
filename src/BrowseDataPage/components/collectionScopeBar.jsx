import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { findCollection } from '../../lib/collectionFiles';
import { resolveScope, studyOf } from '../../lib/collectionScope';
import { KIND_LABELS } from '../../lib/studyDataCards';

/**
 * Says what the file browser is currently showing.
 *
 * Status only -- the Collection picker in the filter panel owns selection. Two
 * controls mutating the same state from opposite ends of the screen was the
 * duplication this replaced.
 */
function CollectionScopeBar({ userType = undefined }) {
  // `selected` is the loaded selection, deliberately not filtered by
  // `available`: a URL may name a study in its path and a collection from
  // another study in its query, and `resolveScope` honours both, so two
  // collections load while `available` holds only the path study's. Filtering
  // here made the bar report one while the table showed both. The pickers
  // cannot produce that URL, but a hand-edited one or an old bookmark can.
  const {
    selectedCollections: selected, loadingFiles, fileCount, error,
  } = useSelector((state) => state.browseData);
  const location = useLocation();
  const { studyCodes, available } = resolveScope(location, userType);

  // One study in scope can be named; several cannot, so the text says how many
  // rather than inventing a combined name.
  const owner = studyCodes.length === 1 && available.length ? findCollection(available[0]) : null;
  const scopeCount = studyCodes.length || new Set(available.map(studyOf)).size;
  const scopeName = owner ? owner.card.name : `${scopeCount} studies`;

  function describe() {
    if (loadingFiles) {
      return 'Loading files…';
    }
    if (error) {
      return 'Could not load these files';
    }
    if (selected.length === 1) {
      const owner = findCollection(selected[0]);
      const kindLabel = KIND_LABELS[owner.kind] || owner.kind;
      return `Showing ${owner.card.name} — ${kindLabel} ${owner.version.collection}`;
    }
    // No selection means no constraint, which is every collection in the study.
    if (selected.length === 0) {
      return `Showing all ${available.length} collections in ${scopeName}`;
    }
    return `Showing ${selected.length} of ${available.length} collections in ${scopeName}`;
  }

  return (
    <div className="collection-scope-bar border rounded-lg px-3 py-2 mb-3 bg-light">
      <span className={`font-weight-bold ${error ? 'text-danger' : ''}`}>{describe()}</span>
      {!loadingFiles && !error && (
        <span className="text-muted ml-2">
          {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </span>
      )}
      {error && <div className="collection-scope-error text-danger small mt-1">{error}</div>}
    </div>
  );
}

CollectionScopeBar.propTypes = {
  userType: PropTypes.string,
};

export default CollectionScopeBar;
