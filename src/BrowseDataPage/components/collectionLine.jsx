import React from 'react';
import PropTypes from 'prop-types';
import { STAGE_LABELS } from '../../lib/studyDataCards';
import StageBadge from './stageBadge';

/**
 * One collection's identity line: its version, reference genome where the data
 * is genome-mapped, and either its release stage or a "latest" marker.
 *
 * The stage badge is shown inline only where the surrounding context does not
 * already establish it - the study collection cards carry it at the top of each
 * cell, and the data release cards group by stage in the first place.
 */
function CollectionLine({ version, latestLabel = undefined, showStage = false }) {
  return (
    <div className="collection-info-row d-flex align-items-center flex-wrap">
      <span className="collection-label text-muted mr-1">Collection</span>
      <span className="collection-version font-weight-bold mr-2">{version.collection}</span>
      {showStage && (
        <span className="mr-2">
          <StageBadge stage={version.releaseStage} />
        </span>
      )}
      {version.referenceGenome && (
        <span className="genome-badge badge badge-pill mr-2">{version.referenceGenome}</span>
      )}
      {latestLabel && <span className="latest-tag text-muted">{latestLabel}</span>}
    </div>
  );
}

CollectionLine.propTypes = {
  version: PropTypes.shape({
    collection: PropTypes.string.isRequired,
    referenceGenome: PropTypes.string,
    releaseStage: PropTypes.oneOf(Object.keys(STAGE_LABELS)).isRequired,
  }).isRequired,
  latestLabel: PropTypes.string,
  showStage: PropTypes.bool,
};

export default CollectionLine;
