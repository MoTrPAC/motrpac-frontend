import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { findCollection } from '../../lib/collectionFiles';
import { resolveScope } from '../../lib/collectionScope';
import { KIND_LABELS } from '../../lib/studyDataCards';

/**
 * Says what the file browser is currently showing.
 *
 * Status only -- the Collection picker in the filter panel owns selection. Two
 * controls mutating the same state from opposite ends of the screen was the
 * duplication this replaced.
 */
function CollectionScopeBar({ userType = undefined }) {
  const { selectedCollections, loadingFiles, fileCount, error } = useSelector(
    (state) => state.browseData
  );
  const location = useLocation();
  const { studyCode, available } = resolveScope(location, userType);

  const study = studyCode ? findCollection(available[0]) : null;
  const studyName = study ? study.card.name : null;
  const selected = selectedCollections.filter((prefix) => available.includes(prefix));

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
      return `Showing all ${available.length} collections in ${studyName}`;
    }
    return `Showing ${selected.length} of ${available.length} collections in ${studyName}`;
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
