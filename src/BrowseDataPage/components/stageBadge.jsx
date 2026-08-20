import React from 'react';
import PropTypes from 'prop-types';
import { STAGE_CODES, STAGE_LABELS } from '../../lib/studyDataCards';

/**
 * Release stage pill - PR (Public Release) or CR (Consortium Release). The
 * abbreviation matches the prototype; the full name is available on hover.
 */
function StageBadge({ stage }) {
  return (
    <span
      className={`stage-badge stage-badge-${stage} badge badge-pill`}
      title={`${STAGE_LABELS[stage]} Release`}
    >
      {STAGE_CODES[stage]}
    </span>
  );
}

StageBadge.propTypes = {
  stage: PropTypes.oneOf(Object.keys(STAGE_LABELS)).isRequired,
};

export default StageBadge;
