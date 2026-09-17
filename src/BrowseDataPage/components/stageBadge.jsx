import React from 'react';
import PropTypes from 'prop-types';
import { STAGE_CODES, STAGE_LABELS } from '../../lib/studyDataCards';
import { versionStages } from '../../lib/studyDataAccess';

/**
 * Release stage pill - PR, CR or EA. The abbreviation matches the prototype;
 * the full name is available on hover.
 *
 * A collection whose datasets were released at different times names more than
 * one stage, which renders as "EA / CR" with a "varies by dataset" hover, again
 * following the prototype.
 */
function StageBadge({ stage }) {
  const stages = versionStages({ releaseStage: stage }).filter((name) => STAGE_CODES[name]);

  if (stages.length === 0) {
    return null;
  }

  const varies = stages.length > 1;
  const title = varies
    ? `${stages.map((name) => `${STAGE_LABELS[name]} Release`).join(' / ')} — varies by dataset`
    : `${STAGE_LABELS[stages[0]]} Release`;

  return (
    <span
      className={`stage-badge stage-badge-${stages[0]} ${
        varies ? 'stage-badge-varies' : ''
      } badge badge-pill`}
      title={title}
    >
      {stages.map((name) => STAGE_CODES[name]).join(' / ')}
    </span>
  );
}

StageBadge.propTypes = {
  // One stage, or several comma-separated when it varies by dataset.
  stage: PropTypes.string.isRequired,
};

export default StageBadge;
