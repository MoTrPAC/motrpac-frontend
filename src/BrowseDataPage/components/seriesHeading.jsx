import React from 'react';
import PropTypes from 'prop-types';

/**
 * Names one sub-collection within a kind.
 *
 * Only rendered when a kind holds more than one series -- an unnamed series is
 * the whole kind, which the family chip already labels. Shared by both card
 * types so the identity of a sub-collection reads the same wherever it appears.
 */
function SeriesHeading({ series }) {
  if (!series.name) {
    return null;
  }

  return (
    <div className="collection-series-head">
      <div className="collection-series-name font-weight-bold">{series.name}</div>
      {series.code && (
        <div className="collection-series-code text-muted">
          <code>{series.code}</code>
        </div>
      )}
      {series.description && (
        <p className="collection-series-desc text-muted mb-0">{series.description}</p>
      )}
    </div>
  );
}

SeriesHeading.propTypes = {
  series: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default SeriesHeading;
