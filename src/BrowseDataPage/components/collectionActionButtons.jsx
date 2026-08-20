import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Per-collection actions: browse the collection's files, and (for consortium
 * members only) reveal its Google Cloud Storage path. Shared by the study
 * collection cards and the data release cards so both behave identically.
 */
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

export default CollectionActionButtons;
